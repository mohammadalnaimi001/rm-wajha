import ServicePage from "@/components/sections/ServicePage";
import { getService } from "@/lib/services";

export default function SaaS() {
  return <ServicePage service={getService("saas-development")} />;
}
