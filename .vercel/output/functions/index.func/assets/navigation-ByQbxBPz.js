import { jsxs, jsx } from "react/jsx-runtime";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { s as supabase } from "./client-BhH2qhhP.js";
import { Loader2, Save, Instagram, Youtube, Facebook, Twitter, Plus, GripVertical, Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSensors, useSensor, PointerSensor, KeyboardSensor, DndContext, closestCenter } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "@supabase/supabase-js";
const SOCIAL_DEFAULTS = {
  instagram: "",
  youtube: "",
  facebook: "",
  twitter: ""
};
function NavAdmin() {
  const qc = useQueryClient();
  const {
    data = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-nav"],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("nav_items").select("*").order("location").order("position");
      if (error) throw error;
      return data2 ?? [];
    }
  });
  const {
    data: settingsRows
  } = useQuery({
    queryKey: ["admin-nav-settings"],
    queryFn: async () => {
      const {
        data: data2
      } = await supabase.from("site_settings").select("*");
      const map = {};
      (data2 ?? []).forEach((r) => {
        map[r.key] = r.value;
      });
      return map;
    }
  });
  const [social, setSocial] = useState(SOCIAL_DEFAULTS);
  const [socialBusy, setSocialBusy] = useState(false);
  const [visitRaw, setVisitRaw] = useState("");
  const [visitBusy, setVisitBusy] = useState(false);
  useEffect(() => {
    if (settingsRows?.social) setSocial({
      ...SOCIAL_DEFAULTS,
      ...settingsRows.social
    });
    if (settingsRows?.visit?.locations) setVisitRaw(settingsRows.visit.locations.join("\n"));
  }, [settingsRows]);
  const saveSocial = async () => {
    setSocialBusy(true);
    const {
      error
    } = await supabase.from("site_settings").upsert([{
      key: "social",
      value: social,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }]);
    setSocialBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Social links saved.");
    qc.invalidateQueries({
      queryKey: ["admin-nav-settings"]
    });
    qc.invalidateQueries({
      queryKey: ["storefront-settings"]
    });
  };
  const saveVisit = async () => {
    setVisitBusy(true);
    const locations = visitRaw.split("\n").map((s) => s.trim()).filter(Boolean);
    const {
      error
    } = await supabase.from("site_settings").upsert([{
      key: "visit",
      value: {
        locations
      },
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }]);
    setVisitBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Visit locations saved.");
    qc.invalidateQueries({
      queryKey: ["admin-nav-settings"]
    });
    qc.invalidateQueries({
      queryKey: ["storefront-settings"]
    });
  };
  const refresh = () => qc.invalidateQueries({
    queryKey: ["admin-nav"]
  });
  const add = async (location) => {
    const max = data.filter((i) => i.location === location).reduce((m, i) => Math.max(m, i.position), 0);
    const {
      error
    } = await supabase.from("nav_items").insert({
      location,
      label: "New Link",
      url: "/",
      position: max + 1,
      visible: true,
      open_new_tab: false
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Link added.");
      refresh();
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10 max-w-4xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Navigation" }),
      /* @__PURE__ */ jsx("h1", { className: "font-serif text-3xl md:text-4xl", children: "Menus" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft mt-2", children: "Drag to reorder. Edit inline. Changes are saved per row." })
    ] }),
    isLoading ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxs("div", { className: "space-y-12", children: [
      ["header", "footer"].map((loc) => /* @__PURE__ */ jsx(NavSection, { location: loc, items: data.filter((i) => i.location === loc), onAdd: () => add(loc), onRefresh: refresh }, loc)),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl", children: "Visit Locations" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft mt-1", children: "One location per line. Shown in the footer Visit column." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "border border-hairline bg-card p-6", children: /* @__PURE__ */ jsx("textarea", { rows: 5, className: "w-full border border-hairline bg-transparent px-3 py-2 text-sm focus:border-primary outline-none resize-y", placeholder: "Mumbai — Bandra Kurla\nDelhi — Lodhi Colony\nBengaluru — Indiranagar", value: visitRaw, onChange: (e) => setVisitRaw(e.target.value) }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsxs("button", { onClick: saveVisit, disabled: visitBusy, className: "btn-primary", children: [
          visitBusy ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
          " Save Locations"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl", children: "Social Links" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft mt-1", children: "Shown as icons in the footer." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "border border-hairline bg-card p-6 grid sm:grid-cols-2 gap-4", children: [{
          key: "instagram",
          icon: /* @__PURE__ */ jsx(Instagram, { className: "w-4 h-4" }),
          placeholder: "https://instagram.com/yourhandle"
        }, {
          key: "youtube",
          icon: /* @__PURE__ */ jsx(Youtube, { className: "w-4 h-4" }),
          placeholder: "https://youtube.com/@yourchannel"
        }, {
          key: "facebook",
          icon: /* @__PURE__ */ jsx(Facebook, { className: "w-4 h-4" }),
          placeholder: "https://facebook.com/yourpage"
        }, {
          key: "twitter",
          icon: /* @__PURE__ */ jsx(Twitter, { className: "w-4 h-4" }),
          placeholder: "https://x.com/yourhandle"
        }].map(({
          key,
          icon,
          placeholder
        }) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "eyebrow block mb-2 capitalize", children: key }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center border border-hairline focus-within:border-primary", children: [
            /* @__PURE__ */ jsx("span", { className: "px-3 text-ink-soft", children: icon }),
            /* @__PURE__ */ jsx("input", { className: "flex-1 h-11 bg-transparent pr-3 text-sm outline-none", placeholder, value: social[key], onChange: (e) => setSocial((s) => ({
              ...s,
              [key]: e.target.value
            })) })
          ] })
        ] }, key)) }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsxs("button", { onClick: saveSocial, disabled: socialBusy, className: "btn-primary", children: [
          socialBusy ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
          " Save Social Links"
        ] }) })
      ] })
    ] })
  ] });
}
function NavSection({
  location,
  items,
  onAdd,
  onRefresh
}) {
  const [list, setList] = useState(items);
  useEffect(() => {
    setList(items);
  }, [items]);
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
    const oldIdx = list.findIndex((i) => i.id === active.id);
    const newIdx = list.findIndex((i) => i.id === over.id);
    const next = arrayMove(list, oldIdx, newIdx).map((item, i) => ({
      ...item,
      position: i
    }));
    setList(next);
    await Promise.all(next.map((item) => supabase.from("nav_items").update({
      position: item.position
    }).eq("id", item.id)));
    onRefresh();
  };
  return /* @__PURE__ */ jsxs("section", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxs("h2", { className: "font-serif text-2xl capitalize", children: [
        location,
        " Menu"
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: onAdd, className: "btn-primary", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
        " Add Link"
      ] })
    ] }),
    /* @__PURE__ */ jsx(DndContext, { sensors, collisionDetection: closestCenter, onDragEnd, children: /* @__PURE__ */ jsx(SortableContext, { items: list.map((i) => i.id), strategy: verticalListSortingStrategy, children: /* @__PURE__ */ jsx("div", { className: "border border-hairline bg-card divide-y divide-hairline", children: list.length === 0 ? /* @__PURE__ */ jsx("p", { className: "p-6 text-sm text-ink-soft", children: "No items yet — click Add Link." }) : list.map((item) => /* @__PURE__ */ jsx(SortableNavRow, { item, onRefresh }, item.id)) }) }) })
  ] });
}
function SortableNavRow({
  item,
  onRefresh
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: item.id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  const [v, setV] = useState(item);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setV(item);
  }, [item]);
  const save = async () => {
    setBusy(true);
    const {
      error
    } = await supabase.from("nav_items").update({
      label: v.label,
      url: v.url,
      visible: v.visible
    }).eq("id", v.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved.");
    onRefresh();
  };
  const remove = async () => {
    if (!confirm("Remove this link?")) return;
    const {
      error
    } = await supabase.from("nav_items").delete().eq("id", v.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Removed.");
      onRefresh();
    }
  };
  return /* @__PURE__ */ jsxs("div", { ref: setNodeRef, style, className: "p-4 flex flex-wrap items-center gap-3 bg-card", children: [
    /* @__PURE__ */ jsx("button", { ...attributes, ...listeners, className: "cursor-grab active:cursor-grabbing text-ink-soft hover:text-ink shrink-0", title: "Drag to reorder", children: /* @__PURE__ */ jsx(GripVertical, { className: "w-5 h-5" }) }),
    /* @__PURE__ */ jsx("input", { value: v.label, onChange: (e) => setV({
      ...v,
      label: e.target.value
    }), placeholder: "Label", className: "h-10 px-3 border border-hairline bg-transparent text-sm flex-1 min-w-[130px] focus:border-primary outline-none" }),
    /* @__PURE__ */ jsx("input", { value: v.url, onChange: (e) => setV({
      ...v,
      url: e.target.value
    }), placeholder: "/collections or https://…", className: "h-10 px-3 border border-hairline bg-transparent text-sm flex-1 min-w-[200px] focus:border-primary outline-none" }),
    /* @__PURE__ */ jsxs("button", { onClick: () => setV({
      ...v,
      visible: !v.visible
    }), title: v.visible ? "Visible" : "Hidden", className: `h-10 px-3 border text-xs flex items-center gap-1.5 transition ${v.visible ? "border-primary text-primary" : "border-hairline text-ink-soft"}`, children: [
      v.visible ? /* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsx(EyeOff, { className: "w-3.5 h-3.5" }),
      v.visible ? "Visible" : "Hidden"
    ] }),
    /* @__PURE__ */ jsxs("button", { onClick: save, disabled: busy, className: "h-10 px-4 bg-primary text-primary-foreground text-xs flex items-center gap-1.5 shrink-0", children: [
      busy ? /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-3.5 h-3.5" }),
      "Save"
    ] }),
    /* @__PURE__ */ jsx("button", { onClick: remove, className: "h-10 px-3 border border-hairline text-xs text-destructive flex items-center gap-1.5 shrink-0 hover:bg-destructive/10 transition", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }) })
  ] });
}
export {
  NavAdmin as component
};
