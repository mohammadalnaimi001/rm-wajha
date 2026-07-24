import type { Pair } from "@/context/LanguageContext";

export interface Service {
  slug: string;
  name: Pair;
  h1: Pair;
  sub: Pair;
  overview: Pair;
  cardDesc: Pair;
  chips: Pair[];
}

export const servicePath = (s: Service) => `/services/${s.slug}`;

export const SERVICES: Service[] = [
  {
    slug: "web-development",
    name: { en: "Web Development", ar: "تطوير المواقع" },
    h1: { en: "Websites that load fast and sell faster.", ar: "مواقع تُحمَّل بسرعة وتبيع أسرع." },
    sub: { en: "From a single landing page to a full e-commerce platform — engineered for speed, search, and conversion.", ar: "من صفحة هبوط واحدة إلى منصة تجارة إلكترونية كاملة — مهندسة للسرعة ومحركات البحث والتحويل." },
    overview: { en: "Your website is your hardest-working salesperson. We build sites that open instantly, rank on Google, and guide visitors toward one clear action — a purchase, a booking, or a message. Every build ships with a CMS your team can edit without a developer.", ar: "موقعك هو مندوب المبيعات الأكثر اجتهاداً لديك. نبني مواقع تفتح فوراً وتتصدر جوجل وتقود الزوار نحو إجراء واحد واضح — شراء أو حجز أو رسالة. وكل مشروع يُسلَّم بنظام إدارة محتوى يحرره فريقك دون مطوّر." },
    cardDesc: { en: "High-performance websites, portals & storefronts engineered to convert.", ar: "مواقع وبوابات ومتاجر عالية الأداء مصممة للتحويل." },
    chips: [
      { en: "Business Websites", ar: "مواقع الأعمال" }, { en: "Landing Pages", ar: "صفحات هبوط" },
      { en: "Corporate Websites", ar: "مواقع الشركات" }, { en: "Portals", ar: "بوابات إلكترونية" },
      { en: "Dashboards", ar: "لوحات تحكم" }, { en: "Booking Systems", ar: "أنظمة حجز" },
      { en: "E-commerce", ar: "تجارة إلكترونية" }
    ]
  },
  {
    slug: "mobile-app-development",
    name: { en: "Mobile Apps", ar: "تطبيقات الجوال" },
    h1: { en: "Your business, in their pocket.", ar: "عملك في جيب عملائك." },
    sub: { en: "Native-quality iOS and Android apps built from a single codebase — faster to ship, easier to maintain.", ar: "تطبيقات iOS وAndroid بجودة أصلية من قاعدة كود واحدة — أسرع في الإطلاق وأسهل في الصيانة." },
    overview: { en: "We build mobile apps with Flutter and React Native, so one codebase runs on both platforms — cutting cost and time without cutting quality. From ordering apps to internal tools, we handle design, development, and store publishing.", ar: "نبني تطبيقات الجوال باستخدام Flutter وReact Native، فتعمل قاعدة كود واحدة على المنصتين — لتقليل التكلفة والوقت دون المساس بالجودة. من تطبيقات الطلب إلى الأدوات الداخلية، نتولى التصميم والتطوير والنشر على المتاجر." },
    cardDesc: { en: "iOS & Android apps with native quality — from one codebase.", ar: "تطبيقات iOS وAndroid بجودة أصلية — من قاعدة كود واحدة." },
    chips: [
      { en: "Android", ar: "Android" }, { en: "iOS", ar: "iOS" },
      { en: "Cross-platform", ar: "تطبيقات متعددة المنصات" }, { en: "Flutter", ar: "Flutter" },
      { en: "React Native", ar: "React Native" }
    ]
  },
  {
    slug: "saas-development",
    name: { en: "SaaS Development", ar: "تطوير SaaS" },
    h1: { en: "From idea to scalable SaaS.", ar: "من الفكرة إلى SaaS قابل للتوسع." },
    sub: { en: "Multi-tenant platforms with authentication, subscriptions, billing, and admin dashboards — built to grow.", ar: "منصات متعددة المستأجرين مع تسجيل دخول واشتراكات وفوترة ولوحات إدارة — مبنية لتنمو." },
    overview: { en: "Whether you are launching a SaaS product or need a custom CRM or ERP for your own operations, we build the full stack: secure authentication, subscription and billing logic, admin dashboards, and clean APIs — architected to scale from your first user onward.", ar: "سواء كنت تطلق منتج SaaS أو تحتاج نظام CRM أو ERP مخصصاً لعملياتك، نبني الحزمة الكاملة: تسجيل دخول آمن، ومنطق اشتراكات وفوترة، ولوحات إدارة، وواجهات API نظيفة — ببنية تتوسع من مستخدمك الأول فصاعداً." },
    cardDesc: { en: "From MVP to scale — multi-tenant platforms, billing, and dashboards.", ar: "من MVP إلى التوسع — منصات وفوترة ولوحات تحكم." },
    chips: [
      { en: "SaaS Platforms", ar: "منصات SaaS" }, { en: "CRM", ar: "أنظمة CRM" }, { en: "ERP", ar: "أنظمة ERP" },
      { en: "Admin Dashboards", ar: "لوحات إدارة" }, { en: "Authentication", ar: "تسجيل الدخول والصلاحيات" },
      { en: "Subscription Systems", ar: "أنظمة اشتراكات" }, { en: "Billing", ar: "الفوترة" },
      { en: "API Development", ar: "تطوير API" }
    ]
  },
  {
    slug: "ai-solutions",
    name: { en: "AI Solutions", ar: "حلول الذكاء الاصطناعي" },
    h1: { en: "Your best employee never sleeps.", ar: "أفضل موظف لديك لا ينام." },
    sub: { en: "Custom AI trained on your business — answering, qualifying, booking, and selling around the clock.", ar: "ذكاء اصطناعي مخصص مدرّب على أعمالك — يجيب ويؤهل ويحجز ويبيع على مدار الساعة." },
    overview: { en: "We build AI chatbots and agents grounded in your own data — menus, prices, policies, documents — so answers stay accurate. They live on your website, WhatsApp, and Instagram, hand off to your team when it matters, and automate the workflows that eat your day.", ar: "نبني روبوتات محادثة ووكلاء ذكاء اصطناعي مبنية على بياناتك أنت — القوائم والأسعار والسياسات والمستندات — لتبقى الإجابات دقيقة. تعمل على موقعك وواتساب وإنستغرام، وتحوّل المحادثة لفريقك عند الحاجة، وتؤتمت المهام التي تستهلك يومك." },
    cardDesc: { en: "Chatbots, agents & automations that sell and support while you sleep.", ar: "روبوتات ووكلاء وأتمتة تبيع وتدعم وأنت نائم." },
    chips: [
      { en: "AI Chatbots", ar: "روبوتات محادثة" }, { en: "AI Agents", ar: "وكلاء AI" },
      { en: "Customer Support AI", ar: "دعم عملاء ذكي" }, { en: "AI Automation", ar: "أتمتة ذكية" },
      { en: "AI Integrations", ar: "تكاملات AI" }, { en: "AI Workflows", ar: "مسارات عمل ذكية" },
      { en: "Business AI", ar: "ذكاء اصطناعي للأعمال" }
    ]
  },
  {
    slug: "business-automation",
    name: { en: "Business Automation", ar: "أتمتة الأعمال" },
    h1: { en: "Eliminate the busywork.", ar: "تخلّص من العمل الروتيني." },
    sub: { en: "We connect your tools into one system — so data moves itself and your team focuses on real work.", ar: "نربط أدواتك في نظام واحد — لتتحرك البيانات وحدها ويتفرغ فريقك للعمل الحقيقي." },
    overview: { en: "Copy-pasting between spreadsheets, chasing follow-ups, sending the same message fifty times — that is what we automate. From CRM and email flows to WhatsApp notifications and internal systems, we design automations around how your business actually works.", ar: "النسخ واللصق بين الجداول، وملاحقة المتابعات، وإرسال الرسالة نفسها خمسين مرة — هذا ما نؤتمته. من مسارات CRM والبريد إلى إشعارات واتساب والأنظمة الداخلية، نصمم الأتمتة حول طريقة عمل شركتك الفعلية." },
    cardDesc: { en: "Connect your tools and eliminate repetitive work.", ar: "اربط أدواتك وتخلّص من العمل المتكرر." },
    chips: [
      { en: "Workflow Automation", ar: "أتمتة سير العمل" }, { en: "CRM Automation", ar: "أتمتة CRM" },
      { en: "Email Automation", ar: "أتمتة البريد" }, { en: "WhatsApp Automation", ar: "أتمتة واتساب" },
      { en: "Internal Systems", ar: "أنظمة داخلية" }
    ]
  },
  {
    slug: "digital-marketing",
    name: { en: "Digital Marketing", ar: "التسويق الرقمي" },
    h1: { en: "Traffic is easy. Profit is engineering.", ar: "الزيارات سهلة. الربح هندسة." },
    sub: { en: "Full-funnel campaigns across Google, Meta, TikTok, and Snapchat — measured on revenue, not impressions.", ar: "حملات متكاملة عبر جوجل وميتا وتيك توك وسناب شات — تُقاس بالإيرادات لا بالانطباعات." },
    overview: { en: "We set up tracking properly before spending a single dollar, then build campaigns across search, social, and email. Clear reporting shows exactly what your budget returns — and conversion optimization keeps improving the numbers month over month.", ar: "نضبط التتبع بشكل صحيح قبل إنفاق أي دولار، ثم نبني الحملات عبر البحث والسوشيال والبريد. تقارير واضحة تريك بالضبط ما تعيده ميزانيتك — وتحسين التحويل يواصل رفع الأرقام شهراً بعد شهر." },
    cardDesc: { en: "Full-funnel campaigns measured on revenue — not impressions.", ar: "حملات متكاملة تُقاس بالإيرادات — لا بالانطباعات." },
    chips: [
      { en: "SEO", ar: "SEO" }, { en: "Local SEO", ar: "SEO محلي" }, { en: "Google Ads", ar: "إعلانات جوجل" },
      { en: "Meta Ads", ar: "إعلانات ميتا" }, { en: "TikTok Ads", ar: "إعلانات تيك توك" },
      { en: "Snapchat Ads", ar: "إعلانات سناب شات" }, { en: "Email Marketing", ar: "التسويق بالبريد" },
      { en: "Analytics", ar: "التحليلات" }, { en: "Conversion Optimization", ar: "تحسين التحويل" }
    ]
  },
  {
    slug: "branding",
    name: { en: "Branding & Design", ar: "الهوية والتصميم" },
    h1: { en: "Look like the leader before you are one.", ar: "ابدُ كالرائد قبل أن تصبحه." },
    sub: { en: "Strategy-first identities with complete systems — consistent across every channel.", ar: "هويات تبدأ من الاستراتيجية مع أنظمة كاملة — متسقة عبر كل قناة." },
    overview: { en: "A logo is not a brand. We start with positioning and messaging, then design the full system: identity, guidelines, social media templates, UI and UX, print, and motion — so your brand looks and feels the same everywhere your customers meet it.", ar: "الشعار ليس علامة تجارية. نبدأ بالتموضع والرسائل، ثم نصمم النظام الكامل: الهوية والأدلة وقوالب السوشيال وواجهات UI وUX والمطبوعات والموشن — لتبدو علامتك متسقة في كل مكان يلتقيها فيه عملاؤك." },
    cardDesc: { en: "Identities that make your brand impossible to ignore.", ar: "هويات تجعل تجاهل علامتك مستحيلاً." },
    chips: [
      { en: "Logo Design", ar: "تصميم الشعارات" }, { en: "Brand Identity", ar: "الهوية البصرية" },
      { en: "Social Media Design", ar: "تصاميم السوشيال ميديا" }, { en: "UI Design", ar: "تصميم UI" },
      { en: "UX Design", ar: "تصميم UX" }, { en: "Print Design", ar: "تصميم المطبوعات" },
      { en: "Motion Design", ar: "موشن ديزاين" }
    ]
  },
  {
    slug: "business-intelligence",
    name: { en: "Business Intelligence", ar: "ذكاء الأعمال" },
    h1: { en: "Decisions backed by data.", ar: "قرارات مدعومة بالبيانات." },
    sub: { en: "Live dashboards, KPI systems, and reporting that turn scattered data into clear answers.", ar: "لوحات مباشرة وأنظمة KPI وتقارير تحوّل البيانات المتناثرة إلى إجابات واضحة." },
    overview: { en: "Your data is already telling a story — most businesses just cannot see it. We connect your sources into dashboards built with tools like Power BI, define the KPIs that actually matter, and set up reporting and forecasting so you run the business on numbers, not guesses.", ar: "بياناتك تروي قصة بالفعل — لكن معظم الشركات لا تراها. نربط مصادرك بلوحات مبنية بأدوات مثل Power BI، ونحدد مؤشرات الأداء المهمة فعلاً، ونجهز التقارير والتنبؤ لتدير عملك بالأرقام لا بالتخمين." },
    cardDesc: { en: "Dashboards and reporting that turn raw data into decisions.", ar: "لوحات وتقارير تحوّل البيانات الخام إلى قرارات." },
    chips: [
      { en: "Dashboards", ar: "لوحات تحكم" }, { en: "Power BI", ar: "Power BI" },
      { en: "Data Analytics", ar: "تحليلات البيانات" }, { en: "Reporting", ar: "التقارير" },
      { en: "KPI Systems", ar: "أنظمة KPI" }, { en: "Forecasting", ar: "التنبؤ" },
      { en: "Business Insights", ar: "رؤى الأعمال" }
    ]
  },
  {
    slug: "loyalty-programs",
    name: { en: "Loyalty Programs", ar: "برامج الولاء" },
    h1: { en: "Loyalty programs that bring customers back.", ar: "برامج ولاء تعيد عملاءك إليك." },
    sub: { en: "A complete digital loyalty solution — cards, points, rewards, referrals, and analytics — built for local businesses.", ar: "حل ولاء رقمي متكامل — بطاقات ونقاط ومكافآت وإحالات وتحليلات — مصمم للأعمال المحلية." },
    overview: { en: "Winning a new customer costs far more than keeping an existing one — and regulars spend more, visit more often, and bring their friends. A loyalty program gives customers a clear reason to choose you again, and gives you a direct channel plus real data on who they are and what they love.", ar: "كسب عميل جديد يكلف أكثر بكثير من الحفاظ على عميل حالي — والعملاء الدائمون ينفقون أكثر ويزورون أكثر ويحضرون أصدقاءهم. برنامج الولاء يمنح عملاءك سبباً واضحاً لاختيارك مجدداً، ويمنحك قناة مباشرة وبيانات حقيقية عن هويتهم وما يحبونه." },
    cardDesc: { en: "Turn first-time visitors into regulars with digital loyalty.", ar: "حوّل الزوار الجدد إلى عملاء دائمين بالولاء الرقمي." },
    chips: []
  }
];

export function getService(slug: string): Service {
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) throw new Error(`Unknown service: ${slug}`);
  return s;
}
