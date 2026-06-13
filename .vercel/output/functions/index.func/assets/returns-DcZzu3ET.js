import { jsxs, jsx } from "react/jsx-runtime";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { s as supabase } from "./client-BhH2qhhP.js";
import { toast } from "sonner";
import { R as RETURN_STATUS_LABEL } from "./orders-Dp7z8102.js";
import "@supabase/supabase-js";
const STATUSES = ["submitted", "under_review", "approved", "rejected", "scheduled", "completed"];
function ReturnsAdmin() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("all");
  const {
    data: rows = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-returns"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("return_requests").select("*, orders(id,customer_name,customer_email,total)").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  useEffect(() => {
    const ch = supabase.channel("admin-returns-live").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "return_requests"
    }, () => qc.invalidateQueries({
      queryKey: ["admin-returns"]
    })).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);
  const patch = async (id, body) => {
    const {
      error
    } = await supabase.from("return_requests").update(body).eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Updated.");
  };
  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4 mb-10", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Reverse Logistics" }),
        /* @__PURE__ */ jsx("h1", { className: "font-serif text-3xl md:text-4xl", children: "Returns" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 flex-wrap", children: ["all", ...STATUSES].map((s) => /* @__PURE__ */ jsx("button", { onClick: () => setFilter(s), className: `text-[10px] tracking-[0.2em] uppercase px-4 h-9 border ${filter === s ? "border-primary bg-primary text-primary-foreground" : "border-hairline"}`, children: s.replace("_", " ") }, s)) })
    ] }),
    isLoading ? /* @__PURE__ */ jsx("p", { className: "text-ink-soft text-sm", children: "Loading…" }) : filtered.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-ink-soft text-sm", children: "No return requests." }) : /* @__PURE__ */ jsx("ul", { className: "space-y-4", children: filtered.map((r) => /* @__PURE__ */ jsx(ReturnRow, { r, onPatch: patch }, r.id)) })
  ] });
}
function ReturnRow({
  r,
  onPatch
}) {
  const [notes, setNotes] = useState(r.admin_notes ?? "");
  const [pickup, setPickup] = useState(r.pickup_scheduled_at ? r.pickup_scheduled_at.slice(0, 16) : "");
  return /* @__PURE__ */ jsxs("li", { className: "border border-hairline p-5 bg-card space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 items-start justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "eyebrow mb-1", children: [
          "Order #",
          String(r.order_id).slice(0, 8)
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium", children: [
          r.orders?.customer_name || "—",
          " · ",
          /* @__PURE__ */ jsx("span", { className: "text-ink-soft", children: r.orders?.customer_email })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm mt-2", children: [
          /* @__PURE__ */ jsx("strong", { children: "Reason:" }),
          " ",
          r.reason
        ] }),
        r.comments && /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft mt-1", children: r.comments }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-soft mt-2", children: (r.items ?? []).map((i) => `${i.name} ×${i.quantity}`).join(", ") }),
        Array.isArray(r.images) && r.images.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: r.images.map((u) => /* @__PURE__ */ jsx("a", { href: u, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ jsx("img", { src: u, alt: "", className: "w-16 h-16 object-cover border border-hairline" }) }, u)) })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 bg-surface-dim", children: RETURN_STATUS_LABEL[r.status] ?? r.status })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-3 pt-3 border-t border-hairline", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Admin Notes" }),
        /* @__PURE__ */ jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), rows: 2, className: "w-full border border-hairline bg-transparent px-3 py-2 text-sm" }),
        /* @__PURE__ */ jsx("button", { onClick: () => onPatch(r.id, {
          admin_notes: notes
        }), className: "mt-2 text-[10px] tracking-[0.2em] uppercase border border-hairline px-3 h-8 hover:bg-surface-dim", children: "Save Notes" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Pickup Date" }),
        /* @__PURE__ */ jsx("input", { type: "datetime-local", value: pickup, onChange: (e) => setPickup(e.target.value), className: "w-full h-10 border border-hairline bg-transparent px-3 text-sm" }),
        /* @__PURE__ */ jsx("button", { onClick: () => onPatch(r.id, {
          pickup_scheduled_at: pickup ? new Date(pickup).toISOString() : null,
          status: "scheduled"
        }), className: "mt-2 text-[10px] tracking-[0.2em] uppercase border border-hairline px-3 h-8 hover:bg-surface-dim", children: "Schedule" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 pt-3 border-t border-hairline", children: [
      STATUSES.map((s) => /* @__PURE__ */ jsx("button", { onClick: () => onPatch(r.id, {
        status: s
      }), className: `text-[10px] tracking-[0.2em] uppercase px-3 h-8 border ${r.status === s ? "border-primary bg-primary text-primary-foreground" : "border-hairline hover:bg-surface-dim"}`, children: s.replace("_", " ") }, s)),
      /* @__PURE__ */ jsxs("select", { value: r.refund_status ?? "", onChange: (e) => onPatch(r.id, {
        refund_status: e.target.value || null
      }), className: "text-[10px] tracking-[0.2em] uppercase px-3 h-8 border border-hairline bg-transparent", children: [
        /* @__PURE__ */ jsx("option", { value: "", children: "Refund: —" }),
        /* @__PURE__ */ jsx("option", { value: "pending", children: "Refund: Pending" }),
        /* @__PURE__ */ jsx("option", { value: "processed", children: "Refund: Processed" }),
        /* @__PURE__ */ jsx("option", { value: "na", children: "Refund: N/A" })
      ] })
    ] })
  ] });
}
export {
  ReturnsAdmin as component
};
