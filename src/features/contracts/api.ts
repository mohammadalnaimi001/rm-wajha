import { supabase } from "@/lib/supabase";
import type { Contract, ContractItem, ContractStatus } from "@/types/db";

export type ContractWithItems = Contract & { contract_items: ContractItem[] };

export async function listContracts(filters?: {
  employeeId?: string;
  status?: ContractStatus;
  search?: string;
}): Promise<Contract[]> {
  let query = supabase.from("contracts").select("*").order("created_at", { ascending: false });
  if (filters?.employeeId) query = query.eq("employee_id", filters.employeeId);
  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.search) query = query.ilike("customer_name", `%${filters.search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data as Contract[];
}

export async function getContractByQuotationId(quotationId: string): Promise<Contract | null> {
  const { data, error } = await supabase.from("contracts").select("*").eq("quotation_id", quotationId).maybeSingle();
  if (error) throw error;
  return data as Contract | null;
}

export async function getContract(id: string): Promise<ContractWithItems> {
  const { data, error } = await supabase
    .from("contracts")
    .select("*, contract_items(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as ContractWithItems;
}

export async function updateContractStatus(id: string, status: ContractStatus): Promise<void> {
  const { error } = await supabase.from("contracts").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function updateContractNotes(id: string, notes: string): Promise<void> {
  const { error } = await supabase.from("contracts").update({ notes }).eq("id", id);
  if (error) throw error;
}
