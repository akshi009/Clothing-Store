import { jsxs, jsx } from "react/jsx-runtime";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { s as supabase } from "./client-BhH2qhhP.js";
import { Plus, Trash2, ExternalLink, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import "@supabase/supabase-js";
function PagesAdmin() {
  const qc = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const {
    data = []
  } = useQuery({
    queryKey: ["admin-pages"],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("pages").select("*").order("title");
      if (error) throw error;
      return data2 ?? [];
    }
  });
  const refresh = () => qc.invalidateQueries({
    queryKey: ["admin-pages"]
  });
  const create = async () => {
    const slug = prompt("URL slug (e.g. 'returns')")?.trim();
    if (!slug) return;
    const {
      data: row,
      error
    } = await supabase.from("pages").insert({
      slug,
      title: slug,
      content: "<p>New page</p>"
    }).select().single();
    if (error) return toast.error(error.message);
    refresh();
    setEditingId(row.id);
  };
  const remove = async (id) => {
    if (!confirm("Delete page?")) return;
    const {
      error
    } = await supabase.from("pages").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      refresh();
      if (editingId === id) setEditingId(null);
    }
  };
  const editing = data.find((p) => p.id === editingId);
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between mb-10", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Content" }),
        /* @__PURE__ */ jsx("h1", { className: "font-serif text-3xl md:text-4xl", children: "Pages" })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: create, className: "btn-primary", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
        " New Page"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-[300px_1fr] gap-6", children: [
      /* @__PURE__ */ jsxs("aside", { className: "border border-hairline bg-card divide-y divide-hairline h-fit", children: [
        data.map((p) => /* @__PURE__ */ jsxs("div", { className: `p-3 flex items-center justify-between cursor-pointer hover:bg-surface-dim ${editingId === p.id ? "bg-surface-dim" : ""}`, onClick: () => setEditingId(p.id), children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium truncate", children: p.title }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-ink-soft", children: [
              "/p/",
              p.slug,
              " · ",
              p.status
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: (e) => {
            e.stopPropagation();
            remove(p.id);
          }, className: "text-ink-soft hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
        ] }, p.id)),
        data.length === 0 && /* @__PURE__ */ jsx("p", { className: "p-6 text-sm text-ink-soft", children: "No pages." })
      ] }),
      /* @__PURE__ */ jsx("div", { children: editing ? /* @__PURE__ */ jsx(PageEditor, { page: editing, onSaved: refresh }, editing.id) : /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft p-6 border border-hairline", children: "Select a page to edit, or create one." }) })
    ] })
  ] });
}
function PageEditor({
  page,
  onSaved
}) {
  const [p, setP] = useState(page);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setP(page);
  }, [page]);
  const save = async () => {
    setBusy(true);
    const {
      error
    } = await supabase.from("pages").update({
      slug: p.slug,
      title: p.title,
      content: p.content,
      meta_title: p.meta_title,
      meta_description: p.meta_description,
      status: p.status
    }).eq("id", p.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved.");
    onSaved();
  };
  const inp = "w-full h-11 border border-hairline bg-transparent px-3 text-sm focus:border-primary outline-none";
  return /* @__PURE__ */ jsxs("div", { className: "border border-hairline bg-card p-6 space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsx(Field, { label: "Title", children: /* @__PURE__ */ jsx("input", { className: inp, value: p.title, onChange: (e) => setP({
        ...p,
        title: e.target.value
      }) }) }),
      /* @__PURE__ */ jsx(Field, { label: "Slug", children: /* @__PURE__ */ jsx("input", { className: inp, value: p.slug, onChange: (e) => setP({
        ...p,
        slug: e.target.value
      }) }) }),
      /* @__PURE__ */ jsx(Field, { label: "SEO Meta Title", children: /* @__PURE__ */ jsx("input", { className: inp, value: p.meta_title ?? "", onChange: (e) => setP({
        ...p,
        meta_title: e.target.value
      }) }) }),
      /* @__PURE__ */ jsx(Field, { label: "Status", children: /* @__PURE__ */ jsxs("select", { className: inp, value: p.status, onChange: (e) => setP({
        ...p,
        status: e.target.value
      }), children: [
        /* @__PURE__ */ jsx("option", { value: "published", children: "Published" }),
        /* @__PURE__ */ jsx("option", { value: "draft", children: "Draft" })
      ] }) }),
      /* @__PURE__ */ jsx(Field, { label: "SEO Meta Description", className: "md:col-span-2", children: /* @__PURE__ */ jsx("textarea", { rows: 2, className: `${inp} h-auto py-2`, value: p.meta_description ?? "", onChange: (e) => setP({
        ...p,
        meta_description: e.target.value
      }) }) })
    ] }),
    /* @__PURE__ */ jsx(Field, { label: "Content (HTML — use <h2>, <p>, <ul>, <a href> etc.)", children: /* @__PURE__ */ jsx("textarea", { rows: 16, className: `${inp} h-auto py-3 font-mono text-xs`, value: p.content, onChange: (e) => setP({
      ...p,
      content: e.target.value
    }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("a", { href: `/p/${p.slug}`, target: "_blank", rel: "noreferrer", className: "text-xs text-ink-soft hover:text-ink flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" }),
        " Preview /p/",
        p.slug
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: save, disabled: busy, className: "btn-primary", children: [
        busy ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
        " Save Page"
      ] })
    ] })
  ] });
}
function Field({
  label,
  children,
  className = ""
}) {
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsx("label", { className: "eyebrow block mb-2", children: label }),
    children
  ] });
}
export {
  PagesAdmin as component
};
