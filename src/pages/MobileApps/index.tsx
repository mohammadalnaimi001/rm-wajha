import ServicePage from "@/components/sections/ServicePage";
import { getService } from "@/lib/services";

export default function MobileApps() {
  return <ServicePage service={getService("mobile-app-development")} />;
}
