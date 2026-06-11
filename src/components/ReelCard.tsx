import { useRef, useEffect } from "react";

export type ReelItem = { url: string };

function getReelEmbedUrl(url: string): string | null {
  const match = url.match(/instagram\.com\/reel\/([A-Za-z0-9_-]+)/);
  if (!match) return null;
  return `https://www.instagram.com/reel/${match[1]}/embed/?autoplay=1&muted=1`;
}

function isDirectVideo(url: string) {
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url) || url.includes("supabase") || url.includes("storage");
}

/** Direct video card — true autoplay muted with IntersectionObserver */
function VideoReelCard({ url }: { url: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      className="relative shrink-0 rounded-xl overflow-hidden bg-black snap-start"
      style={{ width: "clamp(280px, 24vw, 340px)", aspectRatio: "9/16" }}
    >
      <video
        ref={ref}
        src={url}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

/** Instagram embed card */
function IgReelCard({ url }: { url: string }) {
  const embedUrl = getReelEmbedUrl(url);
  if (!embedUrl) return null;
  return (
    <div
      className="relative shrink-0 rounded-xl overflow-hidden bg-black snap-start"
      style={{ width: "clamp(280px, 24vw, 340px)", aspectRatio: "9/16" }}
    >
      <iframe
        src={embedUrl}
        className="w-full h-full border-0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; muted"
        loading="lazy"
        scrolling="no"
        title="Instagram Reel"
      />
    </div>
  );
}

export function ReelCard({ reel }: { reel: ReelItem }) {
  if (!reel.url) return null;
  if (isDirectVideo(reel.url)) return <VideoReelCard url={reel.url} />;
  if (reel.url.includes("instagram.com")) return <IgReelCard url={reel.url} />;
  return null;
}
