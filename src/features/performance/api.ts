import { supabase } from "@/lib/supabase";
import type { Contract, MyPerformance, Profile } from "@/types/db";

export async function getMyPerformance(month?: string): Promise<MyPerformance | null> {
  const { data, error } = await supabase.rpc("get_my_performance", month ? { p_month: month } : {});
  if (error) throw error;
  const rows = data as MyPerformance[] | null;
  return rows && rows.length > 0 ? rows[0] : null;
}

export interface EmployeePerformanceRow {
  employee_id: string;
  full_name: string;
  active: boolean;
  total_contracts: number;
  confirmed_contracts: number;
  paid_contracts: number;
  cancelled_contracts: number;
  total_sales: number;
  monthly_sales: number;
  monthly_target: number;
  achievement_pct: number;
  average_contract_value: number;
}

/** Admin-only: full breakdown across every employee, computed client-side
 * from the raw tables (safe because RLS grants admins full SELECT access). */
export async function getAllEmployeePerformance(month: string): Promise<EmployeePerformanceRow[]> {
  const monthStart = `${month}-01`;
  const monthDate = new Date(monthStart);
  const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1).toISOString().slice(0, 10);

  const [{ data: profiles, error: pErr }, { data: contracts, error: cErr }, { data: targets, error: tErr }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("role", "employee"),
      supabase.from("contracts").select("*"),
      supabase.from("employee_targets").select("*").eq("month", monthStart)
    ]);
  if (pErr) throw pErr;
  if (cErr) throw cErr;
  if (tErr) throw tErr;

  const targetByEmployee = new Map((targets ?? []).map((t) => [t.employee_id as string, t.target as number]));

  return ((profiles ?? []) as Profile[]).map((p) => {
    const own = ((contracts ?? []) as Contract[]).filter((c) => c.employee_id === p.id);
    const counted = own.filter((c) => c.status === "CONFIRMED" || c.status === "PAID");
    const monthly = counted.filter((c) => c.created_at >= monthStart && c.created_at < monthEnd);
    const totalSales = counted.reduce((s, c) => s + Number(c.total), 0);
    const monthlySales = monthly.reduce((s, c) => s + Number(c.total), 0);
    const target = targetByEmployee.get(p.id) ?? 0;

    return {
      employee_id: p.id,
      full_name: p.full_name,
      active: p.active,
      total_contracts: own.length,
      confirmed_contracts: own.filter((c) => c.status === "CONFIRMED").length,
      paid_contracts: own.filter((c) => c.status === "PAID").length,
      cancelled_contracts: own.filter((c) => c.status === "CANCELLED").length,
      total_sales: totalSales,
      monthly_sales: monthlySales,
      monthly_target: target,
      achievement_pct: target > 0 ? Math.round((monthlySales / target) * 1000) / 10 : 0,
      average_contract_value: counted.length > 0 ? totalSales / counted.length : 0
    };
  });
}

export async function setEmployeeTarget(employeeId: string, month: string, target: number): Promise<void> {
  const monthStart = `${month}-01`;
  const { error } = await supabase
    .from("employee_targets")
    .upsert({ employee_id: employeeId, month: monthStart, target }, { onConflict: "employee_id,month" });
  if (error) throw error;
}
