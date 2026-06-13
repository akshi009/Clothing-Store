import { jsxs, jsx } from "react/jsx-runtime";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { s as supabase } from "./client-BhH2qhhP.js";
import { m as dateShort } from "./router-Bjx56gfo.js";
import { Search, ShieldOff, Shield } from "lucide-react";
import { toast } from "sonner";
import "@supabase/supabase-js";
import "@tanstack/react-router";
import "zod";
import "@tanstack/zod-adapter";
function Customers() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const [profiles, roles, orders] = await Promise.all([supabase.from("profiles").select("*").order("created_at", {
        ascending: false
      }), supabase.from("user_roles").select("user_id,role"), supabase.from("orders").select("user_id,total")]);
      const roleMap = /* @__PURE__ */ new Map();
      (roles.data ?? []).forEach((r) => {
        const arr = roleMap.get(r.user_id) ?? [];
        arr.push(r.role);
        roleMap.set(r.user_id, arr);
      });
      const orderMap = /* @__PURE__ */ new Map();
      (orders.data ?? []).forEach((o) => {
        const cur = orderMap.get(o.user_id) ?? {
          count: 0,
          total: 0
        };
        cur.count += 1;
        cur.total += Number(o.total || 0);
        orderMap.set(o.user_id, cur);
      });
      return (profiles.data ?? []).map((p) => ({
        ...p,
        roles: roleMap.get(p.id) ?? [],
        order_count: orderMap.get(p.id)?.count ?? 0,
        spent: orderMap.get(p.id)?.total ?? 0
      }));
    }
  });
  const customers = data ?? [];
  const filtered = customers.filter((c) => !q || (c.email ?? "").toLowerCase().includes(q.toLowerCase()) || (c.full_name ?? "").toLowerCase().includes(q.toLowerCase()));
  const toggleAdmin = async (userId, isAdmin) => {
    if (isAdmin) {
      const {
        error
      } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      if (error) return toast.error(error.message);
      toast.success("Admin access revoked.");
    } else {
      const {
        error
      } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: "admin"
      });
      if (error) return toast.error(error.message);
      toast.success("Promoted to admin.");
    }
    qc.invalidateQueries({
      queryKey: ["admin-customers"]
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4 mb-10", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Members" }),
        /* @__PURE__ */ jsx("h1", { className: "font-serif text-3xl md:text-4xl", children: "Customers" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-ink-soft mt-2", children: [
          customers.length,
          " total signups"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" }),
        /* @__PURE__ */ jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search customers…", className: "h-10 pl-9 pr-3 border border-hairline bg-transparent text-sm focus:border-primary outline-none w-64" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border border-hairline bg-card overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-hairline text-left text-xs tracking-[0.2em] uppercase text-ink-soft", children: [
        /* @__PURE__ */ jsx("th", { className: "p-4", children: "Customer" }),
        /* @__PURE__ */ jsx("th", { className: "p-4", children: "Email" }),
        /* @__PURE__ */ jsx("th", { className: "p-4", children: "Orders" }),
        /* @__PURE__ */ jsx("th", { className: "p-4", children: "Spent" }),
        /* @__PURE__ */ jsx("th", { className: "p-4", children: "Roles" }),
        /* @__PURE__ */ jsx("th", { className: "p-4", children: "Joined" }),
        /* @__PURE__ */ jsx("th", { className: "p-4 w-px" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "p-8 text-center text-ink-soft", children: "Loading…" }) }),
        !isLoading && filtered.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "p-8 text-center text-ink-soft", children: "No customers yet." }) }),
        filtered.map((c) => {
          const isAdmin = c.roles.includes("admin");
          return /* @__PURE__ */ jsxs("tr", { className: "border-b border-hairline last:border-0 hover:bg-surface-dim/50", children: [
            /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              c.avatar_url ? /* @__PURE__ */ jsx("img", { src: c.avatar_url, alt: "", className: "w-9 h-9 rounded-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-full bg-surface-dim flex items-center justify-center text-xs font-medium", children: (c.full_name || c.email || "?").charAt(0).toUpperCase() }),
              /* @__PURE__ */ jsx("p", { className: "font-medium", children: c.full_name || "Unnamed" })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "p-4 text-ink-soft", children: c.email || "—" }),
            /* @__PURE__ */ jsx("td", { className: "p-4", children: c.order_count }),
            /* @__PURE__ */ jsxs("td", { className: "p-4 font-serif", children: [
              "$",
              c.spent.toLocaleString()
            ] }),
            /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: c.roles.map((r) => /* @__PURE__ */ jsx("span", { className: `text-[10px] tracking-[0.2em] uppercase px-2 py-1 ${r === "admin" ? "bg-primary text-primary-foreground" : "bg-surface-dim text-ink-soft"}`, children: r }, r)) }) }),
            /* @__PURE__ */ jsx("td", { className: "p-4 text-ink-soft text-xs", children: dateShort(c.created_at) }),
            /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("button", { onClick: () => toggleAdmin(c.id, isAdmin), title: isAdmin ? "Revoke admin" : "Make admin", className: "p-2 hover:bg-surface-dim", children: isAdmin ? /* @__PURE__ */ jsx(ShieldOff, { className: "w-4 h-4 text-destructive" }) : /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4" }) }) })
          ] }, c.id);
        })
      ] })
    ] }) })
  ] });
}
export {
  Customers as component
};
