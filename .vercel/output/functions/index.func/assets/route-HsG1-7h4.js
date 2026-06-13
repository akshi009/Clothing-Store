import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useRouterState, Link, useNavigate, Outlet } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { s as supabase } from "./client-BhH2qhhP.js";
import { Menu, X, LayoutDashboard, Home, FileText, Image, Package, ShoppingCart, Star, RotateCcw, Users, BarChart3, Settings, Store, LogOut, Loader2, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import "@supabase/supabase-js";
const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/homepage", label: "Homepage", icon: Home },
  { to: "/admin/pages", label: "Pages", icon: FileText },
  { to: "/admin/navigation", label: "Navigation", icon: Menu },
  { to: "/admin/media", label: "Media", icon: Image },
  { to: "/admin/inventory", label: "Inventory", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/returns", label: "Returns", icon: RotateCcw },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings }
];
function NavLinks({ path, onClose }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("nav", { className: "flex-1 space-y-1", children: items.map((it) => {
      const Icon = it.icon;
      const active = it.exact ? path === it.to : path.startsWith(it.to);
      return /* @__PURE__ */ jsxs(
        Link,
        {
          to: it.to,
          onClick: onClose,
          className: `flex items-center gap-3 px-3 h-10 text-sm rounded-sm transition ${active ? "bg-primary text-primary-foreground" : "text-ink hover:bg-surface-dim"}`,
          children: [
            /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" }),
            it.label
          ]
        },
        it.to
      );
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 pt-6 border-t border-hairline space-y-1", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", onClick: onClose, className: "flex items-center gap-3 px-3 h-10 text-sm text-ink-soft hover:bg-surface-dim rounded-sm transition", children: [
        /* @__PURE__ */ jsx(Store, { className: "w-4 h-4" }),
        " View Storefront"
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: async () => {
            await supabase.auth.signOut();
            window.location.href = "/auth";
          },
          className: "flex items-center gap-3 px-3 h-10 text-sm text-ink-soft hover:bg-surface-dim rounded-sm transition w-full",
          children: [
            /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }),
            " Sign Out"
          ]
        }
      )
    ] })
  ] });
}
function AdminSidebar() {
  const { location } = useRouterState();
  const path = location.pathname;
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
  }, [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("aside", { className: "hidden lg:flex flex-col w-64 border-r border-hairline bg-surface-dim/40 min-h-screen p-6 sticky top-0 shrink-0", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: "font-serif text-2xl tracking-[0.18em] font-bold mb-1", children: "AESTHETE" }),
      /* @__PURE__ */ jsx("p", { className: "eyebrow mb-10", children: "Atelier Console" }),
      /* @__PURE__ */ jsx(NavLinks, { path })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-background border-b border-hairline flex items-center justify-between px-4", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: "font-serif text-xl tracking-[0.18em] font-bold", children: "AESTHETE" }),
      /* @__PURE__ */ jsx("button", { onClick: () => setOpen(true), className: "p-2 -mr-2", children: /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" }) })
    ] }),
    open && /* @__PURE__ */ jsx(
      "div",
      {
        className: "lg:hidden fixed inset-0 bg-black/40 z-50",
        onClick: () => setOpen(false)
      }
    ),
    /* @__PURE__ */ jsxs(
      "aside",
      {
        className: `lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-background border-r border-hairline flex flex-col p-6 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsx(Link, { to: "/", className: "font-serif text-2xl tracking-[0.18em] font-bold", children: "AESTHETE" }),
            /* @__PURE__ */ jsx("button", { onClick: () => setOpen(false), className: "p-1 -mr-1", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "eyebrow mb-8", children: "Atelier Console" }),
          /* @__PURE__ */ jsx(NavLinks, { path, onClose: () => setOpen(false) })
        ]
      }
    )
  ] });
}
function AdminLayout() {
  const navigate = useNavigate();
  const [state, setState] = useState("loading");
  const [userId, setUserId] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const check = async () => {
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (!session) {
      navigate({
        to: "/auth",
        search: {
          mode: "signin",
          redirect: "/admin"
        },
        replace: true
      });
      setState("unauth");
      return;
    }
    setUserId(session.user.id);
    const {
      data: mine
    } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
    if (mine) {
      setState("ok");
      return;
    }
    const {
      count
    } = await supabase.from("user_roles").select("*", {
      count: "exact",
      head: true
    }).eq("role", "admin");
    setState((count ?? 0) === 0 ? "no-admins" : "not-admin");
  };
  useEffect(() => {
    check();
  }, []);
  const claimAdmin = async () => {
    if (!userId) return;
    setClaiming(true);
    const {
      data,
      error
    } = await supabase.rpc("claim_first_admin");
    setClaiming(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data) {
      toast.error("An admin already exists.");
      await check();
      return;
    }
    toast.success("You are now an admin.");
    setState("ok");
  };
  if (state === "loading" || state === "unauth") {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsx(Loader2, { className: "w-6 h-6 animate-spin text-ink-soft" }) });
  }
  if (state === "no-admins") {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center px-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow mb-3", children: "Initial Setup" }),
      /* @__PURE__ */ jsx("h1", { className: "font-serif text-3xl mb-4", children: "Claim the Atelier" }),
      /* @__PURE__ */ jsx("p", { className: "text-ink-soft mb-8", children: "No admins exist yet. Claim ownership of this store to access the admin console." }),
      /* @__PURE__ */ jsxs("button", { onClick: claimAdmin, disabled: claiming, className: "btn-primary justify-center", children: [
        claiming && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
        "Become Admin"
      ] })
    ] }) });
  }
  if (state === "not-admin") {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center px-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
      /* @__PURE__ */ jsx(ShieldOff, { className: "w-10 h-10 mx-auto mb-4 text-ink-soft" }),
      /* @__PURE__ */ jsx("h1", { className: "font-serif text-3xl mb-3", children: "Access Restricted" }),
      /* @__PURE__ */ jsx("p", { className: "text-ink-soft mb-6", children: "Your account does not have admin privileges." }),
      /* @__PURE__ */ jsx("button", { onClick: async () => {
        await supabase.auth.signOut();
        navigate({
          to: "/auth",
          search: {
            mode: "signin",
            redirect: "/admin"
          },
          replace: true
        });
      }, className: "btn-ghost", children: "Sign in with another account" })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground flex", children: [
    /* @__PURE__ */ jsx(AdminSidebar, {}),
    /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0 pt-14 lg:pt-0", children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
}
export {
  AdminLayout as component
};
