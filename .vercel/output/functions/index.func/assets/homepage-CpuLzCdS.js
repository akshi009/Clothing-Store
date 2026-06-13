import { jsxs, jsx } from "react/jsx-runtime";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { s as supabase } from "./client-BhH2qhhP.js";
import { M as MediaPicker, a as MultiMediaPicker } from "./MultiMediaPicker-CAWuVVIh.js";
import { Plus, Loader2, GripVertical, Eye, EyeOff, Trash2, ChevronUp, ChevronDown, X, Save } from "lucide-react";
import { toast } from "sonner";
import { useSensors, useSensor, PointerSensor, KeyboardSensor, DndContext, closestCenter } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "@supabase/supabase-js";
import "./media-DJIl8De8.js";
const BLOCK_TYPES = [
  {
    type: "hero",
    label: "Hero Banner",
    description: "Large opening section with headline, image or video, and CTA.",
    fields: ["subtitle", "title", "body", "cta_label", "cta_url", "image", "video"],
    defaults: { title: "Your Headline", subtitle: "Eyebrow", cta_label: "Shop now", cta_url: "/collections" }
  },
  {
    type: "heritage",
    label: "Story / Heritage (Dark)",
    description: "Dark editorial block with image and copy.",
    fields: ["subtitle", "title", "body", "image"],
    defaults: { title: "Our Story", subtitle: "Heritage" }
  },
  {
    type: "featured_products",
    label: "Featured Products",
    description: "Grid of products marked as Featured.",
    fields: ["subtitle", "title"],
    defaults: { title: "Featured", subtitle: "The Selection" },
    extraEditor: "product_limit"
  },
  {
    type: "best_sellers",
    label: "Best Sellers",
    description: "Grid of most recent active products.",
    fields: ["subtitle", "title"],
    defaults: { title: "Best Sellers", subtitle: "Most Loved" },
    extraEditor: "product_limit"
  },
  {
    type: "categories",
    label: "Shop by Category",
    description: "Tiles of product categories.",
    fields: ["subtitle", "title"],
    defaults: { title: "Shop by Category", subtitle: "Browse" }
  },
  {
    type: "offer",
    label: "Offer / Promotion",
    description: "Promotional banner with image and CTA.",
    fields: ["subtitle", "title", "body", "cta_label", "cta_url", "image"],
    defaults: { title: "Limited Offer", subtitle: "Promotion", cta_label: "Shop now", cta_url: "/collections" }
  },
  {
    type: "testimonials",
    label: "Reviews & Testimonials",
    description: "Customer reviews with names, ratings and avatars.",
    fields: ["subtitle", "title"],
    defaults: { title: "What our customers say", subtitle: "Loved by many" },
    extraEditor: "testimonials"
  },
  {
    type: "video",
    label: "Video Banner",
    description: "Full-width video with optional caption.",
    fields: ["subtitle", "title", "body", "video", "image"],
    defaults: { title: "Watch the film", subtitle: "Film" }
  },
  {
    type: "newsletter",
    label: "Newsletter Signup",
    description: "Email capture block.",
    fields: ["subtitle", "title", "body", "cta_label"],
    defaults: { title: "Join our circle", subtitle: "Newsletter", cta_label: "Subscribe" }
  },
  {
    type: "image_banner",
    label: "Image Banner",
    description: "Edge-to-edge image with optional headline and CTA.",
    fields: ["title", "subtitle", "cta_label", "cta_url", "image"]
  },
  {
    type: "custom_html",
    label: "Custom Content",
    description: "Free-form HTML content block.",
    fields: ["title", "body"],
    extraEditor: "html"
  },
  {
    type: "reel_reviews",
    label: "Reel Reviews",
    description: "Horizontal scroll of customer / influencer reels with autoplay + sound toggle.",
    fields: ["subtitle", "title"],
    defaults: { title: "As seen on reels", subtitle: "Reel Reviews" },
    extraEditor: "reels"
  }
];
const blockTypeMap = Object.fromEntries(
  BLOCK_TYPES.map((b) => [b.type, b])
);
function HomepageAdmin() {
  const qc = useQueryClient();
  const {
    data = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-homepage-sections"],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("homepage_sections").select("*").order("position");
      if (error) throw error;
      return data2 ?? [];
    }
  });
  const [items, setItems] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [adding, setAdding] = useState(false);
  useEffect(() => {
    setItems(data);
  }, [data]);
  const refresh = () => qc.invalidateQueries({
    queryKey: ["admin-homepage-sections"]
  });
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  }), useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates
  }));
  const onDragEnd = async (e) => {
    const {
      active,
      over
    } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((i) => i.id === active.id);
    const newIdx = items.findIndex((i) => i.id === over.id);
    const next = arrayMove(items, oldIdx, newIdx).map((s, i) => ({
      ...s,
      position: i
    }));
    setItems(next);
    const updates = next.map((s) => supabase.from("homepage_sections").update({
      position: s.position
    }).eq("id", s.id));
    await Promise.all(updates);
    refresh();
  };
  const toggleVisible = async (s) => {
    setItems((prev) => prev.map((p) => p.id === s.id ? {
      ...p,
      visible: !s.visible
    } : p));
    const {
      error
    } = await supabase.from("homepage_sections").update({
      visible: !s.visible
    }).eq("id", s.id);
    if (error) toast.error(error.message);
    refresh();
  };
  const remove = async (s) => {
    if (!confirm(`Delete "${s.title || blockTypeMap[s.type]?.label || s.key}"?`)) return;
    const {
      error
    } = await supabase.from("homepage_sections").delete().eq("id", s.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted.");
    refresh();
  };
  const addBlock = async (type) => {
    const def = blockTypeMap[type];
    if (!def) return;
    const key = `${type}-${Math.random().toString(36).slice(2, 7)}`;
    const position = items.length;
    const payload = {
      key,
      type,
      position,
      visible: true,
      extra: {},
      title: def.defaults?.title ?? null,
      subtitle: def.defaults?.subtitle ?? null,
      body: def.defaults?.body ?? null,
      cta_label: def.defaults?.cta_label ?? null,
      cta_url: def.defaults?.cta_url ?? null,
      image_url: null,
      video_url: null
    };
    const {
      data: row,
      error
    } = await supabase.from("homepage_sections").insert(payload).select().single();
    if (error) return toast.error(error.message);
    setAdding(false);
    refresh();
    setExpanded(row.id);
    toast.success(`Added ${def.label}.`);
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10 max-w-5xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between mb-10 gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Content" }),
        /* @__PURE__ */ jsx("h1", { className: "font-serif text-3xl md:text-4xl", children: "Homepage Builder" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft mt-2", children: "Drag to reorder. Click a section to edit. Add unlimited blocks." })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => setAdding(true), className: "btn-primary", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
        " Add Block"
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsx(DndContext, { sensors, collisionDetection: closestCenter, onDragEnd, children: /* @__PURE__ */ jsx(SortableContext, { items: items.map((i) => i.id), strategy: verticalListSortingStrategy, children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      items.map((s) => /* @__PURE__ */ jsx(SortableRow, { s, expanded: expanded === s.id, onToggle: () => setExpanded(expanded === s.id ? null : s.id), onVisible: () => toggleVisible(s), onRemove: () => remove(s), onSaved: refresh }, s.id)),
      items.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft border border-dashed border-hairline p-10 text-center", children: 'No sections yet. Click "Add Block" to begin.' })
    ] }) }) }),
    adding && /* @__PURE__ */ jsx(AddBlockModal, { onClose: () => setAdding(false), onPick: addBlock })
  ] });
}
function SortableRow({
  s,
  expanded,
  onToggle,
  onVisible,
  onRemove,
  onSaved
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: s.id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  const def = blockTypeMap[s.type];
  return /* @__PURE__ */ jsxs("div", { ref: setNodeRef, style, className: "border border-hairline bg-card", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-4", children: [
      /* @__PURE__ */ jsx("button", { ...attributes, ...listeners, className: "cursor-grab active:cursor-grabbing text-ink-soft hover:text-ink", children: /* @__PURE__ */ jsx(GripVertical, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 cursor-pointer", onClick: onToggle, children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] tracking-[0.2em] uppercase text-ink-soft", children: def?.label ?? s.type }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium truncate", children: s.title || /* @__PURE__ */ jsx("span", { className: "text-ink-soft italic", children: "Untitled" }) })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: onVisible, className: "flex items-center gap-1.5 text-xs px-3 h-9 border border-hairline hover:bg-surface-dim", title: s.visible ? "Hide" : "Show", children: [
        s.visible ? /* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsx(EyeOff, { className: "w-3.5 h-3.5" }),
        s.visible ? "Visible" : "Hidden"
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onRemove, className: "w-9 h-9 flex items-center justify-center text-destructive hover:bg-destructive/10 border border-hairline", title: "Delete", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) }),
      /* @__PURE__ */ jsx("button", { onClick: onToggle, className: "w-9 h-9 flex items-center justify-center border border-hairline hover:bg-surface-dim", children: expanded ? /* @__PURE__ */ jsx(ChevronUp, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4" }) })
    ] }),
    expanded && /* @__PURE__ */ jsx(SectionEditor, { section: s, onSaved })
  ] });
}
function SectionEditor({
  section,
  onSaved
}) {
  const [s, setS] = useState(section);
  const [busy, setBusy] = useState(false);
  const def = blockTypeMap[section.type];
  useEffect(() => {
    setS(section);
  }, [section]);
  if (!def) return /* @__PURE__ */ jsxs("p", { className: "p-6 text-sm text-ink-soft", children: [
    "Unknown block type: ",
    section.type
  ] });
  const has = (f) => def.fields.includes(f);
  const save = async () => {
    setBusy(true);
    const {
      error
    } = await supabase.from("homepage_sections").update({
      title: s.title,
      subtitle: s.subtitle,
      body: s.body,
      image_url: s.image_url,
      video_url: s.video_url,
      cta_label: s.cta_label,
      cta_url: s.cta_url,
      extra: s.extra
    }).eq("id", s.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved.");
    onSaved();
  };
  const inp = "w-full h-11 border border-hairline bg-transparent px-3 text-sm focus:border-primary outline-none";
  return /* @__PURE__ */ jsxs("div", { className: "border-t border-hairline p-6 bg-surface-dim/30", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-soft mb-5", children: def.description }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
      has("subtitle") && /* @__PURE__ */ jsx(Field, { label: "Subtitle / Eyebrow", children: /* @__PURE__ */ jsx("input", { className: inp, value: s.subtitle ?? "", onChange: (e) => setS({
        ...s,
        subtitle: e.target.value
      }) }) }),
      has("title") && /* @__PURE__ */ jsx(Field, { label: "Title", children: /* @__PURE__ */ jsx("input", { className: inp, value: s.title ?? "", onChange: (e) => setS({
        ...s,
        title: e.target.value
      }) }) }),
      has("body") && /* @__PURE__ */ jsx(Field, { label: def.extraEditor === "html" ? "Body (HTML allowed)" : "Body", className: "md:col-span-2", children: /* @__PURE__ */ jsx("textarea", { rows: 4, className: `${inp} h-auto py-2`, value: s.body ?? "", onChange: (e) => setS({
        ...s,
        body: e.target.value
      }) }) }),
      has("cta_label") && /* @__PURE__ */ jsx(Field, { label: "CTA Label", children: /* @__PURE__ */ jsx("input", { className: inp, value: s.cta_label ?? "", onChange: (e) => setS({
        ...s,
        cta_label: e.target.value
      }) }) }),
      has("cta_url") && /* @__PURE__ */ jsx(Field, { label: "CTA URL", children: /* @__PURE__ */ jsx("input", { className: inp, placeholder: "/collections", value: s.cta_url ?? "", onChange: (e) => setS({
        ...s,
        cta_url: e.target.value
      }) }) }),
      has("image") && /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsx(MediaPicker, { label: "Primary Image", value: s.image_url, onChange: (v) => setS({
          ...s,
          image_url: v || null
        }) }),
        section.type === "hero" && /* @__PURE__ */ jsx(MultiMediaPicker, { label: "Floating Gallery Images (Hero) — add 3–6 images for an interactive floating layout", values: Array.isArray(s.extra?.images) ? s.extra.images : [], onChange: (imgs) => setS({
          ...s,
          extra: {
            ...s.extra,
            images: imgs
          }
        }), max: 6 })
      ] }),
      has("video") && /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(MediaPicker, { label: "Video", accept: "video", value: s.video_url, onChange: (v) => setS({
        ...s,
        video_url: v || null
      }) }) }),
      def.extraEditor === "product_limit" && /* @__PURE__ */ jsx(Field, { label: "Number of products", children: /* @__PURE__ */ jsx("input", { type: "number", min: 1, max: 12, className: inp, value: s.extra?.limit ?? 4, onChange: (e) => setS({
        ...s,
        extra: {
          ...s.extra,
          limit: Number(e.target.value) || 4
        }
      }) }) }),
      def.extraEditor === "testimonials" && /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(TestimonialsEditor, { value: s.extra?.items ?? [], onChange: (items) => setS({
        ...s,
        extra: {
          ...s.extra,
          items
        }
      }) }) }),
      def.extraEditor === "reels" && /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(ReelsEditor, { value: s.extra?.reels ?? [], onChange: (reels) => setS({
        ...s,
        extra: {
          ...s.extra,
          reels
        }
      }) }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ jsxs("button", { onClick: save, disabled: busy, className: "btn-primary", children: [
      busy ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
      " Save"
    ] }) })
  ] });
}
function TestimonialsEditor({
  value,
  onChange
}) {
  const update = (i, k, v) => onChange(value.map((it, idx) => idx === i ? {
    ...it,
    [k]: v
  } : it));
  const add = () => onChange([...value, {
    name: "",
    review: "",
    rating: 5,
    avatar: ""
  }]);
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  const inp = "w-full h-10 border border-hairline bg-transparent px-3 text-sm focus:border-primary outline-none";
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "eyebrow block mb-3", children: "Testimonials" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      value.map((t, i) => /* @__PURE__ */ jsxs("div", { className: "border border-hairline p-4 bg-card grid md:grid-cols-2 gap-3 relative", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => remove(i), className: "absolute top-2 right-2 text-destructive", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsx("input", { className: inp, placeholder: "Name", value: t.name, onChange: (e) => update(i, "name", e.target.value) }),
        /* @__PURE__ */ jsx("input", { type: "number", min: 1, max: 5, className: inp, placeholder: "Rating 1-5", value: t.rating ?? 5, onChange: (e) => update(i, "rating", Number(e.target.value)) }),
        /* @__PURE__ */ jsx("textarea", { rows: 2, className: `${inp} h-auto py-2 md:col-span-2`, placeholder: "Review text", value: t.review, onChange: (e) => update(i, "review", e.target.value) }),
        /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(MediaPicker, { label: "Avatar", value: t.avatar ?? "", onChange: (v) => update(i, "avatar", v) }) })
      ] }, i)),
      /* @__PURE__ */ jsxs("button", { onClick: add, className: "text-sm flex items-center gap-2 px-3 h-10 border border-dashed border-hairline hover:bg-surface-dim", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
        " Add testimonial"
      ] })
    ] })
  ] });
}
function AddBlockModal({
  onClose,
  onPick
}) {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { className: "bg-background max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-hairline", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-5 border-b border-hairline", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-serif text-xl", children: "Add a Block" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-5 grid sm:grid-cols-2 gap-3", children: BLOCK_TYPES.map((b) => /* @__PURE__ */ jsxs("button", { onClick: () => onPick(b.type), className: "text-left border border-hairline p-4 hover:bg-surface-dim transition", children: [
      /* @__PURE__ */ jsx("p", { className: "font-medium text-sm", children: b.label }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-soft mt-1", children: b.description })
    ] }, b.type)) })
  ] }) });
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
function ReelsEditor({
  value,
  onChange
}) {
  const inp = "w-full h-10 border border-hairline bg-transparent px-3 text-sm focus:border-primary outline-none";
  const update = (i, v) => onChange(value.map((it, idx) => idx === i ? {
    url: v
  } : it));
  const add = () => onChange([...value, {
    url: ""
  }]);
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "eyebrow block mb-3", children: "Instagram Reels" }),
    /* @__PURE__ */ jsxs("p", { className: "text-xs text-ink-soft mb-4", children: [
      "Paste an ",
      /* @__PURE__ */ jsx("strong", { children: "Instagram reel link" }),
      " — e.g. ",
      /* @__PURE__ */ jsx("span", { className: "font-mono text-[10px]", children: "https://www.instagram.com/reel/ABC123/" }),
      /* @__PURE__ */ jsx("br", {}),
      "Or upload a ",
      /* @__PURE__ */ jsx("strong", { children: "downloaded .mp4" }),
      " to Supabase Storage and paste the public URL — this gives true autoplay + mute with no restrictions."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      value.map((r, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("input", { className: `${inp} flex-1`, placeholder: "https://www.instagram.com/reel/…", value: r.url, onChange: (e) => update(i, e.target.value) }),
        /* @__PURE__ */ jsx("button", { onClick: () => remove(i), className: "shrink-0 text-destructive hover:opacity-70", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
      ] }, i)),
      /* @__PURE__ */ jsxs("button", { onClick: add, className: "text-sm flex items-center gap-2 px-3 h-10 border border-dashed border-hairline hover:bg-surface-dim", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
        " Add reel"
      ] })
    ] })
  ] });
}
export {
  HomepageAdmin as component
};
