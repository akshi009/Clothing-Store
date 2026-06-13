import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SlidersHorizontal, ChevronDown, X, Heart } from "lucide-react";
import { F as Footer } from "./Footer-D-hgnv3x.js";
import { R as Route, b as useProducts, u as useWishlist, c as currency } from "./router-Bjx56gfo.js";
import { toast } from "sonner";
import "@tanstack/react-query";
import "./client-BhH2qhhP.js";
import "@supabase/supabase-js";
import "zod";
import "@tanstack/zod-adapter";
function Collections() {
  const {
    filter: filterParam
  } = Route.useSearch();
  const navigate = useNavigate({
    from: "/collections"
  });
  const {
    data: products = [],
    isLoading
  } = useProducts();
  const {
    toggle: wishlistToggle,
    has: inWishlist
  } = useWishlist();
  const [sort, setSort] = useState("featured");
  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((p) => p.category)))], [products]);
  const category = useMemo(() => {
    if (!filterParam) return "All";
    const match = categories.find((c) => c.toLowerCase() === filterParam.toLowerCase());
    return match ?? "All";
  }, [filterParam, categories]);
  const setCategory = (c) => {
    navigate({
      search: c === "All" ? {
        filter: ""
      } : {
        filter: c.toLowerCase()
      }
    });
  };
  const [filterOpen, setFilterOpen] = useState(false);
  const filtered = useMemo(() => {
    let list = category === "All" ? products : products.filter((p) => p.category === category);
    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sort === "price-desc") list.sort((a, b) => Number(b.price) - Number(a.price));
    else if (sort === "newest") list.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    else list.sort((a, b) => Number(b.featured) - Number(a.featured));
    return list;
  }, [products, category, sort]);
  const FilterSidebar = () => /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow mb-4", children: "Category" }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: categories.map((c) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", { onClick: () => {
        setCategory(c);
        setFilterOpen(false);
      }, className: "flex items-center gap-3 text-sm cursor-pointer group w-full text-left", children: [
        /* @__PURE__ */ jsx("span", { className: `w-4 h-4 border ${category === c ? "bg-primary border-primary" : "border-hairline"} flex items-center justify-center`, children: category === c && /* @__PURE__ */ jsx("span", { className: "text-primary-foreground text-[9px]", children: "✓" }) }),
        c
      ] }) }, c)) })
    ] }),
    /* @__PURE__ */ jsx("button", { onClick: () => {
      setCategory("All");
      setSort("featured");
      setFilterOpen(false);
    }, className: "w-full py-3 border border-hairline text-[11px] tracking-[0.2em] uppercase hover:bg-primary hover:text-primary-foreground transition", children: "Clear All" })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxs("main", { className: "pt-6 max-w-[1440px] mx-auto px-6 md:px-10 pb-20", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-xs tracking-[0.2em] uppercase text-ink-soft mb-4", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:opacity-60", children: "Home" }),
        " / Collections"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-6 mb-10 md:mb-16", children: [
        /* @__PURE__ */ jsx("h1", { className: "font-serif text-5xl md:text-6xl", children: "The Festive Edit" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 md:gap-6 text-sm", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-[11px] tracking-[0.2em] uppercase text-ink-soft", children: [
            filtered.length,
            " Items"
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => setFilterOpen(true), className: "md:hidden flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase border border-hairline px-3 h-9", children: [
            /* @__PURE__ */ jsx(SlidersHorizontal, { className: "w-3.5 h-3.5" }),
            " Filter"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "hidden md:block h-4 w-px bg-hairline" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxs("select", { value: sort, onChange: (e) => setSort(e.target.value), className: "appearance-none bg-transparent pr-6 text-[11px] tracking-[0.2em] uppercase cursor-pointer focus:outline-none", children: [
              /* @__PURE__ */ jsx("option", { value: "featured", children: "Featured" }),
              /* @__PURE__ */ jsx("option", { value: "newest", children: "Newest" }),
              /* @__PURE__ */ jsx("option", { value: "price-asc", children: "Price ↑" }),
              /* @__PURE__ */ jsx("option", { value: "price-desc", children: "Price ↓" })
            ] }),
            /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" })
          ] })
        ] })
      ] }),
      filterOpen && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 md:hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40", onClick: () => setFilterOpen(false) }),
        /* @__PURE__ */ jsxs("aside", { className: "absolute left-0 top-0 bottom-0 w-72 bg-background p-6 overflow-y-auto", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
            /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "Filters" }),
            /* @__PURE__ */ jsx("button", { onClick: () => setFilterOpen(false), className: "p-1 hover:bg-surface-dim", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
          ] }),
          /* @__PURE__ */ jsx(FilterSidebar, {})
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-[220px_1fr] gap-10 md:gap-14", children: [
        /* @__PURE__ */ jsx("aside", { className: "hidden md:block", children: /* @__PURE__ */ jsx(FilterSidebar, {}) }),
        /* @__PURE__ */ jsx("div", { children: isLoading ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6", children: Array.from({
          length: 8
        }).map((_, i) => /* @__PURE__ */ jsxs("div", { className: "animate-pulse", children: [
          /* @__PURE__ */ jsx("div", { className: "aspect-[3/4] bg-surface-dim rounded-sm" }),
          /* @__PURE__ */ jsx("div", { className: "h-2 bg-surface-dim rounded mt-4 w-1/3" }),
          /* @__PURE__ */ jsx("div", { className: "h-3 bg-surface-dim rounded mt-2 w-2/3" }),
          /* @__PURE__ */ jsx("div", { className: "h-3 bg-surface-dim rounded mt-1 w-1/4" })
        ] }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-20 text-center border border-hairline", children: [
          /* @__PURE__ */ jsx("p", { className: "text-ink-soft mb-4", children: "No products match your filters." }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            setCategory("All");
            setSort("featured");
          }, className: "btn-ghost inline-flex", children: "Clear Filters" })
        ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6", children: filtered.map((p) => /* @__PURE__ */ jsxs("div", { className: "group relative", children: [
          /* @__PURE__ */ jsx(Link, { to: "/product/$id", params: {
            id: p.slug
          }, children: /* @__PURE__ */ jsx("div", { className: "aspect-[3/4] overflow-hidden bg-surface-dim rounded-sm", children: p.image_url ? /* @__PURE__ */ jsx("img", { src: p.image_url, alt: p.name, className: "w-full h-full object-cover group-hover:scale-105 transition duration-700", loading: "lazy", width: 768, height: 1024 }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full" }) }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            const wasIn = inWishlist(p.id);
            wishlistToggle({
              id: p.id,
              name: p.name,
              price: Number(p.price),
              image: p.image_url ?? "",
              slug: p.slug,
              category: p.category ?? void 0
            });
            toast.success(wasIn ? `${p.name} removed from wishlist.` : `${p.name} saved.`);
          }, "aria-label": inWishlist(p.id) ? "Remove from wishlist" : "Save to wishlist", className: "absolute top-3 right-3 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-background", children: /* @__PURE__ */ jsx(Heart, { className: `w-3.5 h-3.5 ${inWishlist(p.id) ? "fill-current" : ""}` }) }),
          /* @__PURE__ */ jsxs(Link, { to: "/product/$id", params: {
            id: p.slug
          }, children: [
            /* @__PURE__ */ jsx("p", { className: "mt-4 text-[10px] tracking-[0.2em] uppercase text-ink-soft", children: p.category }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium mt-1 truncate", children: p.name }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft mt-0.5", children: currency(p.price) })
          ] })
        ] }, p.id)) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  Collections as component
};
