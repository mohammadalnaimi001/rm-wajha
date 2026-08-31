import { useAuth } from "@/features/auth/AuthContext";
import ContractsList from "@/features/contracts/ContractsList";
import { Loading } from "@/features/dashboard/components";

export default function EmployeeContracts() {
  const { profile } = useAuth();
  if (!profile) return <Loading />;
  return <ContractsList basePath="employee" employeeId={profile.id} />;
}
