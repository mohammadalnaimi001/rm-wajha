import ServicePage from "@/components/sections/ServicePage";
import { getService } from "@/lib/services";

export default function Branding() {
  return <ServicePage service={getService("branding")} />;
}
