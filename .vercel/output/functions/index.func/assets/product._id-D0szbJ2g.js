import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Heart, ChevronDown } from "lucide-react";
import { F as Footer } from "./Footer-D-hgnv3x.js";
import { h as Route, i as useProductBySlug, b as useProducts, a as useCart, u as useWishlist, c as currency } from "./router-Bjx56gfo.js";
import { e as useProductReviews } from "./orders-Dp7z8102.js";
import { toast } from "sonner";
import "@tanstack/react-query";
import "./client-BhH2qhhP.js";
import "@supabase/supabase-js";
import "zod";
import "@tanstack/zod-adapter";
const sizes = ["XS", "S", "M", "L", "XL"];
function ProductPage() {
  const {
    id
  } = Route.useParams();
  const {
    data: product,
    isLoading
  } = useProductBySlug(id);
  const {
    data: all = []
  } = useProducts();
  const {
    data: reviews = []
  } = useProductReviews(product?.id ?? null);
  const {
    add
  } = useCart();
  const {
    toggle: wishlistToggle,
    has: inWishlist
  } = useWishlist();
  const [size, setSize] = useState("M");
  const [activeImg, setActiveImg] = useState(0);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background text-foreground", children: /* @__PURE__ */ jsx("div", { className: "pt-6 text-center text-ink-soft", children: "Loading…" }) });
  }
  if (!product) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background text-foreground", children: /* @__PURE__ */ jsxs("div", { className: "pt-6 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-ink-soft mb-4", children: "Product not found." }),
      /* @__PURE__ */ jsx(Link, { to: "/collections", className: "btn-primary inline-flex", children: "Browse Collections" })
    ] }) });
  }
  const handleAdd = () => {
    if (product.stock <= 0) {
      toast.error("Out of stock.");
      return;
    }
    add({
      id: `${product.id}`,
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image_url ?? "",
      size
    });
    toast.success(`${product.name} added to bag.`);
  };
  const related = all.filter((p) => p.id !== product.id).slice(0, 4);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxs("main", { className: "pt-6 pb-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-[1440px] mx-auto px-6 md:px-10", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-xs tracking-[0.2em] uppercase text-ink-soft mb-8", children: [
          /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:opacity-60", children: "Home" }),
          " /",
          " ",
          /* @__PURE__ */ jsx(Link, { to: "/collections", className: "hover:opacity-60", children: "Collections" }),
          " /",
          " ",
          /* @__PURE__ */ jsx("span", { children: product.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-10 md:gap-16", children: [
          /* @__PURE__ */ jsx("div", { children: (() => {
            const allImgs = [...product.image_url ? [product.image_url] : [], ...product.images.filter((u) => u !== product.image_url)];
            return /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("div", { className: "relative aspect-[4/5] overflow-hidden bg-surface-dim rounded-sm", children: [
                allImgs.length > 0 ? /* @__PURE__ */ jsx("img", { src: allImgs[activeImg], alt: product.name, className: "w-full h-full object-cover transition-opacity duration-300", width: 768, height: 1024 }, activeImg) : /* @__PURE__ */ jsx("div", { className: "w-full h-full" }),
                allImgs.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => setActiveImg((p) => (p - 1 + allImgs.length) % allImgs.length), className: "absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 flex items-center justify-center hover:bg-background transition", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => setActiveImg((p) => (p + 1) % allImgs.length), className: "absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 flex items-center justify-center hover:bg-background transition", children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" }) }),
                  /* @__PURE__ */ jsx("div", { className: "absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5", children: allImgs.map((_, i) => /* @__PURE__ */ jsx("button", { onClick: () => setActiveImg(i), className: `w-1.5 h-1.5 rounded-full transition-all ${i === activeImg ? "bg-primary w-4" : "bg-white/60"}` }, i)) })
                ] })
              ] }),
              allImgs.length > 1 && /* @__PURE__ */ jsx("div", { className: "flex gap-2 mt-3 overflow-x-auto pb-1", children: allImgs.map((src, i) => /* @__PURE__ */ jsx("button", { onClick: () => setActiveImg(i), className: `shrink-0 w-16 h-20 overflow-hidden border-2 transition ${i === activeImg ? "border-primary" : "border-transparent hover:border-hairline"}`, children: /* @__PURE__ */ jsx("img", { src, alt: "", className: "w-full h-full object-cover" }) }, i)) })
            ] });
          })() }),
          /* @__PURE__ */ jsxs("div", { className: "lg:sticky lg:top-28 self-start", children: [
            /* @__PURE__ */ jsx("p", { className: "eyebrow mb-4", children: product.category }),
            /* @__PURE__ */ jsx("h1", { className: "font-serif text-4xl md:text-5xl leading-tight", children: product.name }),
            reviews.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsx("div", { className: "flex", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsx(Star, { className: `w-4 h-4 ${n <= Math.round(avg) ? "fill-current" : "text-ink-soft"}` }, n)) }),
              /* @__PURE__ */ jsxs("span", { className: "text-ink-soft", children: [
                avg.toFixed(1),
                " · ",
                reviews.length,
                " review",
                reviews.length === 1 ? "" : "s"
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "font-serif text-2xl mt-4", children: currency(product.price) }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs tracking-[0.2em] uppercase text-ink-soft", children: product.stock > 0 ? `${product.stock} in stock` : "Out of stock" }),
            /* @__PURE__ */ jsx("p", { className: "mt-8 text-ink-soft leading-relaxed whitespace-pre-line", children: product.description }),
            /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
              /* @__PURE__ */ jsx("p", { className: "eyebrow mb-3", children: "Select Size" }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-2", children: sizes.map((s) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setSize(s), className: `h-12 text-sm border ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-hairline"} hover:border-primary transition`, children: s }, s)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-3", children: [
              /* @__PURE__ */ jsx("button", { onClick: handleAdd, disabled: product.stock <= 0, className: "btn-primary w-full justify-center disabled:opacity-50", children: product.stock > 0 ? "Add to Shopping Bag" : "Sold Out" }),
              /* @__PURE__ */ jsxs("button", { onClick: () => {
                const wasInWishlist = inWishlist(product.id);
                wishlistToggle({
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  image: product.image_url ?? "",
                  slug: product.slug,
                  category: product.category ?? void 0
                });
                toast.success(wasInWishlist ? `${product.name} removed from wishlist.` : `${product.name} saved to wishlist.`);
              }, className: "btn-ghost w-full justify-center", children: [
                /* @__PURE__ */ jsx(Heart, { className: `w-4 h-4 transition-all ${inWishlist(product.id) ? "fill-current" : ""}` }),
                inWishlist(product.id) ? "Saved" : "Wishlist"
              ] })
            ] }),
            (product.composition_care || product.shipping_returns) && /* @__PURE__ */ jsx("div", { className: "mt-10 divide-y divide-hairline border-y border-hairline", children: [{
              label: "Composition & Care",
              content: product.composition_care
            }, {
              label: "Shipping & Returns",
              content: product.shipping_returns
            }].map(({
              label,
              content
            }) => content ? /* @__PURE__ */ jsxs("details", { className: "group", children: [
              /* @__PURE__ */ jsxs("summary", { className: "flex justify-between items-center py-5 cursor-pointer text-sm tracking-wide uppercase", children: [
                label,
                /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4 group-open:rotate-180 transition" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft pb-5 leading-relaxed whitespace-pre-line", children: content })
            ] }, label) : null) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "max-w-[1200px] mx-auto px-6 md:px-10 mt-20", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl md:text-4xl mb-8", children: "Customer Reviews" }),
        reviews.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-ink-soft text-sm", children: "No reviews yet. Be the first to share your thoughts after your delivery." }) : /* @__PURE__ */ jsx("ul", { className: "grid md:grid-cols-2 gap-5", children: reviews.map((r) => /* @__PURE__ */ jsxs("li", { className: "border border-hairline p-6 bg-card", children: [
          /* @__PURE__ */ jsx("div", { className: "flex gap-1 mb-2", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsx(Star, { className: `w-4 h-4 ${n <= r.rating ? "fill-current" : "text-ink-soft"}` }, n)) }),
          r.title && /* @__PURE__ */ jsx("p", { className: "font-medium mb-1", children: r.title }),
          r.body && /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft leading-relaxed whitespace-pre-line", children: r.body }),
          Array.isArray(r.images) && r.images.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mt-3", children: r.images.map((u) => /* @__PURE__ */ jsx("img", { src: u, alt: "", className: "w-16 h-16 object-cover border border-hairline" }, u)) }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-ink-soft mt-3", children: [
            "— ",
            r.author_name || "Customer",
            ", ",
            new Date(r.created_at).toLocaleDateString()
          ] })
        ] }, r.id)) })
      ] }),
      related.length > 0 && /* @__PURE__ */ jsxs("section", { className: "max-w-[1440px] mx-auto px-6 md:px-10 mt-24 md:mt-32", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl md:text-4xl mb-10", children: "Complete the Look" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-5", children: related.map((p) => /* @__PURE__ */ jsxs(Link, { to: "/product/$id", params: {
          id: p.slug
        }, className: "group", children: [
          /* @__PURE__ */ jsx("div", { className: "aspect-[3/4] overflow-hidden bg-surface-dim rounded-sm", children: p.image_url && /* @__PURE__ */ jsx("img", { src: p.image_url, alt: p.name, className: "w-full h-full object-cover group-hover:scale-105 transition duration-700", loading: "lazy" }) }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-[10px] tracking-[0.2em] uppercase text-ink-soft", children: p.category }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium mt-1 truncate", children: p.name }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft mt-0.5", children: currency(p.price) })
        ] }, p.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  ProductPage as component
};
