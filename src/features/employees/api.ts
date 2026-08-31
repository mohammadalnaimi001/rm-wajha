import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/db";

export async function listEmployees(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "employee")
    .order("full_name");
  if (error) throw error;
  return data as Profile[];
}

export async function getEmployee(id: string): Promise<Profile> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Profile;
}

export async function setEmployeeActive(id: string, active: boolean): Promise<void> {
  const { error } = await supabase.from("profiles").update({ active }).eq("id", id);
  if (error) throw error;
}

export async function updateEmployeeProfile(
  id: string,
  patch: Partial<Pick<Profile, "full_name" | "phone">>
): Promise<void> {
  const { error } = await supabase.from("profiles").update(patch).eq("id", id);
  if (error) throw error;
}

export interface CreateEmployeeInput {
  email: string;
  password: string;
  full_name: string;
  phone: string;
}

export async function createEmployee(input: CreateEmployeeInput): Promise<Profile> {
  const { data, error } = await supabase.functions.invoke("admin-users", {
    body: { action: "create", ...input }
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data.profile as Profile;
}

export async function sendPasswordReset(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}
