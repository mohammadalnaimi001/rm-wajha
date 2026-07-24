import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";
export type Pair = { en: string; ar: string };

type LanguageCtx = {
  lang: Lang;
  toggle: () => void;
  /** Pick the current-language value from a bilingual pair. */
  L: (p: Pair) => string;
};

const Ctx = createContext<LanguageCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const value: LanguageCtx = {
    lang,
    toggle: () => setLang((l) => (l === "en" ? "ar" : "en")),
    L: (p) => p[lang]
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LanguageCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}
