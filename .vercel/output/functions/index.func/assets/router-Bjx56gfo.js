import { useQuery, QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useNavigate, Link, createRootRouteWithContext, useRouter, useRouterState, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect, createContext, useContext, useRef } from "react";
import { Toaster } from "sonner";
import { X, ShoppingBag, Minus, Plus, Search, Heart, User, Package, LayoutDashboard, LogOut, Menu } from "lucide-react";
import { s as supabase } from "./client-BhH2qhhP.js";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
const appCss = "/assets/styles-CZZPyCUk.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const Ctx$1 = createContext(null);
const KEY$1 = "aesthete-cart-v1";
const key = (id, size) => `${id}::${size ?? ""}`;
function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY$1);
      if (raw) setItems(JSON.parse(raw));
    } catch {
    }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY$1, JSON.stringify(items));
  }, [items, hydrated]);
  const add = (item, qty = 1) => {
    setItems((prev) => {
      const k = key(item.id, item.size);
      const existing = prev.find((p) => key(p.id, p.size) === k);
      if (existing) return prev.map((p) => key(p.id, p.size) === k ? { ...p, quantity: p.quantity + qty } : p);
      return [...prev, { ...item, quantity: qty }];
    });
    setOpen(true);
  };
  const remove = (id, size) => setItems((prev) => prev.filter((p) => key(p.id, p.size) !== key(id, size)));
  const updateQty = (id, size, qty) => setItems(
    (prev) => prev.flatMap((p) => {
      if (key(p.id, p.size) !== key(id, size)) return [p];
      if (qty <= 0) return [];
      return [{ ...p, quantity: qty }];
    })
  );
  const clear = () => setItems([]);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  return /* @__PURE__ */ jsx(Ctx$1.Provider, { value: { items, open, setOpen, add, remove, updateQty, clear, count, subtotal }, children });
}
function useCart() {
  const c = useContext(Ctx$1);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
let CURRENT_CODE = "INR";
let CURRENT_LOCALE = "en-IN";
const LOCALE_BY_CODE = {
  INR: "en-IN"
};
function setCurrencyFormat(code, locale) {
  if (code) CURRENT_CODE = code.toUpperCase();
  CURRENT_LOCALE = locale || LOCALE_BY_CODE[CURRENT_CODE] || "en-IN";
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("cms-currency", JSON.stringify({ code: CURRENT_CODE, locale: CURRENT_LOCALE }));
    } catch {
    }
  }
}
if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem("cms-currency");
    if (raw) {
      const v = JSON.parse(raw);
      if (v?.code) CURRENT_CODE = v.code;
      if (v?.locale) CURRENT_LOCALE = v.locale;
    }
  } catch {
  }
}
const currency = (n) => {
  const v = typeof n === "string" ? parseFloat(n) : n ?? 0;
  try {
    return new Intl.NumberFormat(CURRENT_LOCALE, {
      style: "currency",
      currency: CURRENT_CODE,
      maximumFractionDigits: 0
    }).format(v || 0);
  } catch {
    return `${CURRENT_CODE} ${(v || 0).toLocaleString(CURRENT_LOCALE)}`;
  }
};
const dateShort = (d) => new Date(d).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
const dateTime = (d) => new Date(d).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
const defaults = {
  general: { store_name: "AESTHETE", tagline: "Quietly extraordinary.", currency: "INR", locale: "en-IN", support_email: "" },
  shipping: { free_shipping_threshold: 5e3, standard_rate: 250, express_rate: 600 },
  ticker: { items: ["Free shipping on orders above ₹5,000", "New Kutch mirror-work tops just dropped", "Use code FESTIVE10 for 10% off", "Same-day dispatch on in-stock pieces", "Handcrafted by Indian artisans"] },
  social: {},
  visit: { locations: ["Mumbai — Bandra Kurla", "Delhi — Lodhi Colony", "Bengaluru — Indiranagar"] }
};
function useProducts(opts) {
  return useQuery({
    queryKey: ["storefront-products", !!opts?.featuredOnly, opts?.limit ?? null],
    queryFn: async () => {
      let q = supabase.from("products").select("*").eq("status", "active").order("created_at", { ascending: false });
      if (opts?.featuredOnly) q = q.eq("featured", true);
      if (opts?.limit) q = q.limit(opts.limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map((p) => ({ ...p, images: Array.isArray(p.images) ? p.images : [] }));
    }
  });
}
function useProductBySlug(slug) {
  return useQuery({
    queryKey: ["storefront-product", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return { ...data, images: Array.isArray(data.images) ? data.images : [] };
    }
  });
}
function useSiteSettings() {
  const q = useQuery({
    queryKey: ["storefront-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*");
      const map = {};
      (data ?? []).forEach((r) => {
        map[r.key] = r.value;
      });
      return {
        general: { ...defaults.general, ...map.general ?? {} },
        shipping: { ...defaults.shipping, ...map.shipping ?? {} },
        ticker: { ...defaults.ticker, ...map.ticker ?? {} },
        social: { ...defaults.social, ...map.social ?? {} },
        visit: { locations: map.visit?.locations ?? defaults.visit.locations }
      };
    },
    staleTime: 6e4
  });
  useEffect(() => {
    if (q.data?.general?.currency) setCurrencyFormat(q.data.general.currency, q.data.general.locale);
  }, [q.data?.general?.currency, q.data?.general?.locale]);
  return q;
}
function useHomepageSections(opts) {
  return useQuery({
    queryKey: ["homepage-sections", true],
    queryFn: async () => {
      let q = supabase.from("homepage_sections").select("*").order("position");
      q = q.eq("visible", true);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 15e3
  });
}
function useNavItems(location) {
  return useQuery({
    queryKey: ["nav-items", location],
    queryFn: async () => {
      const { data, error } = await supabase.from("nav_items").select("*").eq("location", location).eq("visible", true).order("position");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 6e4
  });
}
function useCmsPage(slug) {
  return useQuery({
    queryKey: ["cms-page", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase.from("pages").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data ?? null;
    }
  });
}
function useCategories() {
  return useQuery({
    queryKey: ["storefront-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("category, image_url").eq("status", "active");
      if (error) throw error;
      const map = /* @__PURE__ */ new Map();
      (data ?? []).forEach((r) => {
        if (r.category && !map.has(r.category)) map.set(r.category, r.image_url);
      });
      return Array.from(map.entries()).map(([name, image_url]) => ({ name, image_url }));
    },
    staleTime: 6e4
  });
}
function CartDrawer() {
  const { items, open, setOpen, updateQty, remove, subtotal } = useCart();
  const { data: settings } = useSiteSettings();
  const navigate = useNavigate();
  const threshold = settings?.shipping.free_shipping_threshold ?? 5e3;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, subtotal / threshold * 100);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);
  if (!open) return null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[60]", role: "dialog", "aria-label": "Shopping bag", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/50", onClick: () => setOpen(false) }),
    /* @__PURE__ */ jsxs("aside", { className: "absolute right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-hairline flex flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6 border-b border-hairline", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "eyebrow mb-1", children: "Your Bag" }),
          /* @__PURE__ */ jsxs("h2", { className: "font-serif text-2xl", children: [
            items.length,
            " ",
            items.length === 1 ? "Item" : "Items"
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setOpen(false), "aria-label": "Close", className: "p-2 hover:bg-surface-dim", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
      ] }),
      items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center px-8 text-center gap-4", children: [
        /* @__PURE__ */ jsx(ShoppingBag, { className: "w-10 h-10 text-ink-soft" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft", children: "Your bag is empty." }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          setOpen(false);
          navigate({ to: "/collections" });
        }, className: "btn-primary", children: "Explore Collections" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("ul", { className: "flex-1 overflow-y-auto divide-y divide-hairline", children: items.map((i) => /* @__PURE__ */ jsxs("li", { className: "p-6 flex gap-4", children: [
          /* @__PURE__ */ jsx("img", { src: i.image, alt: i.name, className: "w-20 h-24 object-cover bg-surface-dim" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium truncate", children: i.name }),
            i.size && /* @__PURE__ */ jsxs("p", { className: "text-xs text-ink-soft mt-1", children: [
              "Size ",
              i.size
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm mt-2", children: [
              "$",
              (i.price * i.quantity).toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center border border-hairline", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => updateQty(i.id, i.size, i.quantity - 1), "aria-label": "Decrease", className: "w-8 h-8 flex items-center justify-center hover:bg-surface-dim", children: /* @__PURE__ */ jsx(Minus, { className: "w-3 h-3" }) }),
                /* @__PURE__ */ jsx("span", { className: "w-8 text-center text-sm", children: i.quantity }),
                /* @__PURE__ */ jsx("button", { onClick: () => updateQty(i.id, i.size, i.quantity + 1), "aria-label": "Increase", className: "w-8 h-8 flex items-center justify-center hover:bg-surface-dim", children: /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3" }) })
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: () => remove(i.id, i.size), className: "text-[10px] tracking-[0.2em] uppercase underline text-ink-soft", children: "Remove" })
            ] })
          ] })
        ] }, `${i.id}-${i.size ?? ""}`)) }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-hairline p-6 space-y-4", children: [
          remaining > 0 ? /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-ink-soft mb-2", children: [
              "Add ",
              currency(remaining),
              " more for free shipping"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-1 bg-surface-dim rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-primary transition-all duration-500", style: { width: `${progress}%` } }) })
          ] }) : /* @__PURE__ */ jsx("p", { className: "text-[11px] text-emerald-700 font-medium", children: "✓ You qualify for free shipping" }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-ink-soft", children: "Subtotal" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: currency(subtotal) })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            setOpen(false);
            navigate({ to: "/checkout" });
          }, className: "btn-primary w-full justify-center", children: "Checkout" }),
          /* @__PURE__ */ jsx(Link, { to: "/cart", onClick: () => setOpen(false), className: "block text-center text-[11px] tracking-[0.2em] uppercase underline", children: "View Full Bag" })
        ] })
      ] })
    ] })
  ] });
}
const Ctx = createContext(null);
const KEY = "aesthete-wishlist-v1";
function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
    }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);
  const toggle = (item) => {
    setItems(
      (prev) => prev.some((p) => p.id === item.id) ? prev.filter((p) => p.id !== item.id) : [...prev, item]
    );
  };
  const has = (id) => items.some((p) => p.id === id);
  const count = items.length;
  return /* @__PURE__ */ jsx(Ctx.Provider, { value: { items, toggle, has, count }, children });
}
function useWishlist() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useWishlist must be used within WishlistProvider");
  return c;
}
const FALLBACK = [
  "✦ Free shipping on orders above ₹5,000",
  "🪞 New Kutch mirror-work tops just dropped",
  "✨ Use code FESTIVE10 for 10% off your first order",
  "🎉 Same-day dispatch on in-stock pieces",
  "💛 Handcrafted by Indian artisans — every stitch tells a story"
];
function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const { data: settings } = useSiteSettings();
  const items = settings?.ticker?.items?.length ? settings.ticker.items : FALLBACK;
  if (dismissed) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "relative z-[60] text-white overflow-hidden",
      style: { background: "oklch(0.34 0.13 22)" },
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-center h-9", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "marquee-track flex items-center whitespace-nowrap", children: [...items, ...items].map((o, i) => /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-6 px-8 text-[11px] tracking-[0.16em] uppercase font-medium", children: [
          o,
          /* @__PURE__ */ jsx("span", { className: "text-white/30", children: "|" })
        ] }, i)) }) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setDismissed(true),
            "aria-label": "Close",
            className: "shrink-0 px-3 h-full flex items-center hover:bg-white/10 transition",
            children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
          }
        )
      ] })
    }
  );
}
function useAuth() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return { session, user, loading, signOut: () => supabase.auth.signOut() };
}
function useIsAdmin(userId) {
  const [isAdmin, setIsAdmin] = useState(null);
  useEffect(() => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }
    supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle().then(({ data }) => setIsAdmin(!!data));
  }, [userId]);
  return isAdmin;
}
function Header() {
  const { user, signOut } = useAuth();
  const isAdmin = useIsAdmin(user?.id);
  const { count, setOpen: openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { data: settings } = useSiteSettings();
  const { data: nav = [] } = useNavItems("header");
  const storeName = settings?.general.store_name ?? "AESTHETE";
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const accountRef = useRef(null);
  useEffect(() => {
    const h = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);
  const defaultNav = [
    { id: "collections", label: "Collections", url: "/collections", open_new_tab: false },
    { id: "wishlist", label: "Wishlist", url: "/wishlist", open_new_tab: false }
  ];
  const navItems = nav.length > 0 ? nav : defaultNav;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("header", { className: "sticky top-0 left-0 right-0 z-50 glass border-b border-hairline", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1440px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", onClick: () => setMobileOpen(false), className: "font-serif text-2xl md:text-3xl tracking-[0.18em] font-bold uppercase", children: storeName }),
      /* @__PURE__ */ jsxs("nav", { className: "hidden md:flex items-center gap-10", children: [
        navItems.map((item) => /* @__PURE__ */ jsx("a", { href: item.url, target: item.open_new_tab ? "_blank" : void 0, rel: item.open_new_tab ? "noreferrer" : void 0, className: "nav-link", children: item.label }, item.id)),
        isAdmin && /* @__PURE__ */ jsx(Link, { to: "/admin", className: "nav-link", children: "Atelier" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 md:gap-5 text-ink", children: [
        /* @__PURE__ */ jsx("button", { "aria-label": "Search", className: "hover:opacity-60 transition hidden md:block", children: /* @__PURE__ */ jsx(Search, { className: "w-[18px] h-[18px] stroke-[1.5]" }) }),
        /* @__PURE__ */ jsxs(Link, { to: "/wishlist", "aria-label": "Wishlist", className: "relative hover:opacity-60 transition", children: [
          /* @__PURE__ */ jsx(Heart, { className: "w-[18px] h-[18px] stroke-[1.5]" }),
          wishlistCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[9px] font-medium min-w-4 h-4 px-1 rounded-full flex items-center justify-center", children: wishlistCount })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => openCart(true), "aria-label": "Bag", className: "relative hover:opacity-60 transition", children: [
          /* @__PURE__ */ jsx(ShoppingBag, { className: "w-[18px] h-[18px] stroke-[1.5]" }),
          count > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[9px] font-medium min-w-4 h-4 px-1 rounded-full flex items-center justify-center", children: count })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "relative hidden md:block", ref: accountRef, children: user ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setAccountOpen((o) => !o), "aria-label": "Account", className: "hover:opacity-60 transition", children: /* @__PURE__ */ jsx(User, { className: "w-[18px] h-[18px] stroke-[1.5]" }) }),
          accountOpen && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-full mt-3 w-56 bg-background border border-hairline shadow-lg py-2 text-sm", children: [
            /* @__PURE__ */ jsx("p", { className: "px-4 py-2 text-xs text-ink-soft truncate border-b border-hairline", children: user.email }),
            /* @__PURE__ */ jsxs(Link, { to: "/account", onClick: () => setAccountOpen(false), className: "flex items-center gap-2 px-4 py-2 hover:bg-surface-dim", children: [
              /* @__PURE__ */ jsx(Package, { className: "w-4 h-4" }),
              " My Orders"
            ] }),
            isAdmin && /* @__PURE__ */ jsxs(Link, { to: "/admin", onClick: () => setAccountOpen(false), className: "flex items-center gap-2 px-4 py-2 hover:bg-surface-dim", children: [
              /* @__PURE__ */ jsx(LayoutDashboard, { className: "w-4 h-4" }),
              " Atelier Console"
            ] }),
            /* @__PURE__ */ jsxs("button", { onClick: () => signOut(), className: "w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-surface-dim", children: [
              /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }),
              " Sign Out"
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsx(Link, { to: "/auth", search: { mode: "signin", redirect: "/" }, "aria-label": "Sign in", className: "hover:opacity-60 transition", children: /* @__PURE__ */ jsx(User, { className: "w-[18px] h-[18px] stroke-[1.5]" }) }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => setMobileOpen((o) => !o), "aria-label": "Menu", className: "md:hidden hover:opacity-60 transition", children: mobileOpen ? /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" }) })
      ] })
    ] }) }),
    mobileOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-40 md:hidden bg-black/40", onClick: () => setMobileOpen(false) }),
    /* @__PURE__ */ jsxs(
      "nav",
      {
        className: `md:hidden fixed left-0 right-0 z-40 bg-background border-b border-hairline flex flex-col divide-y divide-hairline transition-transform duration-300 ${mobileOpen ? "translate-y-0" : "-translate-y-full pointer-events-none"}`,
        style: { top: "100px" },
        children: [
          navItems.map((item) => /* @__PURE__ */ jsx("a", { href: item.url, onClick: () => setMobileOpen(false), className: "px-6 py-4 text-sm tracking-wide hover:bg-surface-dim", children: item.label }, item.id)),
          isAdmin && /* @__PURE__ */ jsx(Link, { to: "/admin", onClick: () => setMobileOpen(false), className: "px-6 py-4 text-sm tracking-wide hover:bg-surface-dim", children: "Atelier Console" }),
          /* @__PURE__ */ jsx("div", { className: "px-6 py-4", children: user ? /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-sm", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-soft", children: user.email }),
            /* @__PURE__ */ jsxs(Link, { to: "/account", onClick: () => setMobileOpen(false), className: "flex items-center gap-2 hover:opacity-60", children: [
              /* @__PURE__ */ jsx(Package, { className: "w-4 h-4" }),
              " My Orders"
            ] }),
            /* @__PURE__ */ jsxs("button", { onClick: () => {
              signOut();
              setMobileOpen(false);
            }, className: "flex items-center gap-2 hover:opacity-60", children: [
              /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }),
              " Sign Out"
            ] })
          ] }) : /* @__PURE__ */ jsx(Link, { to: "/auth", search: { mode: "signin", redirect: "/" }, onClick: () => setMobileOpen(false), className: "btn-primary inline-flex", children: "Sign In" }) })
        ]
      }
    )
  ] });
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$m = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AESTHETE — Festive Indian Luxury. Worn with Fire." },
      { name: "description", content: "Hand-embroidered, mirror-worked, sequin-kissed. AESTHETE brings India's most festive craft traditions into wearable art." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "AESTHETE — Festive Indian Luxury. Worn with Fire." },
      { name: "twitter:title", content: "AESTHETE — Festive Indian Luxury. Worn with Fire." },
      { property: "og:description", content: "Hand-embroidered, mirror-worked, sequin-kissed. AESTHETE brings India's most festive craft traditions into wearable art." },
      { name: "twitter:description", content: "Hand-embroidered, mirror-worked, sequin-kissed. AESTHETE brings India's most festive craft traditions into wearable art." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c3ce38c4-46fa-43c9-9759-f58e88bf2dae/id-preview-3e2d180f--f90bd7ba-a2fd-479f-875e-98daacab9e9a.lovable.app-1781117173103.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c3ce38c4-46fa-43c9-9759-f58e88bf2dae/id-preview-3e2d180f--f90bd7ba-a2fd-479f-875e-98daacab9e9a.lovable.app-1781117173103.png" }
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" },
      { rel: "stylesheet", href: appCss }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function ScrollToTop() {
  const router2 = useRouter();
  useEffect(() => {
    const unsub = router2.subscribe("onResolved", () => window.scrollTo({ top: 0, behavior: "instant" }));
    return unsub;
  }, [router2]);
  return null;
}
function RootComponent() {
  const { queryClient } = Route$m.useRouteContext();
  const { location } = useRouterState();
  const isAdmin = location.pathname.startsWith("/admin");
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(CartProvider, { children: /* @__PURE__ */ jsxs(WishlistProvider, { children: [
    /* @__PURE__ */ jsx(ScrollToTop, {}),
    !isAdmin && /* @__PURE__ */ jsxs("div", { className: "sticky top-0 z-50", children: [
      /* @__PURE__ */ jsx(AnnouncementBar, {}),
      /* @__PURE__ */ jsx(Header, {})
    ] }),
    /* @__PURE__ */ jsx(Outlet, {}),
    /* @__PURE__ */ jsx(CartDrawer, {}),
    /* @__PURE__ */ jsx(Toaster, { position: "top-right", richColors: true, closeButton: true })
  ] }) }) });
}
const $$splitComponentImporter$l = () => import("./wishlist-1r_bgN8W.js");
const Route$l = createFileRoute("/wishlist")({
  head: () => ({
    meta: [{
      title: "Wishlist | AESTHETE"
    }, {
      name: "description",
      content: "Your saved pieces."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./collections-951R2l9L.js");
const Route$k = createFileRoute("/collections")({
  validateSearch: (search2) => ({
    filter: search2.filter || search2.category || ""
  }),
  head: () => ({
    meta: [{
      title: "Collections — The Curated Edit | AESTHETE"
    }, {
      name: "description",
      content: "Browse the curated edit of AESTHETE: tailored coats, silk dresses, knitwear, and accessories."
    }, {
      property: "og:title",
      content: "The Curated Edit | AESTHETE"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./checkout-PDy3-fYl.js");
const Route$j = createFileRoute("/checkout")({
  head: () => ({
    meta: [{
      title: "Checkout | AESTHETE"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./cart-DOi4mtG-.js");
const Route$i = createFileRoute("/cart")({
  head: () => ({
    meta: [{
      title: "Shopping Bag"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./auth-gyHZIv1l.js");
const search = z.object({
  mode: fallback(z.enum(["signin", "signup"]), "signin").default("signin"),
  redirect: fallback(z.string(), "/").default("/")
});
const Route$h = createFileRoute("/auth")({
  validateSearch: zodValidator(search),
  head: ({
    match
  }) => {
    const mode = match.search?.mode ?? "signin";
    const title = mode === "signup" ? "Join AESTHETE" : "Sign In | AESTHETE";
    return {
      meta: [{
        title
      }, {
        name: "description",
        content: "Access your AESTHETE account."
      }]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./account-CIJshUG8.js");
const Route$g = createFileRoute("/account")({
  head: () => ({
    meta: [{
      title: "My Account | AESTHETE"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./route-HsG1-7h4.js");
const Route$f = createFileRoute("/admin")({
  head: () => ({
    meta: [{
      title: "Atelier Console | AESTHETE"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./index-C3sdfHBB.js");
const Route$e = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "AESTHETE — Wear the Craft."
    }, {
      name: "description",
      content: "Hand-embroidered festive wear rooted in Indian craft traditions. Mirror work, sequins, coin tassels — made for women who celebrate loudly."
    }, {
      property: "og:type",
      content: "website"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./index-HmfbLmuU.js");
const Route$d = createFileRoute("/admin/")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./product._id-D0szbJ2g.js");
const Route$c = createFileRoute("/product/$id")({
  head: ({
    params
  }) => ({
    meta: [{
      title: `Product | AESTHETE`
    }, {
      name: "description",
      content: `Discover ${params.id} at AESTHETE.`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitNotFoundComponentImporter = () => import("./p._slug-LKfjxeVU.js");
const $$splitErrorComponentImporter = () => import("./p._slug-koVrkzgd.js");
const $$splitComponentImporter$b = () => import("./p._slug-BYy44Mgt.js");
const Route$b = createFileRoute("/p/$slug")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
const $$splitComponentImporter$a = () => import("./settings-N3UMVucq.js");
const Route$a = createFileRoute("/admin/settings")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./reviews-DIYuRosj.js");
const Route$9 = createFileRoute("/admin/reviews")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./returns-DcZzu3ET.js");
const Route$8 = createFileRoute("/admin/returns")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./pages-DMOi6CBH.js");
const Route$7 = createFileRoute("/admin/pages")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./orders-3OOZLnOe.js");
const Route$6 = createFileRoute("/admin/orders")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./navigation-ByQbxBPz.js");
const Route$5 = createFileRoute("/admin/navigation")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./media-CL0jIgpE.js");
const Route$4 = createFileRoute("/admin/media")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./inventory-Ex56Irhp.js");
const Route$3 = createFileRoute("/admin/inventory")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./homepage-CpuLzCdS.js");
const Route$2 = createFileRoute("/admin/homepage")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./customers-CfGu3he_.js");
const Route$1 = createFileRoute("/admin/customers")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./analytics-DvHRS7Bj.js");
const Route = createFileRoute("/admin/analytics")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const WishlistRoute = Route$l.update({
  id: "/wishlist",
  path: "/wishlist",
  getParentRoute: () => Route$m
});
const CollectionsRoute = Route$k.update({
  id: "/collections",
  path: "/collections",
  getParentRoute: () => Route$m
});
const CheckoutRoute = Route$j.update({
  id: "/checkout",
  path: "/checkout",
  getParentRoute: () => Route$m
});
const CartRoute = Route$i.update({
  id: "/cart",
  path: "/cart",
  getParentRoute: () => Route$m
});
const AuthRoute = Route$h.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$m
});
const AccountRoute = Route$g.update({
  id: "/account",
  path: "/account",
  getParentRoute: () => Route$m
});
const AdminRouteRoute = Route$f.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$m
});
const IndexRoute = Route$e.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$m
});
const AdminIndexRoute = Route$d.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminRouteRoute
});
const ProductIdRoute = Route$c.update({
  id: "/product/$id",
  path: "/product/$id",
  getParentRoute: () => Route$m
});
const PSlugRoute = Route$b.update({
  id: "/p/$slug",
  path: "/p/$slug",
  getParentRoute: () => Route$m
});
const AdminSettingsRoute = Route$a.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AdminRouteRoute
});
const AdminReviewsRoute = Route$9.update({
  id: "/reviews",
  path: "/reviews",
  getParentRoute: () => AdminRouteRoute
});
const AdminReturnsRoute = Route$8.update({
  id: "/returns",
  path: "/returns",
  getParentRoute: () => AdminRouteRoute
});
const AdminPagesRoute = Route$7.update({
  id: "/pages",
  path: "/pages",
  getParentRoute: () => AdminRouteRoute
});
const AdminOrdersRoute = Route$6.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => AdminRouteRoute
});
const AdminNavigationRoute = Route$5.update({
  id: "/navigation",
  path: "/navigation",
  getParentRoute: () => AdminRouteRoute
});
const AdminMediaRoute = Route$4.update({
  id: "/media",
  path: "/media",
  getParentRoute: () => AdminRouteRoute
});
const AdminInventoryRoute = Route$3.update({
  id: "/inventory",
  path: "/inventory",
  getParentRoute: () => AdminRouteRoute
});
const AdminHomepageRoute = Route$2.update({
  id: "/homepage",
  path: "/homepage",
  getParentRoute: () => AdminRouteRoute
});
const AdminCustomersRoute = Route$1.update({
  id: "/customers",
  path: "/customers",
  getParentRoute: () => AdminRouteRoute
});
const AdminAnalyticsRoute = Route.update({
  id: "/analytics",
  path: "/analytics",
  getParentRoute: () => AdminRouteRoute
});
const AdminRouteRouteChildren = {
  AdminAnalyticsRoute,
  AdminCustomersRoute,
  AdminHomepageRoute,
  AdminInventoryRoute,
  AdminMediaRoute,
  AdminNavigationRoute,
  AdminOrdersRoute,
  AdminPagesRoute,
  AdminReturnsRoute,
  AdminReviewsRoute,
  AdminSettingsRoute,
  AdminIndexRoute
};
const AdminRouteRouteWithChildren = AdminRouteRoute._addFileChildren(
  AdminRouteRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AdminRouteRoute: AdminRouteRouteWithChildren,
  AccountRoute,
  AuthRoute,
  CartRoute,
  CheckoutRoute,
  CollectionsRoute,
  WishlistRoute,
  PSlugRoute,
  ProductIdRoute
};
const routeTree = Route$m._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$k as R,
  useCart as a,
  useProducts as b,
  currency as c,
  useSiteSettings as d,
  useCategories as e,
  useHomepageSections as f,
  dateTime as g,
  Route$c as h,
  useProductBySlug as i,
  Route$b as j,
  useCmsPage as k,
  useNavItems as l,
  dateShort as m,
  router as r,
  setCurrencyFormat as s,
  useWishlist as u
};
