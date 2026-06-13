import { jsxs, jsx } from "react/jsx-runtime";
import { Instagram, Youtube, Facebook, Twitter } from "lucide-react";
import { d as useSiteSettings, l as useNavItems } from "./router-Bjx56gfo.js";
function Footer() {
  const { data: settings } = useSiteSettings();
  const { data: nav = [] } = useNavItems("footer");
  const storeName = settings?.general.store_name ?? "AESTHETE";
  const tagline = settings?.general.tagline ?? "Hand-embroidered. Mirror-worked. Made for women who celebrate loudly.";
  const supportEmail = settings?.general.support_email;
  const social = settings?.social ?? {};
  const visitLocations = settings?.visit?.locations ?? ["Mumbai — Bandra Kurla", "Delhi — Lodhi Colony", "Bengaluru — Indiranagar"];
  const socialLinks = [
    { key: "instagram", Icon: Instagram, label: "Instagram" },
    { key: "youtube", Icon: Youtube, label: "YouTube" },
    { key: "facebook", Icon: Facebook, label: "Facebook" },
    { key: "twitter", Icon: Twitter, label: "X / Twitter" }
  ].filter(({ key }) => !!social[key]);
  return /* @__PURE__ */ jsxs("footer", { className: "bg-surface-dim/40", children: [
    /* @__PURE__ */ jsx("div", { className: "gold-divider" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-[1440px] mx-auto px-6 md:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-serif text-xl tracking-[0.18em] font-bold mb-4 uppercase", children: storeName }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft leading-relaxed max-w-[220px]", children: tagline }),
        supportEmail && /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-soft mt-3", children: supportEmail })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-5", children: "Client Services" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3 text-sm", children: nav.length > 0 ? nav.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: item.url, className: "hover:opacity-60 transition", children: item.label }) }, item.id)) : [
          { label: "Collections", href: "/collections" },
          { label: "Size Guide", href: "/collections" },
          { label: "Returns & Exchanges", href: "/account" },
          { label: "Contact Us", href: "mailto:hello@aesthete.in" },
          { label: "Order Tracking", href: "/account" }
        ].map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: link.href, className: "hover:opacity-60 transition", children: link.label }) }, link.label)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-5", children: "Visit" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3 text-sm text-ink-soft", children: visitLocations.map((loc, i) => /* @__PURE__ */ jsx("li", { children: loc }, i)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-5", children: "Social" }),
        socialLinks.length > 0 ? /* @__PURE__ */ jsx("div", { className: "flex gap-3 flex-wrap", children: socialLinks.map(({ key, Icon, label }) => /* @__PURE__ */ jsx(
          "a",
          {
            href: social[key],
            target: "_blank",
            rel: "noreferrer",
            "aria-label": label,
            className: "w-10 h-10 rounded-full border border-hairline flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition",
            children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4 stroke-[1.5]" })
          },
          key
        )) }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-soft", children: "Add social links in Admin → Navigation." })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-hairline", children: /* @__PURE__ */ jsx("div", { className: "max-w-[1440px] mx-auto px-6 md:px-10 py-6 flex flex-wrap justify-between text-xs text-ink-soft tracking-wider", children: /* @__PURE__ */ jsxs("span", { children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " ",
      storeName.toUpperCase(),
      ". ALL RIGHTS RESERVED."
    ] }) }) })
  ] });
}
export {
  Footer as F
};
