import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { s as supabase } from "./client-BhH2qhhP.js";
import { c as currency, g as dateTime } from "./router-Bjx56gfo.js";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import { IndianRupee, ShoppingCart, Users, Package, ArrowUpRight } from "lucide-react";
import "@supabase/supabase-js";
import "react";
import "sonner";
import "zod";
import "@tanstack/zod-adapter";
function Dashboard() {
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const [orders2, products, profiles] = await Promise.all([supabase.from("orders").select("id,total,status,created_at,customer_name,customer_email").order("created_at", {
        ascending: false
      }), supabase.from("products").select("id,stock", {
        count: "exact",
        head: false
      }), supabase.from("profiles").select("id", {
        count: "exact",
        head: true
      })]);
      return {
        orders: orders2.data ?? [],
        productCount: products.data?.length ?? 0,
        lowStock: (products.data ?? []).filter((p) => p.stock < 5).length,
        customerCount: profiles.count ?? 0
      };
    }
  });
  const orders = data?.orders ?? [];
  const revenue = orders.reduce((s, o) => s + Number(o.total || 0), 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const days = Array.from({
    length: 14
  }, (_, i) => {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().slice(0, 10);
  });
  const chart = days.map((day) => {
    const dayOrders = orders.filter((o) => o.created_at.startsWith(day));
    return {
      day: day.slice(5),
      revenue: dayOrders.reduce((s, o) => s + Number(o.total || 0), 0),
      orders: dayOrders.length
    };
  });
  const stats = [{
    label: "Total Revenue",
    value: currency(revenue),
    icon: IndianRupee,
    hint: `${orders.length} orders`
  }, {
    label: "Pending Orders",
    value: pending,
    icon: ShoppingCart,
    hint: "Awaiting fulfillment"
  }, {
    label: "Customers",
    value: data?.customerCount ?? 0,
    icon: Users,
    hint: "Total signups"
  }, {
    label: "Products",
    value: data?.productCount ?? 0,
    icon: Package,
    hint: `${data?.lowStock ?? 0} low stock`
  }];
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between mb-10", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Overview" }),
        /* @__PURE__ */ jsx("h1", { className: "font-serif text-3xl md:text-4xl", children: "Atelier Dashboard" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-soft", children: isLoading ? "Loading…" : "Live data" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10", children: stats.map((s) => {
      const Icon = s.icon;
      return /* @__PURE__ */ jsxs("div", { className: "border border-hairline p-6 bg-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsx("p", { className: "eyebrow", children: s.label }),
          /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4 text-ink-soft" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "font-serif text-3xl", children: s.value }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-soft mt-2", children: s.hint })
      ] }, s.label);
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-3 gap-6 mb-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 border border-hairline bg-card p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "eyebrow mb-1", children: "Last 14 Days" }),
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-xl", children: "Revenue & Orders" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "h-72", children: /* @__PURE__ */ jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxs(AreaChart, { data: chart, children: [
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "rev", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "var(--ink)", stopOpacity: 0.25 }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "var(--ink)", stopOpacity: 0 })
          ] }) }),
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--hairline)" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "day", stroke: "var(--ink-soft)", fontSize: 11 }),
          /* @__PURE__ */ jsx(YAxis, { stroke: "var(--ink-soft)", fontSize: 11 }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
            background: "var(--card)",
            border: "1px solid var(--hairline)",
            fontSize: 12
          } }),
          /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "revenue", stroke: "var(--ink)", fill: "url(#rev)", strokeWidth: 2 })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border border-hairline bg-card p-6", children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-1", children: "Recent" }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-xl mb-6", children: "Latest Orders" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          orders.slice(0, 6).map((o) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start text-sm pb-4 border-b border-hairline last:border-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium truncate", children: o.customer_name || o.customer_email || "Guest" }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-ink-soft mt-0.5", children: [
                dateTime(o.created_at),
                " • ",
                o.status
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "font-serif", children: currency(o.total) })
          ] }, o.id)),
          orders.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft", children: "No orders yet." })
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/admin/orders", className: "mt-6 inline-flex items-center gap-1 text-xs tracking-[0.2em] uppercase", children: [
          "View all ",
          /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3" })
        ] })
      ] })
    ] })
  ] });
}
export {
  Dashboard as component
};
