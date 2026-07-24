const PATHS: Record<string, string> = {
  "web-development": "m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16",
  "mobile-app-development": "M11 18h2M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z",
  "saas-development": "M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A4 4 0 0 0 7 19Z",
  "ai-solutions": "M12 3v2M5.2 5.2l1.4 1.4M3 12h2M5.2 18.8l1.4-1.4M12 21v-2M18.8 18.8l-1.4-1.4M21 12h-2M18.8 5.2l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  "business-automation": "M8 6h8a3 3 0 0 1 3 3v1M16 18H8a3 3 0 0 1-3-3v-1M8 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM22 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  "digital-marketing": "M3 11 21 5l-4 14-6.5-4.5L3 11ZM10.5 14.5 9 20l2.5-3",
  branding: "M17 2l5 5-9.5 9.5a2 2 0 0 1-1 .55L7 18l1-4.5a2 2 0 0 1 .55-1L12 9M2 22l3-3M16 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z",
  "business-intelligence": "M3 3v18h18M7 15v2M11 11v6M15 7v10M19 4v13",
  "loyalty-programs": "m12 2 3 6.6 7 .9-5.2 4.9 1.4 7L12 18l-6.2 3.4 1.4-7L2 9.5l7-.9Z"
};

export default function ServiceIcon({ slug }: { slug: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[slug] ?? PATHS["web-development"]} />
    </svg>
  );
}
