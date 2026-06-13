import { jsxs, jsx } from "react/jsx-runtime";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { s as supabase } from "./client-BhH2qhhP.js";
import { Star, Check, X, EyeOff, Eye, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import "@supabase/supabase-js";
const STATUS = ["pending", "approved", "rejected", "hidden"];
function ReviewsAdmin() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("pending");
  const {
    data: reviews = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("reviews").select("*, products!inner(id,name,slug,image_url)").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  useEffect(() => {
    const ch = supabase.channel("admin-reviews-live").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "reviews"
    }, () => qc.invalidateQueries({
      queryKey: ["admin-reviews"]
    })).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);
  const update = async (id, patch) => {
    const {
      error
    } = await supabase.from("reviews").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Updated.");
  };
  const remove = async (id) => {
    if (!confirm("Delete this review?")) return;
    const {
      error
    } = await supabase.from("reviews").delete().eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Deleted.");
  };
  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4 mb-10", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Moderation" }),
        /* @__PURE__ */ jsx("h1", { className: "font-serif text-3xl md:text-4xl", children: "Reviews" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 flex-wrap", children: ["all", ...STATUS].map((s) => /* @__PURE__ */ jsx("button", { onClick: () => setFilter(s), className: `text-[10px] tracking-[0.2em] uppercase px-4 h-9 border ${filter === s ? "border-primary bg-primary text-primary-foreground" : "border-hairline"}`, children: s }, s)) })
    ] }),
    isLoading ? /* @__PURE__ */ jsx("p", { className: "text-ink-soft text-sm", children: "Loading…" }) : filtered.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-ink-soft text-sm", children: "No reviews." }) : /* @__PURE__ */ jsx("ul", { className: "space-y-4", children: filtered.map((r) => /* @__PURE__ */ jsxs("li", { className: "border border-hairline p-5 bg-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start gap-4", children: [
        r.products?.image_url && /* @__PURE__ */ jsx("img", { src: r.products.image_url, alt: "", className: "w-16 h-16 object-cover border border-hairline" }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: r.products?.name ?? "—" }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-1 my-1", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsx(Star, { className: `w-4 h-4 ${n <= r.rating ? "fill-current" : "text-ink-soft"}` }, n)) }),
          r.title && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: r.title }),
          r.body && /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft whitespace-pre-line mt-1", children: r.body }),
          Array.isArray(r.images) && r.images.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: r.images.map((u) => /* @__PURE__ */ jsx("img", { src: u, alt: "", className: "w-14 h-14 object-cover border border-hairline" }, u)) }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-ink-soft mt-2", children: [
            "— ",
            r.author_name || "Customer",
            ", ",
            new Date(r.created_at).toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 bg-surface-dim", children: r.status })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mt-4", children: [
        /* @__PURE__ */ jsx(ActBtn, { icon: Check, label: "Approve", onClick: () => update(r.id, {
          status: "approved"
        }) }),
        /* @__PURE__ */ jsx(ActBtn, { icon: X, label: "Reject", onClick: () => update(r.id, {
          status: "rejected"
        }) }),
        /* @__PURE__ */ jsx(ActBtn, { icon: EyeOff, label: "Hide", onClick: () => update(r.id, {
          status: "hidden"
        }) }),
        /* @__PURE__ */ jsx(ActBtn, { icon: Eye, label: "Restore", onClick: () => update(r.id, {
          status: "approved"
        }) }),
        /* @__PURE__ */ jsx(ActBtn, { icon: Sparkles, label: r.featured ? "Unfeature" : "Feature", onClick: () => update(r.id, {
          featured: !r.featured
        }), active: r.featured }),
        /* @__PURE__ */ jsxs("button", { onClick: () => remove(r.id), className: "text-[10px] tracking-[0.2em] uppercase px-3 h-8 border border-hairline text-destructive hover:bg-surface-dim inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" }),
          " Delete"
        ] })
      ] })
    ] }, r.id)) })
  ] });
}
function ActBtn({
  icon: Icon,
  label,
  onClick,
  active
}) {
  return /* @__PURE__ */ jsxs("button", { onClick, className: `text-[10px] tracking-[0.2em] uppercase px-3 h-8 border inline-flex items-center gap-1 ${active ? "border-primary bg-primary text-primary-foreground" : "border-hairline hover:bg-surface-dim"}`, children: [
    /* @__PURE__ */ jsx(Icon, { className: "w-3 h-3" }),
    " ",
    label
  ] });
}
export {
  ReviewsAdmin as component
};
