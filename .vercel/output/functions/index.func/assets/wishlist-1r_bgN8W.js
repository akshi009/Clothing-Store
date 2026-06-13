import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Heart, Trash2 } from "lucide-react";
import { F as Footer } from "./Footer-D-hgnv3x.js";
import { u as useWishlist, a as useCart, c as currency } from "./router-Bjx56gfo.js";
import { toast } from "sonner";
import "@tanstack/react-query";
import "react";
import "./client-BhH2qhhP.js";
import "@supabase/supabase-js";
import "zod";
import "@tanstack/zod-adapter";
function WishlistPage() {
  const {
    items,
    toggle
  } = useWishlist();
  const {
    add
  } = useCart();
  const moveToCart = (item) => {
    add({
      id: item.id,
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      slug: item.slug
    });
    toggle(item);
    toast.success(`${item.name} moved to bag.`);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsx("main", { className: "pt-6 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1440px] mx-auto px-6 md:px-10", children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow mb-3", children: "Saved" }),
      /* @__PURE__ */ jsx("h1", { className: "font-serif text-4xl md:text-5xl mb-12", children: "Your Wishlist" }),
      items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-24 text-center", children: [
        /* @__PURE__ */ jsx(Heart, { className: "w-10 h-10 stroke-[1] mx-auto text-ink-soft mb-5" }),
        /* @__PURE__ */ jsx("p", { className: "text-ink-soft mb-6", children: "Nothing saved yet — browse the collection and heart what you love." }),
        /* @__PURE__ */ jsx(Link, { to: "/collections", className: "btn-primary inline-flex", children: "Browse Collections" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8", children: items.map((item) => /* @__PURE__ */ jsxs("div", { className: "group", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative aspect-[3/4] overflow-hidden bg-surface-dim rounded-sm", children: [
          /* @__PURE__ */ jsx(Link, { to: "/product/$id", params: {
            id: item.slug
          }, children: item.image ? /* @__PURE__ */ jsx("img", { src: item.image, alt: item.name, className: "w-full h-full object-cover group-hover:scale-105 transition duration-700", loading: "lazy" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            toggle(item);
            toast.success(`${item.name} removed from wishlist.`);
          }, "aria-label": "Remove from wishlist", className: "absolute top-3 right-3 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }) })
        ] }),
        item.category && /* @__PURE__ */ jsx("p", { className: "mt-4 text-[10px] tracking-[0.2em] uppercase text-ink-soft", children: item.category }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium mt-1 truncate", children: item.name }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft mt-0.5", children: currency(item.price) }),
        /* @__PURE__ */ jsx("button", { onClick: () => moveToCart(item), className: "btn-ghost w-full justify-center mt-3 text-xs", children: "Move to Bag" })
      ] }, item.id)) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  WishlistPage as component
};
