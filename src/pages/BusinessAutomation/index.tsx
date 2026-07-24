import ServicePage from "@/components/sections/ServicePage";
import { getService } from "@/lib/services";

export default function BusinessAutomation() {
  return <ServicePage service={getService("business-automation")} />;
}
