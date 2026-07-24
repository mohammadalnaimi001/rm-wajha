import ServicePage from "@/components/sections/ServicePage";
import { getService } from "@/lib/services";

export default function BusinessIntelligence() {
  return <ServicePage service={getService("business-intelligence")} />;
}
