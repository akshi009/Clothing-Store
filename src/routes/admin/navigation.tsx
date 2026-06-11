import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Eye, EyeOff, Save, Loader2, GripVertical, Instagram, Youtube, Facebook, Twitter } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const Route = createFileRoute("/admin/navigation")({ component: NavAdmin });

type NavItem = {
  id: string; location: "header" | "footer";
  label: string; url: string; position: number;
  visible: boolean; open_new_tab: boolean;
};

type SocialLinks = { instagram: string; youtube: string; facebook: string; twitter: string };
const SOCIAL_DEFAULTS: SocialLinks = { instagram: "", youtube: "", facebook: "", twitter: "" };

function NavAdmin() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-nav"],
    queryFn: async () => {
      const { data, error } = await supabase.from("nav_items" as any).select("*").order("location").order("position");
      if (error) throw error;
      return (data ?? []) as unknown as NavItem[];
    },
  });

  const { data: settingsRows } = useQuery({
    queryKey: ["admin-nav-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*");
      const map: Record<string, any> = {};
      (data ?? []).forEach((r: any) => { map[r.key] = r.value; });
      return map;
    },
  });

  const [social, setSocial] = useState<SocialLinks>(SOCIAL_DEFAULTS);
  const [socialBusy, setSocialBusy] = useState(false);
  const [visitRaw, setVisitRaw] = useState("");
  const [visitBusy, setVisitBusy] = useState(false);

  useEffect(() => {
    if (settingsRows?.social) setSocial({ ...SOCIAL_DEFAULTS, ...settingsRows.social });
    if (settingsRows?.visit?.locations) setVisitRaw((settingsRows.visit.locations as string[]).join("\n"));
  }, [settingsRows]);

  const saveSocial = async () => {
    setSocialBusy(true);
    const { error } = await supabase.from("site_settings").upsert([
      { key: "social", value: social, updated_at: new Date().toISOString() },
    ]);
    setSocialBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Social links saved.");
    qc.invalidateQueries({ queryKey: ["admin-nav-settings"] });
    qc.invalidateQueries({ queryKey: ["storefront-settings"] });
  };

  const saveVisit = async () => {
    setVisitBusy(true);
    const locations = visitRaw.split("\n").map((s) => s.trim()).filter(Boolean);
    const { error } = await supabase.from("site_settings").upsert([
      { key: "visit", value: { locations }, updated_at: new Date().toISOString() },
    ]);
    setVisitBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Visit locations saved.");
    qc.invalidateQueries({ queryKey: ["admin-nav-settings"] });
    qc.invalidateQueries({ queryKey: ["storefront-settings"] });
  };

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-nav"] });

  const add = async (location: "header" | "footer") => {
    const max = data.filter((i) => i.location === location).reduce((m, i) => Math.max(m, i.position), 0);
    const { error } = await supabase.from("nav_items" as any).insert({ location, label: "New Link", url: "/", position: max + 1, visible: true, open_new_tab: false });
    if (error) toast.error(error.message); else { toast.success("Link added."); refresh(); }
  };

  const inp = "w-full h-11 border border-hairline bg-transparent px-3 text-sm focus:border-primary outline-none";

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="mb-10">
        <p className="eyebrow mb-2">Navigation</p>
        <h1 className="font-serif text-3xl md:text-4xl">Menus</h1>
        <p className="text-sm text-ink-soft mt-2">Drag to reorder. Edit inline. Changes are saved per row.</p>
      </div>
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <div className="space-y-12">
          {(["header", "footer"] as const).map((loc) => (
            <NavSection
              key={loc}
              location={loc}
              items={data.filter((i) => i.location === loc)}
              onAdd={() => add(loc)}
              onRefresh={refresh}
            />
          ))}

          {/* Visit locations */}
          <section>
            <div className="mb-4">
              <h2 className="font-serif text-2xl">Visit Locations</h2>
              <p className="text-sm text-ink-soft mt-1">One location per line. Shown in the footer Visit column.</p>
            </div>
            <div className="border border-hairline bg-card p-6">
              <textarea
                rows={5}
                className="w-full border border-hairline bg-transparent px-3 py-2 text-sm focus:border-primary outline-none resize-y"
                placeholder={"Mumbai — Bandra Kurla\nDelhi — Lodhi Colony\nBengaluru — Indiranagar"}
                value={visitRaw}
                onChange={(e) => setVisitRaw(e.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={saveVisit} disabled={visitBusy} className="btn-primary">
                {visitBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Locations
              </button>
            </div>
          </section>

          {/* Social links */}
          <section>
            <div className="mb-4">
              <h2 className="font-serif text-2xl">Social Links</h2>
              <p className="text-sm text-ink-soft mt-1">Shown as icons in the footer.</p>
            </div>
            <div className="border border-hairline bg-card p-6 grid sm:grid-cols-2 gap-4">
              {([
                { key: "instagram", icon: <Instagram className="w-4 h-4" />, placeholder: "https://instagram.com/yourhandle" },
                { key: "youtube",   icon: <Youtube   className="w-4 h-4" />, placeholder: "https://youtube.com/@yourchannel" },
                { key: "facebook",  icon: <Facebook  className="w-4 h-4" />, placeholder: "https://facebook.com/yourpage" },
                { key: "twitter",   icon: <Twitter   className="w-4 h-4" />, placeholder: "https://x.com/yourhandle" },
              ] as const).map(({ key, icon, placeholder }) => (
                <div key={key}>
                  <label className="eyebrow block mb-2 capitalize">{key}</label>
                  <div className="flex items-center border border-hairline focus-within:border-primary">
                    <span className="px-3 text-ink-soft">{icon}</span>
                    <input
                      className="flex-1 h-11 bg-transparent pr-3 text-sm outline-none"
                      placeholder={placeholder}
                      value={social[key as keyof SocialLinks]}
                      onChange={(e) => setSocial((s) => ({ ...s, [key]: e.target.value }))}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={saveSocial} disabled={socialBusy} className="btn-primary">
                {socialBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Social Links
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function NavSection({ location, items, onAdd, onRefresh }: {
  location: "header" | "footer";
  items: NavItem[];
  onAdd: () => void;
  onRefresh: () => void;
}) {
  const [list, setList] = useState<NavItem[]>(items);
  useEffect(() => { setList(items); }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = list.findIndex((i) => i.id === active.id);
    const newIdx = list.findIndex((i) => i.id === over.id);
    const next = arrayMove(list, oldIdx, newIdx).map((item, i) => ({ ...item, position: i }));
    setList(next);
    await Promise.all(
      next.map((item) => supabase.from("nav_items" as any).update({ position: item.position }).eq("id", item.id)),
    );
    onRefresh();
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl capitalize">{location} Menu</h2>
        <button onClick={onAdd} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Link
        </button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={list.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="border border-hairline bg-card divide-y divide-hairline">
            {list.length === 0 ? (
              <p className="p-6 text-sm text-ink-soft">No items yet — click Add Link.</p>
            ) : (
              list.map((item) => (
                <SortableNavRow key={item.id} item={item} onRefresh={onRefresh} />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}

function SortableNavRow({ item, onRefresh }: { item: NavItem; onRefresh: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  const [v, setV] = useState(item);
  const [busy, setBusy] = useState(false);
  useEffect(() => { setV(item); }, [item]);

  const save = async () => {
    setBusy(true);
    const { error } = await supabase.from("nav_items" as any)
      .update({ label: v.label, url: v.url, visible: v.visible })
      .eq("id", v.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved.");
    onRefresh();
  };

  const remove = async () => {
    if (!confirm("Remove this link?")) return;
    const { error } = await supabase.from("nav_items" as any).delete().eq("id", v.id);
    if (error) toast.error(error.message); else { toast.success("Removed."); onRefresh(); }
  };

  return (
    <div ref={setNodeRef} style={style} className="p-4 flex flex-wrap items-center gap-3 bg-card">
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-ink-soft hover:text-ink shrink-0"
        title="Drag to reorder"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      <input
        value={v.label}
        onChange={(e) => setV({ ...v, label: e.target.value })}
        placeholder="Label"
        className="h-10 px-3 border border-hairline bg-transparent text-sm flex-1 min-w-[130px] focus:border-primary outline-none"
      />
      <input
        value={v.url}
        onChange={(e) => setV({ ...v, url: e.target.value })}
        placeholder="/collections or https://…"
        className="h-10 px-3 border border-hairline bg-transparent text-sm flex-1 min-w-[200px] focus:border-primary outline-none"
      />

      {/* Visible toggle */}
      <button
        onClick={() => setV({ ...v, visible: !v.visible })}
        title={v.visible ? "Visible" : "Hidden"}
        className={`h-10 px-3 border text-xs flex items-center gap-1.5 transition ${v.visible ? "border-primary text-primary" : "border-hairline text-ink-soft"}`}
      >
        {v.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        {v.visible ? "Visible" : "Hidden"}
      </button>

      <button
        onClick={save}
        disabled={busy}
        className="h-10 px-4 bg-primary text-primary-foreground text-xs flex items-center gap-1.5 shrink-0"
      >
        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
        Save
      </button>

      <button
        onClick={remove}
        className="h-10 px-3 border border-hairline text-xs text-destructive flex items-center gap-1.5 shrink-0 hover:bg-destructive/10 transition"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
