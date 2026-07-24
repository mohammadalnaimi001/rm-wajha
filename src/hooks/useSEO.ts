import { useEffect } from "react";
import { useLang, type Pair } from "@/context/LanguageContext";

/** Sets document title + meta description, per language. */
export function useSEO(title: Pair, description: Pair) {
  const { L, lang } = useLang();
  useEffect(() => {
    document.title = L(title);
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", L(description));
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps
}
