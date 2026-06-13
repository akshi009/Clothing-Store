import { jsxs, jsx } from "react/jsx-runtime";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useRef, useState, useEffect } from "react";
import { s as supabase } from "./client-BhH2qhhP.js";
import { Loader2, Upload, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { s as signedUrl, i as isVideoUrl } from "./media-DJIl8De8.js";
import "@supabase/supabase-js";
function MediaAdmin() {
  const qc = useQueryClient();
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const {
    data = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-media"],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.storage.from("media").list("", {
        limit: 200,
        sortBy: {
          column: "created_at",
          order: "desc"
        }
      });
      if (error) throw error;
      return (data2 ?? []).filter((f) => f.name && !f.name.startsWith("."));
    }
  });
  const refresh = () => qc.invalidateQueries({
    queryKey: ["admin-media"]
  });
  const upload = async (files) => {
    setBusy(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop() || "bin";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const {
        error
      } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type
      });
      if (error) toast.error(`${file.name}: ${error.message}`);
    }
    setBusy(false);
    refresh();
    toast.success("Upload complete.");
  };
  const remove = async (name) => {
    if (!confirm("Delete this file?")) return;
    const {
      error
    } = await supabase.storage.from("media").remove([name]);
    if (error) toast.error(error.message);
    else refresh();
  };
  const copy = async (name) => {
    try {
      const url = await signedUrl(name);
      await navigator.clipboard.writeText(url);
      toast.success("URL copied.");
    } catch (e) {
      toast.error(e.message ?? "Failed");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between mb-10", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Library" }),
        /* @__PURE__ */ jsx("h1", { className: "font-serif text-3xl md:text-4xl", children: "Media" })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => ref.current?.click(), disabled: busy, className: "btn-primary", children: [
        busy ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4" }),
        " Upload"
      ] }),
      /* @__PURE__ */ jsx("input", { ref, type: "file", hidden: true, multiple: true, accept: "image/*,video/*", onChange: (e) => {
        if (e.target.files?.length) upload(e.target.files);
        e.target.value = "";
      } })
    ] }),
    isLoading ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4", children: [
      data.map((f) => /* @__PURE__ */ jsxs("div", { className: "group relative border border-hairline", children: [
        /* @__PURE__ */ jsx("div", { className: "aspect-square bg-surface-dim overflow-hidden", children: /* @__PURE__ */ jsx(MediaThumb, { name: f.name }) }),
        /* @__PURE__ */ jsx("p", { className: "p-2 text-[10px] text-ink-soft truncate", children: f.name }),
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => copy(f.name), className: "w-9 h-9 bg-white text-black rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Copy, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => remove(f.name), className: "w-9 h-9 bg-white text-destructive rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
        ] })
      ] }, f.name)),
      data.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft col-span-full", children: "No media uploaded yet." })
    ] })
  ] });
}
function MediaThumb({
  name
}) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    signedUrl(name).then(setUrl).catch(() => setUrl(null));
  }, [name]);
  if (!url) return /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-surface-dim animate-pulse" });
  if (isVideoUrl(name)) return /* @__PURE__ */ jsx("video", { src: url, className: "w-full h-full object-cover", muted: true, playsInline: true });
  return /* @__PURE__ */ jsx("img", { src: url, alt: name, className: "w-full h-full object-cover", loading: "lazy" });
}
export {
  MediaAdmin as component
};
