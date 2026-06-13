import { jsxs, jsx } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { s as supabase } from "./client-BhH2qhhP.js";
import { c as currency } from "./router-Bjx56gfo.js";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, BarChart, Legend, Bar, PieChart, Pie, Cell } from "recharts";
import "@supabase/supabase-js";
import "@tanstack/react-router";
import "react";
import "sonner";
import "lucide-react";
import "zod";
import "@tanstack/zod-adapter";
const COLORS = ["#1a1a1a", "#4a4441", "#8a857d", "#c5beb1", "#e5ddca"];
function Analytics() {
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const [orders2, items2, products2, profiles2] = await Promise.all([supabase.from("orders").select("id,total,status,created_at"), supabase.from("order_items").select("name,price,quantity,product_id"), supabase.from("products").select("id,name,category,stock"), supabase.from("profiles").select("id,created_at")]);
      return {
        orders: orders2.data ?? [],
        items: items2.data ?? [],
        products: products2.data ?? [],
        profiles: profiles2.data ?? []
      };
    }
  });
  const orders = data?.orders ?? [];
  const items = data?.items ?? [];
  const products = data?.products ?? [];
  const profiles = data?.profiles ?? [];
  const days = Array.from({
    length: 30
  }, (_, i) => {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });
  const series = days.map((day) => {
    const dayOrders = orders.filter((o) => o.created_at.startsWith(day));
    const daySignups = profiles.filter((p) => p.created_at.startsWith(day));
    return {
      day: day.slice(5),
      revenue: dayOrders.reduce((s, o) => s + Number(o.total || 0), 0),
      orders: dayOrders.length,
      signups: daySignups.length
    };
  });
  const statusCounts = {};
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value
  }));
  const productSales = /* @__PURE__ */ new Map();
  items.forEach((i) => {
    const cur = productSales.get(i.name) ?? {
      name: i.name,
      qty: 0,
      revenue: 0
    };
    cur.qty += i.quantity;
    cur.revenue += Number(i.price) * i.quantity;
    productSales.set(i.name, cur);
  });
  const topProducts = [...productSales.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 8);
  const catTotals = {};
  products.forEach((p) => {
    catTotals[p.category] = (catTotals[p.category] ?? 0) + 1;
  });
  const catData = Object.entries(catTotals).map(([name, value]) => ({
    name,
    value
  }));
  const totalRev = orders.reduce((s, o) => s + Number(o.total || 0), 0);
  const avgOrder = orders.length ? totalRev / orders.length : 0;
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between mb-10", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Insights" }),
        /* @__PURE__ */ jsx("h1", { className: "font-serif text-3xl md:text-4xl", children: "Analytics" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-soft", children: isLoading ? "Loading…" : `${orders.length} orders analyzed` })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-3 gap-4 mb-8", children: [
      /* @__PURE__ */ jsx(Stat, { label: "Total Revenue", value: currency(totalRev) }),
      /* @__PURE__ */ jsx(Stat, { label: "Average Order Value", value: currency(avgOrder) }),
      /* @__PURE__ */ jsx(Stat, { label: "Conversion (30d)", value: `${profiles.length ? (orders.length / Math.max(profiles.length, 1) * 100).toFixed(1) : 0}%` })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-6 mb-6", children: [
      /* @__PURE__ */ jsx(Card, { title: "Revenue (30 days)", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxs(LineChart, { data: series, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--hairline)" }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "day", stroke: "var(--ink-soft)", fontSize: 11 }),
        /* @__PURE__ */ jsx(YAxis, { stroke: "var(--ink-soft)", fontSize: 11 }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
          background: "var(--card)",
          border: "1px solid var(--hairline)",
          fontSize: 12
        } }),
        /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "revenue", stroke: "var(--ink)", strokeWidth: 2, dot: false })
      ] }) }) }),
      /* @__PURE__ */ jsx(Card, { title: "Orders & Signups", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxs(BarChart, { data: series, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--hairline)" }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "day", stroke: "var(--ink-soft)", fontSize: 11 }),
        /* @__PURE__ */ jsx(YAxis, { stroke: "var(--ink-soft)", fontSize: 11 }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
          background: "var(--card)",
          border: "1px solid var(--hairline)",
          fontSize: 12
        } }),
        /* @__PURE__ */ jsx(Legend, { wrapperStyle: {
          fontSize: 11
        } }),
        /* @__PURE__ */ jsx(Bar, { dataKey: "orders", fill: "var(--ink)" }),
        /* @__PURE__ */ jsx(Bar, { dataKey: "signups", fill: "var(--ink-soft)" })
      ] }) }) }),
      /* @__PURE__ */ jsx(Card, { title: "Top Products", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxs(BarChart, { data: topProducts, layout: "vertical", children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--hairline)" }),
        /* @__PURE__ */ jsx(XAxis, { type: "number", stroke: "var(--ink-soft)", fontSize: 11 }),
        /* @__PURE__ */ jsx(YAxis, { type: "category", dataKey: "name", stroke: "var(--ink-soft)", fontSize: 11, width: 130 }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
          background: "var(--card)",
          border: "1px solid var(--hairline)",
          fontSize: 12
        } }),
        /* @__PURE__ */ jsx(Bar, { dataKey: "revenue", fill: "var(--ink)" })
      ] }) }) }),
      /* @__PURE__ */ jsx(Card, { title: "Order Status", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxs(PieChart, { children: [
        /* @__PURE__ */ jsx(Pie, { data: statusData.length ? statusData : [{
          name: "none",
          value: 1
        }], dataKey: "value", nameKey: "name", outerRadius: 100, label: true, children: statusData.map((_, i) => /* @__PURE__ */ jsx(Cell, { fill: COLORS[i % COLORS.length] }, i)) }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
          background: "var(--card)",
          border: "1px solid var(--hairline)",
          fontSize: 12
        } }),
        /* @__PURE__ */ jsx(Legend, { wrapperStyle: {
          fontSize: 11
        } })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsx(Card, { title: "Catalog by Category", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxs(BarChart, { data: catData, children: [
      /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--hairline)" }),
      /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "var(--ink-soft)", fontSize: 11 }),
      /* @__PURE__ */ jsx(YAxis, { stroke: "var(--ink-soft)", fontSize: 11 }),
      /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
        background: "var(--card)",
        border: "1px solid var(--hairline)",
        fontSize: 12
      } }),
      /* @__PURE__ */ jsx(Bar, { dataKey: "value", fill: "var(--ink)" })
    ] }) }) })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "border border-hairline bg-card p-6", children: [
    /* @__PURE__ */ jsx("p", { className: "eyebrow mb-3", children: label }),
    /* @__PURE__ */ jsx("p", { className: "font-serif text-3xl", children: value })
  ] });
}
function Card({
  title,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "border border-hairline bg-card p-6", children: [
    /* @__PURE__ */ jsx("p", { className: "eyebrow mb-1", children: "Chart" }),
    /* @__PURE__ */ jsx("h2", { className: "font-serif text-xl mb-5", children: title }),
    children
  ] });
}
export {
  Analytics as component
};
