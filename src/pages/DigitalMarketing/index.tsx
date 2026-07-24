import ServicePage from "@/components/sections/ServicePage";
import { getService } from "@/lib/services";

export default function DigitalMarketing() {
  return <ServicePage service={getService("digital-marketing")} />;
}
