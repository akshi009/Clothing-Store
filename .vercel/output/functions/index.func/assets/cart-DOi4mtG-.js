import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { F as Footer } from "./Footer-D-hgnv3x.js";
import { a as useCart, d as useSiteSettings, c as currency } from "./router-Bjx56gfo.js";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import "@tanstack/react-query";
import "react";
import "sonner";
import "./client-BhH2qhhP.js";
import "@supabase/supabase-js";
import "zod";
import "@tanstack/zod-adapter";
function CartPage() {
  const {
    items,
    updateQty,
    remove,
    subtotal
  } = useCart();
  const {
    data: settings
  } = useSiteSettings();
  const threshold = settings?.shipping.free_shipping_threshold ?? 5e3;
  const standardRate = settings?.shipping.standard_rate ?? 250;
  const shipping = subtotal > 0 && subtotal < threshold ? standardRate : 0;
  const total = subtotal + shipping;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxs("main", { className: "pt-6 max-w-[1200px] mx-auto px-6 md:px-10 pb-24", children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow mb-3", children: "Your Selection" }),
      /* @__PURE__ */ jsx("h1", { className: "font-serif text-4xl md:text-5xl mb-10", children: "Shopping Bag" }),
      items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "border border-hairline p-16 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-ink-soft mb-6", children: "Your bag is currently empty." }),
        /* @__PURE__ */ jsx(Link, { to: "/collections", className: "btn-primary inline-flex", children: "Browse Collections" })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-[1fr_380px] gap-10", children: [
        /* @__PURE__ */ jsx("ul", { className: "divide-y divide-hairline border-y border-hairline", children: items.map((i) => /* @__PURE__ */ jsxs("li", { className: "py-6 flex gap-5", children: [
          i.productId ? /* @__PURE__ */ jsx(Link, { to: "/product/$id", params: {
            id: i.productId
          }, children: /* @__PURE__ */ jsx("img", { src: i.image, alt: i.name, className: "w-28 h-36 object-cover bg-surface-dim hover:opacity-90 transition" }) }) : /* @__PURE__ */ jsx("img", { src: i.image, alt: i.name, className: "w-28 h-36 object-cover bg-surface-dim" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                i.productId ? /* @__PURE__ */ jsx(Link, { to: "/product/$id", params: {
                  id: i.productId
                }, className: "font-medium hover:opacity-60 transition", children: i.name }) : /* @__PURE__ */ jsx("p", { className: "font-medium", children: i.name }),
                i.size && /* @__PURE__ */ jsxs("p", { className: "text-xs text-ink-soft mt-1", children: [
                  "Size ",
                  i.size
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "font-medium", children: currency(i.price * i.quantity) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-auto flex items-center justify-between pt-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center border border-hairline", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => updateQty(i.id, i.size, i.quantity - 1), "aria-label": "Decrease", className: "w-9 h-9 flex items-center justify-center hover:bg-surface-dim", children: /* @__PURE__ */ jsx(Minus, { className: "w-3 h-3" }) }),
                /* @__PURE__ */ jsx("span", { className: "w-10 text-center text-sm", children: i.quantity }),
                /* @__PURE__ */ jsx("button", { onClick: () => updateQty(i.id, i.size, i.quantity + 1), "aria-label": "Increase", className: "w-9 h-9 flex items-center justify-center hover:bg-surface-dim", children: /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3" }) })
              ] }),
              /* @__PURE__ */ jsxs("button", { onClick: () => remove(i.id, i.size), className: "flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-ink-soft hover:text-ink", children: [
                /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" }),
                " Remove"
              ] })
            ] })
          ] })
        ] }, `${i.id}-${i.size ?? ""}`)) }),
        /* @__PURE__ */ jsxs("aside", { className: "border border-hairline p-7 h-fit lg:sticky lg:top-28 space-y-4", children: [
          /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "Order Summary" }),
          subtotal < threshold ? /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-ink-soft mb-2", children: [
              "Add ",
              currency(threshold - subtotal),
              " more for free shipping"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-1 bg-surface-dim rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-primary transition-all duration-500", style: {
              width: `${Math.min(100, subtotal / threshold * 100)}%`
            } }) })
          ] }) : /* @__PURE__ */ jsx("p", { className: "text-[11px] text-emerald-700 font-medium pt-1", children: "✓ Free shipping on this order" }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm pt-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-ink-soft", children: "Subtotal" }),
            /* @__PURE__ */ jsx("span", { children: currency(subtotal) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-ink-soft", children: "Shipping" }),
            /* @__PURE__ */ jsx("span", { children: shipping === 0 ? "Complimentary" : currency(shipping) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-t border-hairline pt-4", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Total" }),
            /* @__PURE__ */ jsx("span", { className: "font-serif text-xl", children: currency(total) })
          ] }),
          /* @__PURE__ */ jsxs(Link, { to: "/checkout", className: "btn-primary w-full justify-center", children: [
            "Proceed to Checkout ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
          ] }),
          /* @__PURE__ */ jsx(Link, { to: "/collections", className: "btn-ghost w-full justify-center", children: "Continue Shopping" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  CartPage as component
};
