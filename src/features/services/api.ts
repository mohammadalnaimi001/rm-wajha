import { supabase } from "@/lib/supabase";
import type { Service, ServiceCategory } from "@/types/db";

export async function listServices(opts?: { onlyActive?: boolean }): Promise<Service[]> {
  let query = supabase.from("services").select("*").order("category").order("name");
  if (opts?.onlyActive) query = query.eq("active", true);
  const { data, error } = await query;
  if (error) throw error;
  return data as Service[];
}

export async function createService(input: {
  name: string;
  category: ServiceCategory;
  description: string;
  price: number;
}): Promise<Service> {
  const { data, error } = await supabase.from("services").insert(input).select().single();
  if (error) throw error;
  return data as Service;
}

export async function updateService(
  id: string,
  patch: Partial<Pick<Service, "name" | "category" | "description" | "price" | "active">>
): Promise<Service> {
  const { data, error } = await supabase.from("services").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data as Service;
}
