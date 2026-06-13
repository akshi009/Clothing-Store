import { jsx, jsxs } from "react/jsx-runtime";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { s as supabase } from "./client-BhH2qhhP.js";
import { z } from "zod";
import { toast } from "sonner";
import { X, Loader2, Search, Plus, Star, Pencil, Trash2 } from "lucide-react";
import { M as MediaPicker, a as MultiMediaPicker } from "./MultiMediaPicker-CAWuVVIh.js";
import { c as currency, m as dateShort } from "./router-Bjx56gfo.js";
import "@supabase/supabase-js";
import "./media-DJIl8De8.js";
import "@tanstack/react-router";
import "@tanstack/zod-adapter";
const schema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, "lowercase, numbers, hyphens"),
  category: z.string().min(1).max(80),
  price: z.number().min(0).max(1e6),
  stock: z.number().int().min(0).max(1e5),
  description: z.string().max(2e3).optional().or(z.literal("")),
  image_url: z.string().url().max(2048).optional().or(z.literal("")),
  status: z.enum(["active", "draft", "archived"]),
  featured: z.boolean()
});
const empty = {
  name: "",
  slug: "",
  category: "Essentials",
  price: 0,
  stock: 0,
  description: "",
  image_url: "",
  images: [],
  composition_care: "",
  shipping_returns: "",
  status: "active",
  featured: false
};
function ProductForm({ product, onClose, onSaved }) {
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setForm(product ? { ...empty, ...product, price: Number(product.price) } : empty);
  }, [product]);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = async (e) => {
    e.preventDefault();
    const parsed = schema.safeParse({ ...form, price: Number(form.price), stock: Number(form.stock) });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setBusy(true);
    const payload = { ...parsed.data, description: parsed.data.description || null, image_url: parsed.data.image_url || null };
    if ((form.images ?? []).length > 0) payload.images = form.images;
    if (form.composition_care !== void 0) payload.composition_care = form.composition_care || null;
    if (form.shipping_returns !== void 0) payload.shipping_returns = form.shipping_returns || null;
    const { error } = form.id ? await supabase.from("products").update(payload).eq("id", form.id) : await supabase.from("products").insert(payload);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(form.id ? "Product updated." : "Product created.");
    onSaved();
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { className: "bg-background border border-hairline w-full max-w-2xl max-h-[90vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6 border-b border-hairline sticky top-0 bg-background", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-1", children: form.id ? "Edit" : "Create" }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl", children: form.id ? form.name || "Product" : "New Product" })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "p-2 hover:bg-surface-dim", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6 grid grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsx(Field, { label: "Name", className: "col-span-2", children: /* @__PURE__ */ jsx("input", { required: true, value: form.name, onChange: (e) => set("name", e.target.value), className: inp }) }),
      /* @__PURE__ */ jsx(Field, { label: "Slug", children: /* @__PURE__ */ jsx("input", { required: true, value: form.slug, onChange: (e) => set("slug", e.target.value.toLowerCase()), className: inp, placeholder: "silk-shirt" }) }),
      /* @__PURE__ */ jsx(Field, { label: "Category", children: /* @__PURE__ */ jsx("input", { required: true, value: form.category, onChange: (e) => set("category", e.target.value), className: inp }) }),
      /* @__PURE__ */ jsx(Field, { label: "Price (USD)", children: /* @__PURE__ */ jsx("input", { required: true, type: "number", min: "0", step: "0.01", value: form.price, onChange: (e) => set("price", parseFloat(e.target.value || "0")), className: inp }) }),
      /* @__PURE__ */ jsx(Field, { label: "Stock", children: /* @__PURE__ */ jsx("input", { required: true, type: "number", min: "0", value: form.stock, onChange: (e) => set("stock", parseInt(e.target.value || "0", 10)), className: inp }) }),
      /* @__PURE__ */ jsx(Field, { label: "Status", children: /* @__PURE__ */ jsxs("select", { value: form.status, onChange: (e) => set("status", e.target.value), className: inp, children: [
        /* @__PURE__ */ jsx("option", { value: "active", children: "Active" }),
        /* @__PURE__ */ jsx("option", { value: "draft", children: "Draft" }),
        /* @__PURE__ */ jsx("option", { value: "archived", children: "Archived" })
      ] }) }),
      /* @__PURE__ */ jsx(Field, { label: "Featured", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 h-12 text-sm", children: [
        /* @__PURE__ */ jsx("input", { type: "checkbox", checked: form.featured, onChange: (e) => set("featured", e.target.checked), className: "w-4 h-4" }),
        "Show on homepage"
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsx(MediaPicker, { label: "Cover Image", value: form.image_url, onChange: (v) => set("image_url", v || null) }) }),
      /* @__PURE__ */ jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsx(
        MultiMediaPicker,
        {
          label: "Gallery Images (shown in product page carousel)",
          values: form.images ?? [],
          onChange: (imgs) => set("images", imgs)
        }
      ) }),
      /* @__PURE__ */ jsx(Field, { label: "Description", className: "col-span-2", children: /* @__PURE__ */ jsx("textarea", { value: form.description ?? "", onChange: (e) => set("description", e.target.value), rows: 4, className: `${inp} h-auto py-3` }) }),
      /* @__PURE__ */ jsx(Field, { label: "Composition & Care", className: "col-span-2", children: /* @__PURE__ */ jsx(
        "textarea",
        {
          value: form.composition_care ?? "",
          onChange: (e) => set("composition_care", e.target.value),
          rows: 3,
          placeholder: "e.g. 100% hand-woven cotton. Dry clean only. Do not bleach.",
          className: `${inp} h-auto py-3`
        }
      ) }),
      /* @__PURE__ */ jsx(Field, { label: "Shipping & Returns", className: "col-span-2", children: /* @__PURE__ */ jsx(
        "textarea",
        {
          value: form.shipping_returns ?? "",
          onChange: (e) => set("shipping_returns", e.target.value),
          rows: 3,
          placeholder: "e.g. Free shipping on orders above ₹5,000. Returns accepted within 7 days.",
          className: `${inp} h-auto py-3`
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-2 flex justify-end gap-3 pt-4 border-t border-hairline", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "btn-ghost", children: "Cancel" }),
        /* @__PURE__ */ jsxs("button", { type: "submit", disabled: busy, className: "btn-primary", children: [
          busy && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
          form.id ? "Save Changes" : "Create Product"
        ] })
      ] })
    ] })
  ] }) });
}
const inp = "w-full h-12 border border-hairline bg-transparent px-4 text-sm focus:border-primary outline-none";
function Field({ label, children, className = "" }) {
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsx("label", { className: "eyebrow block mb-2", children: label }),
    children
  ] });
}
function Inventory() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const {
    data: products = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("products").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const filtered = products.filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.slug.toLowerCase().includes(q.toLowerCase()));
  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    const {
      error
    } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Product deleted.");
    qc.invalidateQueries({
      queryKey: ["admin-products"]
    });
  };
  const toggleFeatured = async (p) => {
    const {
      error
    } = await supabase.from("products").update({
      featured: !p.featured
    }).eq("id", p.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({
      queryKey: ["admin-products"]
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4 mb-10", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Catalog" }),
        /* @__PURE__ */ jsx("h1", { className: "font-serif text-3xl md:text-4xl", children: "Inventory" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" }),
          /* @__PURE__ */ jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search products…", className: "h-10 pl-9 pr-3 border border-hairline bg-transparent text-sm focus:border-primary outline-none w-64" })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => {
          setEditing(null);
          setOpen(true);
        }, className: "btn-primary", children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
          " New Product"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border border-hairline bg-card overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-hairline text-left text-xs tracking-[0.2em] uppercase text-ink-soft", children: [
        /* @__PURE__ */ jsx("th", { className: "p-4", children: "Product" }),
        /* @__PURE__ */ jsx("th", { className: "p-4", children: "Category" }),
        /* @__PURE__ */ jsx("th", { className: "p-4", children: "Price" }),
        /* @__PURE__ */ jsx("th", { className: "p-4", children: "Stock" }),
        /* @__PURE__ */ jsx("th", { className: "p-4", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "p-4", children: "Added" }),
        /* @__PURE__ */ jsx("th", { className: "p-4 w-px" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "p-8 text-center text-ink-soft", children: "Loading…" }) }),
        !isLoading && filtered.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "p-8 text-center text-ink-soft", children: "No products yet. Create your first one." }) }),
        filtered.map((p) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-hairline last:border-0 hover:bg-surface-dim/50", children: [
          /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            p.image_url ? /* @__PURE__ */ jsx("img", { src: p.image_url, alt: "", className: "w-12 h-12 object-cover bg-surface-dim" }) : /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-surface-dim" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium", children: p.name }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-soft", children: p.slug })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "p-4 text-ink-soft", children: p.category }),
          /* @__PURE__ */ jsx("td", { className: "p-4", children: currency(p.price) }),
          /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("span", { className: p.stock < 5 ? "text-destructive" : "", children: p.stock }) }),
          /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("span", { className: `text-[10px] tracking-[0.2em] uppercase px-2 py-1 ${p.status === "active" ? "bg-primary/10 text-primary" : p.status === "draft" ? "bg-surface-dim text-ink-soft" : "bg-destructive/10 text-destructive"}`, children: p.status }) }),
          /* @__PURE__ */ jsx("td", { className: "p-4 text-ink-soft text-xs", children: dateShort(p.created_at) }),
          /* @__PURE__ */ jsxs("td", { className: "p-4 whitespace-nowrap", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => toggleFeatured(p), title: "Toggle featured", className: "p-2 hover:bg-surface-dim", children: /* @__PURE__ */ jsx(Star, { className: `w-4 h-4 ${p.featured ? "fill-primary text-primary" : "text-ink-soft"}` }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => {
              setEditing(p);
              setOpen(true);
            }, className: "p-2 hover:bg-surface-dim", children: /* @__PURE__ */ jsx(Pencil, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => remove(p.id), className: "p-2 hover:bg-surface-dim text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
          ] })
        ] }, p.id))
      ] })
    ] }) }),
    open && /* @__PURE__ */ jsx(ProductForm, { product: editing, onClose: () => setOpen(false), onSaved: () => {
      setOpen(false);
      qc.invalidateQueries({
        queryKey: ["admin-products"]
      });
    } })
  ] });
}
export {
  Inventory as component
};
