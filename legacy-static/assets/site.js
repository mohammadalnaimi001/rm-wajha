/* =====================================================
   Nexora — shared site wiring (all pages)
   Expects page-level globals: CONFIG, WA_MSGS, I18N
   ===================================================== */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let lang = "en";

const metaDesc = document.querySelector('meta[name="description"]');
const langBtn  = document.getElementById("langToggle");
const menuBtn  = document.getElementById("menuBtn");
const toTop    = document.getElementById("toTop");

/* WhatsApp deep links (localized) */
function wireWa(){
  $$(".wa-link").forEach(a => {
    const pkg = a.getAttribute("data-pkg") || "default";
    const msgs = WA_MSGS[lang] || WA_MSGS.en;
    a.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msgs[pkg] || msgs.default);
  });
}

/* i18n */
function applyLang(){
  const d = I18N[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir  = lang === "ar" ? "rtl" : "ltr";
  $$("[data-i18n]").forEach(el => {
    const k = el.getAttribute("data-i18n");
    if (d[k] !== undefined) el.textContent = d[k];
  });
  $$("[data-i18n-ph]").forEach(el => {
    const k = el.getAttribute("data-i18n-ph");
    if (d[k] !== undefined) el.placeholder = d[k];
  });
  if (langBtn){
    langBtn.textContent = lang === "ar" ? "EN" : "عربي";
    langBtn.setAttribute("aria-label", lang === "ar" ? "Switch to English" : "التبديل إلى العربية");
  }
  if (d.meta_title) document.title = d.meta_title;
  if (metaDesc && d.meta_desc) metaDesc.setAttribute("content", d.meta_desc);
  if (menuBtn) menuBtn.setAttribute("aria-label", document.body.classList.contains("menu-open") ? d.aria_menu_close : d.aria_menu_open);
  if (toTop && d.ft_top) toTop.setAttribute("aria-label", d.ft_top);
  const nlBtn = document.getElementById("nlBtn");
  if (nlBtn) nlBtn.setAttribute("aria-label", lang === "ar" ? "اشترك" : "Subscribe");
  wireWa();
}
if (langBtn) langBtn.addEventListener("click", () => { lang = lang === "ar" ? "en" : "ar"; applyLang(); });

/* mobile menu */
if (menuBtn){
  menuBtn.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", I18N[lang][open ? "aria_menu_close" : "aria_menu_open"]);
  });
  $$("#mobileMenu a").forEach(a => a.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    menuBtn.setAttribute("aria-expanded", "false");
  }));
}

/* nav scroll state + back-to-top */
const nav = document.getElementById("siteNav");
let ticking = false;
function onScroll(){
  if (nav)   nav.classList.toggle("scrolled", scrollY > 10);
  if (toTop) toTop.classList.toggle("show", scrollY > 700);
}
addEventListener("scroll", () => {
  if (!ticking){ requestAnimationFrame(() => { onScroll(); ticking = false; }); ticking = true; }
}, { passive: true });
onScroll();
if (toTop) toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" }));

/* fade-in reveal */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
$$(".reveal").forEach(el => io.observe(el));

/* active nav link (same-page anchors only) */
const secMap = {};
$$(".nav-links a").forEach(a => {
  const h = a.getAttribute("href") || "";
  if (h.startsWith("#")) secMap[h.slice(1)] = a;
});
if (Object.keys(secMap).length){
  const sio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const link = secMap[e.target.id];
      if (link && e.isIntersecting){
        $$(".nav-links a").forEach(x => x.classList.remove("active"));
        link.classList.add("active");
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  Object.keys(secMap).forEach(id => { const s = document.getElementById(id); if (s) sio.observe(s); });
}

/* contact form → composed WhatsApp message (home page) */
const form = document.getElementById("contactForm");
if (form) form.addEventListener("submit", e => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const d = I18N[lang];
  const g = id => document.getElementById(id);
  const sv = g("fService"), bu = g("fBudget");
  const lines = [
    d.ct_lead,
    d.ct_l_name  + ": " + g("fName").value.trim(),
    d.ct_l_email + ": " + g("fEmail").value.trim()
  ];
  if (g("fCompany").value.trim()) lines.push(d.ct_l_co + ": " + g("fCompany").value.trim());
  if (sv.selectedIndex > 0) lines.push(d.ct_l_srv + ": " + sv.options[sv.selectedIndex].text);
  if (bu.selectedIndex > 0) lines.push(d.ct_l_bud + ": " + bu.options[bu.selectedIndex].text);
  lines.push(d.ct_l_msg + ": " + g("fMsg").value.trim());
  window.open("https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
  const span = document.querySelector("#ctSubmit span");
  if (span){ span.textContent = d.ct_sent; setTimeout(() => { span.textContent = I18N[lang].ct_send; }, 4000); }
});

/* newsletter → mailto (TODO: connect a real email service) */
const nlForm = document.getElementById("nlForm");
if (nlForm) nlForm.addEventListener("submit", e => {
  e.preventDefault();
  if (!nlForm.reportValidity()) return;
  const em = document.getElementById("nlEmail");
  const subj = lang === "ar" ? "اشتراك في النشرة البريدية" : "Newsletter subscription";
  location.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(em.value);
  em.value = "";
  em.placeholder = I18N[lang].nl_done;
  setTimeout(() => { em.placeholder = I18N[lang].ft_nl_ph; }, 4000);
});

/* static links (guarded — not every page has every id) */
function setHref(id, url){ const el = document.getElementById(id); if (el) el.href = url; }
setHref("igLink",  CONFIG.instagram); setHref("igLink2", CONFIG.instagram);
setHref("liLink",  CONFIG.linkedin);  setHref("liLink2", CONFIG.linkedin);
setHref("xLink",   CONFIG.twitter);
setHref("mailLink", "mailto:" + CONFIG.email); setHref("mailLink2", "mailto:" + CONFIG.email);
const ctaMail = document.getElementById("ctaMail");
if (ctaMail){ ctaMail.href = "mailto:" + CONFIG.email; ctaMail.textContent = CONFIG.email; }
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

applyLang();
