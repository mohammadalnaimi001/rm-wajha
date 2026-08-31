import { supabase } from "@/lib/supabase";
import type { Quotation, QuotationItem, QuotationStatus } from "@/types/db";

export type QuotationWithItems = Quotation & { quotation_items: QuotationItem[] };

export async function listQuotations(filters?: {
  employeeId?: string;
  status?: QuotationStatus;
  search?: string;
}): Promise<Quotation[]> {
  let query = supabase.from("quotations").select("*").order("created_at", { ascending: false });
  if (filters?.employeeId) query = query.eq("employee_id", filters.employeeId);
  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.search) query = query.ilike("customer_name", `%${filters.search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data as Quotation[];
}

export async function getQuotation(id: string): Promise<QuotationWithItems> {
  const { data, error } = await supabase
    .from("quotations")
    .select("*, quotation_items(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as QuotationWithItems;
}

export interface CreateQuotationInput {
  employee_id: string;
  customer_name: string;
  company_name: string;
  phone: string;
  email: string;
  instagram: string;
  discount: number;
  notes: string;
  items: { service_id: string; service_name: string; price: number }[];
}

export async function createQuotation(input: CreateQuotationInput): Promise<Quotation> {
  const subtotal = input.items.reduce((sum, i) => sum + i.price, 0);
  const total = Math.max(0, subtotal - input.discount);

  const { data: quotation, error } = await supabase
    .from("quotations")
    .insert({
      employee_id: input.employee_id,
      customer_name: input.customer_name,
      company_name: input.company_name || null,
      phone: input.phone || null,
      email: input.email || null,
      instagram: input.instagram || null,
      subtotal,
      discount: input.discount,
      total,
      notes: input.notes || null,
      status: "DRAFT"
    })
    .select()
    .single();
  if (error) throw error;

  if (input.items.length > 0) {
    const { error: itemsError } = await supabase.from("quotation_items").insert(
      input.items.map((i) => ({
        quotation_id: quotation.id,
        service_id: i.service_id,
        service_name: i.service_name,
        price: i.price
      }))
    );
    if (itemsError) throw itemsError;
  }

  return quotation as Quotation;
}

export async function updateQuotationStatus(id: string, status: QuotationStatus): Promise<void> {
  const { error } = await supabase.from("quotations").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function convertQuotationToContract(quotationId: string): Promise<string> {
  const quotation = await getQuotation(quotationId);

  const { data: contract, error } = await supabase
    .from("contracts")
    .insert({
      employee_id: quotation.employee_id,
      quotation_id: quotation.id,
      customer_name: quotation.customer_name,
      company_name: quotation.company_name,
      phone: quotation.phone,
      email: quotation.email,
      total: quotation.total,
      status: "PENDING",
      notes: quotation.notes
    })
    .select()
    .single();
  if (error) throw error;

  if (quotation.quotation_items.length > 0) {
    const { error: itemsError } = await supabase.from("contract_items").insert(
      quotation.quotation_items.map((i) => ({
        contract_id: contract.id,
        service_id: i.service_id,
        service_name: i.service_name,
        price: i.price
      }))
    );
    if (itemsError) throw itemsError;
  }

  return contract.id as string;
}
