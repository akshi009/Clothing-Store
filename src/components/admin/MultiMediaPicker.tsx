import { useRef, useState } from "react";
import { Plus, X, Loader2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { uploadMedia } from "@/lib/media";

type Props = {
  label?: string;
  values: string[];
  onChange: (urls: string[]) => void;
  max?: number;
};

export function MultiMediaPicker({ label = "Gallery Images", values, onChange, max = 10 }: Props) {
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const upload = async (files: FileList) => {
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
        }),
      );
      onChange([...values, ...uploaded]);
      toast.success(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded.`);
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    }
    setBusy(false);
  };

  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));

  const addUrl = () => {
    const url = prompt("Paste image URL:");
    if (url?.trim()) onChange([...values, url.trim()]);
  };

  return (
    <div>
      <label className="eyebrow block mb-3">{label}</label>
      <div className="flex flex-wrap gap-3 mb-3">
        {values.map((url, i) => (
          <div key={i} className="relative group w-24 h-24">
            <img src={url} alt="" className="w-24 h-24 object-cover border border-hairline" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-background border border-hairline rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1 rounded">
              {i === 0 ? "Cover" : `#${i + 1}`}
            </div>
          </div>
        ))}

        {values.length < max && (
          <button
            type="button"
            disabled={busy}
            onClick={() => ref.current?.click()}
            className="w-24 h-24 border border-dashed border-hairline flex flex-col items-center justify-center gap-1 text-[11px] text-ink-soft hover:bg-surface-dim transition"
          >
            {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            {busy ? "Uploading" : "Add"}
          </button>
        )}
      </div>

      <button type="button" onClick={addUrl} className="text-[11px] tracking-[0.15em] uppercase text-ink-soft hover:text-ink underline">
        + Paste URL instead
      </button>

      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) upload(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
