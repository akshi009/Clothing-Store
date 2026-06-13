import { jsxs, jsx } from "react/jsx-runtime";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { s as supabase } from "./client-BhH2qhhP.js";
import { c as currency, g as dateTime } from "./router-Bjx56gfo.js";
import { Eye, Trash2, X, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import { O as ORDER_STATUSES, S as STATUS_LABEL } from "./orders-Dp7z8102.js";
import "@supabase/supabase-js";
import "@tanstack/react-router";
import "zod";
import "@tanstack/zod-adapter";
const statuses = ORDER_STATUSES;
function Orders() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);
  const {
    data: orders = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("orders").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  useEffect(() => {
    const ch = supabase.channel("orders-live").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "orders"
    }, () => {
      qc.invalidateQueries({
        queryKey: ["admin-orders"]
      });
    }).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);
  const updateStatus = async (id, status) => {
    const {
      error
    } = await supabase.from("orders").update({
      status
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order updated.");
  };
  const remove = async (id) => {
    if (!confirm("Delete this order?")) return;
    const {
      error
    } = await supabase.from("orders").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order deleted.");
    qc.invalidateQueries({
      queryKey: ["admin-orders"]
    });
  };
  const filtered = orders.filter((o) => filter === "all" || o.status === filter);
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4 mb-10", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Fulfillment" }),
        /* @__PURE__ */ jsx("h1", { className: "font-serif text-3xl md:text-4xl", children: "Orders" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 flex-wrap", children: ["all", ...statuses].map((s) => /* @__PURE__ */ jsx("button", { onClick: () => setFilter(s), className: `text-[10px] tracking-[0.2em] uppercase px-4 h-9 border ${filter === s ? "border-primary bg-primary text-primary-foreground" : "border-hairline"}`, children: s }, s)) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border border-hairline bg-card overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-hairline text-left text-xs tracking-[0.2em] uppercase text-ink-soft", children: [
        /* @__PURE__ */ jsx("th", { className: "p-4", children: "Order" }),
        /* @__PURE__ */ jsx("th", { className: "p-4", children: "Customer" }),
        /* @__PURE__ */ jsx("th", { className: "p-4", children: "Total" }),
        /* @__PURE__ */ jsx("th", { className: "p-4", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "p-4", children: "Date" }),
        /* @__PURE__ */ jsx("th", { className: "p-4 w-px" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 6, className: "p-8 text-center text-ink-soft", children: "Loading…" }) }),
        !isLoading && filtered.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 6, className: "p-8 text-center text-ink-soft", children: "No orders yet." }) }),
        filtered.map((o) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-hairline last:border-0 hover:bg-surface-dim/50", children: [
          /* @__PURE__ */ jsxs("td", { className: "p-4 font-mono text-xs", children: [
            "#",
            o.id.slice(0, 8)
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium", children: o.customer_name || "—" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-soft", children: o.customer_email })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "p-4 font-serif", children: currency(o.total) }),
          /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("select", { value: o.status, onChange: (e) => updateStatus(o.id, e.target.value), className: "text-xs border border-hairline bg-transparent h-8 px-2", children: statuses.map((s) => /* @__PURE__ */ jsx("option", { value: s, children: STATUS_LABEL[s] ?? s }, s)) }) }),
          /* @__PURE__ */ jsx("td", { className: "p-4 text-ink-soft text-xs", children: dateTime(o.created_at) }),
          /* @__PURE__ */ jsxs("td", { className: "p-4 whitespace-nowrap", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => setOpen(o), className: "p-2 hover:bg-surface-dim", children: /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => remove(o.id), className: "p-2 hover:bg-surface-dim text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
          ] })
        ] }, o.id))
      ] })
    ] }) }),
    open && /* @__PURE__ */ jsx(OrderDetail, { order: open, onClose: () => setOpen(null) })
  ] });
}
function OrderDetail({
  order,
  onClose
}) {
  const {
    data: items = []
  } = useQuery({
    queryKey: ["order-items", order.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("order_items").select("*").eq("order_id", order.id);
      if (error) throw error;
      return data ?? [];
    }
  });
  const addr = order.shipping_address ?? {};
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { className: "bg-background border border-hairline w-full max-w-2xl max-h-[90vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6 border-b border-hairline", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "eyebrow mb-1", children: [
          "Order #",
          order.id.slice(0, 8)
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl", children: order.customer_name || "Customer" })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "p-2 hover:bg-surface-dim", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "eyebrow mb-1", children: "Email" }),
          /* @__PURE__ */ jsx("p", { children: order.customer_email || "—" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "eyebrow mb-1", children: "Status" }),
          /* @__PURE__ */ jsx("p", { children: order.status })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "eyebrow mb-1", children: "Total" }),
          /* @__PURE__ */ jsx("p", { className: "font-serif text-lg", children: currency(order.total) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "eyebrow mb-1", children: "Date" }),
          /* @__PURE__ */ jsx("p", { children: dateTime(order.created_at) })
        ] })
      ] }),
      Object.keys(addr).length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Shipping" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft whitespace-pre-line", children: [addr.line1, addr.line2, addr.city, addr.region, addr.postal_code, addr.country].filter(Boolean).join("\n") })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-3", children: "Items" }),
        /* @__PURE__ */ jsxs("div", { className: "border border-hairline", children: [
          items.length === 0 && /* @__PURE__ */ jsx("p", { className: "p-4 text-sm text-ink-soft", children: "No items recorded." }),
          items.map((it) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-4 border-b border-hairline last:border-0 text-sm", children: [
            it.image_url && /* @__PURE__ */ jsx("img", { src: it.image_url, alt: "", className: "w-12 h-12 object-cover border border-hairline" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium truncate", children: it.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-ink-soft", children: [
                "Qty ",
                it.quantity
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { children: currency(Number(it.price) * it.quantity) })
          ] }, it.id))
        ] })
      ] }),
      order.notes && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-1", children: "Notes" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft", children: order.notes })
      ] }),
      /* @__PURE__ */ jsx(OrderTimeline, { orderId: order.id })
    ] })
  ] }) });
}
function OrderTimeline({
  orderId
}) {
  const qc = useQueryClient();
  const [note, setNote] = useState("");
  const {
    data: events = []
  } = useQuery({
    queryKey: ["admin-order-events", orderId],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("order_events").select("*").eq("order_id", orderId).order("created_at", {
        ascending: true
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  useEffect(() => {
    const ch = supabase.channel(`adm-evt-${orderId}`).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "order_events",
      filter: `order_id=eq.${orderId}`
    }, () => qc.invalidateQueries({
      queryKey: ["admin-order-events", orderId]
    })).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [orderId, qc]);
  const addNote = async () => {
    if (!note.trim()) return;
    const {
      error
    } = await supabase.from("order_events").insert({
      order_id: orderId,
      note,
      actor_role: "admin"
    });
    if (error) return toast.error(error.message);
    setNote("");
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("p", { className: "eyebrow mb-3", children: "Timeline" }),
    /* @__PURE__ */ jsxs("ol", { className: "border border-hairline divide-y divide-hairline", children: [
      events.length === 0 && /* @__PURE__ */ jsx("li", { className: "p-3 text-sm text-ink-soft", children: "No events." }),
      events.map((e) => /* @__PURE__ */ jsxs("li", { className: "p-3 text-xs flex gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "w-36 shrink-0 text-ink-soft", children: new Date(e.created_at).toLocaleString() }),
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: e.status ? STATUS_LABEL[e.status] ?? e.status : "Note" }),
        e.note && /* @__PURE__ */ jsxs("span", { className: "text-ink-soft", children: [
          "— ",
          e.note
        ] }),
        /* @__PURE__ */ jsx("span", { className: "ml-auto text-[10px] uppercase tracking-[0.18em]", children: e.actor_role })
      ] }, e.id))
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 flex gap-2", children: [
      /* @__PURE__ */ jsx("input", { value: note, onChange: (e) => setNote(e.target.value), placeholder: "Add admin note…", className: "flex-1 h-9 border border-hairline bg-transparent px-3 text-sm" }),
      /* @__PURE__ */ jsxs("button", { onClick: addNote, className: "text-xs tracking-[0.2em] uppercase border border-hairline px-3 h-9 hover:bg-surface-dim inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(MessageSquarePlus, { className: "w-3 h-3" }),
        " Add"
      ] })
    ] })
  ] });
}
export {
  Orders as component
};
