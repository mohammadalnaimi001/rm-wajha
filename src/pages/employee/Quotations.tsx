import { useAuth } from "@/features/auth/AuthContext";
import QuotationsList from "@/features/quotations/QuotationsList";
import { Loading } from "@/features/dashboard/components";

export default function EmployeeQuotations() {
  const { profile } = useAuth();
  if (!profile) return <Loading />;
  return <QuotationsList basePath="employee" employeeId={profile.id} />;
}
