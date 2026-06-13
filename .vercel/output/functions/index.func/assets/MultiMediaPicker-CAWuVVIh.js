import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { X, Loader2, Upload, Plus } from "lucide-react";
import { toast } from "sonner";
import { i as isVideoUrl, u as uploadMedia } from "./media-DJIl8De8.js";
function MediaPicker({ value, onChange, label = "Image", accept = "image" }) {
  const [busy, setBusy] = useState(false);
  const ref = useRef(null);
  const acceptAttr = accept === "image" ? "image/*" : accept === "video" ? "video/*" : "image/*,video/*";
  const upload = async (file) => {
    setBusy(true);
    try {
      const { url } = await uploadMedia(file);
      onChange(url);
      toast.success("Uploaded.");
    } catch (e) {
      toast.error(e.message ?? "Upload failed");
    }
    setBusy(false);
  };
  const isVid = isVideoUrl(value);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "eyebrow block mb-2", children: label }),
    value ? /* @__PURE__ */ jsxs("div", { className: "relative inline-block", children: [
      isVid ? /* @__PURE__ */ jsx("video", { src: value, className: "w-40 h-40 object-cover border border-hairline bg-black", muted: true, playsInline: true }) : /* @__PURE__ */ jsx("img", { src: value, alt: "", className: "w-40 h-40 object-cover border border-hairline" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onChange(""),
          className: "absolute -top-2 -right-2 w-6 h-6 bg-background border border-hairline rounded-full flex items-center justify-center",
          children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
        }
      )
    ] }) : /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        disabled: busy,
        onClick: () => ref.current?.click(),
        className: "w-40 h-40 border border-dashed border-hairline flex flex-col items-center justify-center gap-2 text-xs text-ink-soft hover:bg-surface-dim transition",
        children: [
          busy ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsx(Upload, { className: "w-5 h-5" }),
          busy ? "Uploading..." : `Upload ${accept === "video" ? "video" : accept === "any" ? "media" : "image"}`
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(
      "input",
      {
        value: value ?? "",
        onChange: (e) => onChange(e.target.value),
        placeholder: "or paste URL",
        className: "w-full h-9 px-3 text-xs border border-hairline bg-transparent focus:border-primary outline-none"
      }
    ) }),
    /* @__PURE__ */ jsx(
      "input",
      {
        ref,
        type: "file",
        accept: acceptAttr,
        hidden: true,
        onChange: (e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }
      }
    )
  ] });
}
function MultiMediaPicker({ label = "Gallery Images", values, onChange, max = 10 }) {
  const [busy, setBusy] = useState(false);
  const ref = useRef(null);
  const upload = async (files) => {
    if (values.length + files.length > max) {
      toast.error(`Maximum ${max} images allowed.`);
      return;
    }
    setBusy(true);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map(async (f) => {
          const { url } = await uploadMedia(f);
          return url;
        })
      );
      onChange([...values, ...uploaded]);
      toast.success(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded.`);
    } catch (e) {
      toast.error(e.message ?? "Upload failed");
    }
    setBusy(false);
  };
  const remove = (i) => onChange(values.filter((_, idx) => idx !== i));
  const addUrl = () => {
    const url = prompt("Paste image URL:");
    if (url?.trim()) onChange([...values, url.trim()]);
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "eyebrow block mb-3", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 mb-3", children: [
      values.map((url, i) => /* @__PURE__ */ jsxs("div", { className: "relative group w-24 h-24", children: [
        /* @__PURE__ */ jsx("img", { src: url, alt: "", className: "w-24 h-24 object-cover border border-hairline" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => remove(i),
            className: "absolute -top-2 -right-2 w-6 h-6 bg-background border border-hairline rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition",
            children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1 rounded", children: i === 0 ? "Cover" : `#${i + 1}` })
      ] }, i)),
      values.length < max && /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          disabled: busy,
          onClick: () => ref.current?.click(),
          className: "w-24 h-24 border border-dashed border-hairline flex flex-col items-center justify-center gap-1 text-[11px] text-ink-soft hover:bg-surface-dim transition",
          children: [
            busy ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" }),
            busy ? "Uploading" : "Add"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("button", { type: "button", onClick: addUrl, className: "text-[11px] tracking-[0.15em] uppercase text-ink-soft hover:text-ink underline", children: "+ Paste URL instead" }),
    /* @__PURE__ */ jsx(
      "input",
      {
        ref,
        type: "file",
        accept: "image/*",
        multiple: true,
        hidden: true,
        onChange: (e) => {
          if (e.target.files?.length) upload(e.target.files);
          e.target.value = "";
        }
      }
    )
  ] });
}
export {
  MediaPicker as M,
  MultiMediaPicker as a
};
