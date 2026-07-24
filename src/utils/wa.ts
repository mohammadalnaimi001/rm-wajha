import { CONFIG } from "@/lib/config";

export const waLink = (message: string): string =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
