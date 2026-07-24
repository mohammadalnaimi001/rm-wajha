import ServicePage from "@/components/sections/ServicePage";
import { getService } from "@/lib/services";

export default function AISolutions() {
  return <ServicePage service={getService("ai-solutions")} />;
}
