import { useState } from "react";
import { X } from "lucide-react";
import { useSiteSettings } from "@/lib/storefront";

const FALLBACK = [
  "✦ Free shipping on orders above ₹5,000",
  "🪞 New Kutch mirror-work tops just dropped",
  "✨ Use code FESTIVE10 for 10% off your first order",
  "🎉 Same-day dispatch on in-stock pieces",
  "💛 Handcrafted by Indian artisans — every stitch tells a story",
];

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const { data: settings } = useSiteSettings();
  const items = settings?.ticker?.items?.length ? settings.ticker.items : FALLBACK;

  if (dismissed) return null;

  return (
    <div
      className="relative z-[60] text-white overflow-hidden"
      style={{ background: "oklch(0.34 0.13 22)" }}
    >
      <div className="flex items-center h-9">
        <div className="flex-1 overflow-hidden">
          <div className="marquee-track flex items-center whitespace-nowrap">
            {[...items, ...items].map((o, i) => (
              <span key={i} className="inline-flex items-center gap-6 px-8 text-[11px] tracking-[0.16em] uppercase font-medium">
                {o}
                <span className="text-white/30">|</span>
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Close"
          className="shrink-0 px-3 h-full flex items-center hover:bg-white/10 transition"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
