export type Role = "admin" | "employee";

export type QuotationStatus = "DRAFT" | "SENT" | "APPROVED" | "REJECTED" | "EXPIRED";
export type ContractStatus = "PENDING" | "CONFIRMED" | "PAID" | "CANCELLED";

export type ServiceCategory =
  | "Website"
  | "Booking"
  | "Digital Identity"
  | "Analytics"
  | "SEO"
  | "AI"
  | "Automation"
  | "Mobile"
  | "Other";

export interface Profile {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: Role;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeeTarget {
  id: string;
  employee_id: string;
  month: string; // YYYY-MM-01
  target: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string | null;
  price: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Quotation {
  id: string;
  quotation_number: string;
  employee_id: string;
  customer_name: string;
  company_name: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  subtotal: number;
  discount: number;
  total: number;
  notes: string | null;
  status: QuotationStatus;
  created_at: string;
  updated_at: string;
}

export interface QuotationItem {
  id: string;
  quotation_id: string;
  service_id: string | null;
  service_name: string;
  price: number;
  created_at: string;
}

export interface Contract {
  id: string;
  contract_number: string;
  employee_id: string;
  quotation_id: string | null;
  customer_name: string;
  company_name: string | null;
  phone: string | null;
  email: string | null;
  total: number;
  status: ContractStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContractItem {
  id: string;
  contract_id: string;
  service_id: string | null;
  service_name: string;
  price: number;
  created_at: string;
}

export interface MyPerformance {
  employee_id: string;
  full_name: string;
  total_contracts: number;
  confirmed_contracts: number;
  paid_contracts: number;
  cancelled_contracts: number;
  total_sales: number;
  monthly_sales: number;
  weekly_sales: number;
  average_contract_value: number;
  monthly_target: number;
  achievement_pct: number;
  rank: number;
  headcount: number;
}
