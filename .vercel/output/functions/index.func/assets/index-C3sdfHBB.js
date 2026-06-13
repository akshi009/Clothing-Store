import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import { F as Footer } from "./Footer-D-hgnv3x.js";
import { e as useCategories, b as useProducts, c as currency, f as useHomepageSections } from "./router-Bjx56gfo.js";
import { useRef, useState, useEffect } from "react";
import { d as useFeaturedReviews } from "./orders-Dp7z8102.js";
import { i as isVideoUrl } from "./media-DJIl8De8.js";
import "@tanstack/react-query";
import "sonner";
import "./client-BhH2qhhP.js";
import "@supabase/supabase-js";
import "zod";
import "@tanstack/zod-adapter";
const POSITIONS = [
  { x: "25%", y: "18%", rotate: -7, scale: 0.82, zIndex: 2, delay: 0 },
  { x: "68%", y: "12%", rotate: 8, scale: 0.76, zIndex: 1, delay: 0.12 },
  { x: "50%", y: "52%", rotate: -4, scale: 0.88, zIndex: 3, delay: 0.22 },
  { x: "20%", y: "68%", rotate: 6, scale: 0.72, zIndex: 2, delay: 0.08 },
  { x: "78%", y: "55%", rotate: -10, scale: 0.78, zIndex: 2, delay: 0.3 },
  { x: "82%", y: "25%", rotate: 12, scale: 0.65, zIndex: 1, delay: 0.18 }
];
const POSITIONS_2 = [
  { x: "32%", y: "35%", rotate: -8, scale: 0.9, zIndex: 2, delay: 0 },
  { x: "72%", y: "45%", rotate: 7, scale: 0.85, zIndex: 3, delay: 0.15 }
];
const POSITIONS_3 = [
  { x: "28%", y: "28%", rotate: -9, scale: 0.85, zIndex: 2, delay: 0 },
  { x: "72%", y: "22%", rotate: 8, scale: 0.78, zIndex: 1, delay: 0.12 },
  { x: "52%", y: "65%", rotate: -4, scale: 0.9, zIndex: 3, delay: 0.22 }
];
const POSITIONS_4 = [
  { x: "25%", y: "22%", rotate: -8, scale: 0.82, zIndex: 2, delay: 0 },
  { x: "72%", y: "15%", rotate: 7, scale: 0.76, zIndex: 1, delay: 0.12 },
  { x: "30%", y: "65%", rotate: 5, scale: 0.85, zIndex: 3, delay: 0.22 },
  { x: "75%", y: "60%", rotate: -6, scale: 0.78, zIndex: 2, delay: 0.08 }
];
const POSITIONS_5 = [
  { x: "22%", y: "20%", rotate: -7, scale: 0.8, zIndex: 2, delay: 0 },
  { x: "65%", y: "12%", rotate: 9, scale: 0.74, zIndex: 1, delay: 0.1 },
  { x: "48%", y: "50%", rotate: -4, scale: 0.88, zIndex: 3, delay: 0.2 },
  { x: "20%", y: "68%", rotate: 6, scale: 0.72, zIndex: 2, delay: 0.08 },
  { x: "76%", y: "55%", rotate: -10, scale: 0.76, zIndex: 2, delay: 0.28 }
];
function getPositions(count) {
  if (count <= 2) return POSITIONS_2.slice(0, count);
  if (count === 3) return POSITIONS_3;
  if (count === 4) return POSITIONS_4;
  if (count === 5) return POSITIONS_5;
  return POSITIONS;
}
function FloatingHeroGallery({ images }) {
  const containerRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [focused, setFocused] = useState(null);
  const [offsets, setOffsets] = useState({});
  const draggingRef = useRef(null);
  const dragStartRef = useRef(null);
  const offsetsRef = useRef(offsets);
  offsetsRef.current = offsets;
  useEffect(() => {
    const onMove = (e) => {
      const el = containerRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
      }
      if (draggingRef.current !== null && dragStartRef.current) {
        const dx = e.clientX - dragStartRef.current.mx;
        const dy = e.clientY - dragStartRef.current.my;
        const i = draggingRef.current;
        setOffsets((prev) => ({
          ...prev,
          [i]: { x: dragStartRef.current.ox + dx, y: dragStartRef.current.oy + dy }
        }));
      }
    };
    const onUp = () => {
      draggingRef.current = null;
      dragStartRef.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);
  const startDrag = (i, e) => {
    e.preventDefault();
    const cur = offsetsRef.current[i] ?? { x: 0, y: 0 };
    dragStartRef.current = { mx: e.clientX, my: e.clientY, ox: cur.x, oy: cur.y };
    draggingRef.current = i;
    setFocused(i);
  };
  const count = Math.min(images.length, 6);
  const positions = getPositions(count);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      className: "relative w-full h-full select-none",
      style: { perspective: "1200px" },
      children: [
        images.slice(0, count).map((src, i) => {
          const cfg = positions[i];
          const off = offsets[i] ?? { x: 0, y: 0 };
          const isFocused = focused === i;
          const isDragging = draggingRef.current === i;
          const parallaxX = (mouse.x - 0.5) * cfg.zIndex * 14;
          const parallaxY = (mouse.y - 0.5) * cfg.zIndex * 10;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              onMouseDown: (e) => startDrag(i, e),
              onMouseEnter: () => setFocused(i),
              onMouseLeave: () => setFocused(null),
              style: {
                position: "absolute",
                left: cfg.x,
                top: cfg.y,
                transform: `
                translate(-50%, -50%)
                translate(${off.x + parallaxX}px, ${off.y + parallaxY}px)
                rotate(${isFocused ? 0 : cfg.rotate}deg)
                scale(${isFocused ? cfg.scale * 1.12 : cfg.scale})
              `,
                zIndex: isDragging ? 20 : isFocused ? 10 : cfg.zIndex,
                transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
                cursor: isDragging ? "grabbing" : "grab",
                animationDelay: `${cfg.delay}s`
              },
              className: "animate-fade-up",
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: {
                      width: `clamp(110px, ${count <= 3 ? "18vw" : "14vw"}, ${count <= 3 ? "240px" : "200px"})`,
                      aspectRatio: "3/4",
                      boxShadow: isFocused ? "0 24px 60px rgba(0,0,0,0.35), 0 0 0 2px oklch(0.76 0.1 78)" : "0 8px 32px rgba(0,0,0,0.18)",
                      transition: "box-shadow 0.3s ease",
                      overflow: "hidden",
                      borderRadius: "3px"
                    },
                    children: /* @__PURE__ */ jsx(
                      "img",
                      {
                        src,
                        alt: `Look ${i + 1}`,
                        draggable: false,
                        className: "w-full h-full object-cover pointer-events-none"
                      }
                    )
                  }
                ),
                isFocused && /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute inset-0 pointer-events-none",
                    style: { border: "1.5px solid oklch(0.76 0.1 78 / 0.6)", borderRadius: "3px" }
                  }
                )
              ]
            },
            i
          );
        }),
        /* @__PURE__ */ jsx("p", { className: "absolute bottom-3 right-4 text-[10px] tracking-[0.15em] uppercase text-ink-soft/60 select-none pointer-events-none", children: "drag to explore" })
      ]
    }
  );
}
function getReelEmbedUrl(url) {
  const match = url.match(/instagram\.com\/reel\/([A-Za-z0-9_-]+)/);
  if (!match) return null;
  return `https://www.instagram.com/reel/${match[1]}/embed/?autoplay=1&muted=1`;
}
function isDirectVideo(url) {
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url) || url.includes("supabase") || url.includes("storage");
}
function VideoReelCard({ url }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {
        });
        else el.pause();
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "relative shrink-0 rounded-xl overflow-hidden bg-black snap-start",
      style: { width: "clamp(280px, 24vw, 340px)", aspectRatio: "9/16" },
      children: /* @__PURE__ */ jsx(
        "video",
        {
          ref,
          src: url,
          autoPlay: true,
          muted: true,
          loop: true,
          playsInline: true,
          preload: "metadata",
          className: "w-full h-full object-cover"
        }
      )
    }
  );
}
function IgReelCard({ url }) {
  const embedUrl = getReelEmbedUrl(url);
  if (!embedUrl) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "relative shrink-0 rounded-xl overflow-hidden bg-black snap-start",
      style: { width: "clamp(280px, 24vw, 340px)", aspectRatio: "9/16" },
      children: /* @__PURE__ */ jsx(
        "iframe",
        {
          src: embedUrl,
          className: "w-full h-full border-0",
          allowFullScreen: true,
          allow: "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; muted",
          loading: "lazy",
          scrolling: "no",
          title: "Instagram Reel"
        }
      )
    }
  );
}
function ReelCard({ reel }) {
  if (!reel.url) return null;
  if (isDirectVideo(reel.url)) return /* @__PURE__ */ jsx(VideoReelCard, { url: reel.url });
  if (reel.url.includes("instagram.com")) return /* @__PURE__ */ jsx(IgReelCard, { url: reel.url });
  return null;
}
function HomepageBlock({ section }) {
  switch (section.type) {
    case "hero":
      return /* @__PURE__ */ jsx(HeroBlock, { s: section });
    case "heritage":
      return /* @__PURE__ */ jsx(HeritageBlock, { s: section });
    case "featured_products":
      return /* @__PURE__ */ jsx(ProductsBlock, { s: section, featuredOnly: true });
    case "best_sellers":
      return /* @__PURE__ */ jsx(ProductsBlock, { s: section });
    case "categories":
      return /* @__PURE__ */ jsx(CategoriesBlock, { s: section });
    case "offer":
      return /* @__PURE__ */ jsx(OfferBlock, { s: section });
    case "testimonials":
      return /* @__PURE__ */ jsx(TestimonialsBlock, { s: section });
    case "video":
      return /* @__PURE__ */ jsx(VideoBlock, { s: section });
    case "newsletter":
      return /* @__PURE__ */ jsx(NewsletterBlock, { s: section });
    case "image_banner":
      return /* @__PURE__ */ jsx(ImageBannerBlock, { s: section });
    case "custom_html":
      return /* @__PURE__ */ jsx(CustomHtmlBlock, { s: section });
    case "reel_reviews":
      return /* @__PURE__ */ jsx(ReelReviewsBlock, { s: section });
    default:
      return null;
  }
}
function HeroBlock({ s }) {
  const isVideo = !!s.video_url;
  const galleryImages = Array.isArray(s.extra?.images) ? s.extra.images : [];
  const hasGallery = galleryImages.length >= 2;
  return /* @__PURE__ */ jsxs("section", { className: "relative bg-surface-dim/60", children: [
    /* @__PURE__ */ jsx("div", { className: "gold-divider" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-[1440px] mx-auto px-6 md:px-10 py-10 md:py-16 grid md:grid-cols-2 gap-10 items-center overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "animate-fade-up", children: [
        s.subtitle && /* @__PURE__ */ jsx("p", { className: "eyebrow mb-6", children: s.subtitle }),
        s.title && /* @__PURE__ */ jsx("h1", { className: "font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight", children: s.title }),
        s.body && /* @__PURE__ */ jsx("p", { className: "mt-8 text-ink-soft max-w-md leading-relaxed text-base", children: s.body }),
        s.cta_label && /* @__PURE__ */ jsx("div", { className: "mt-10 flex flex-wrap gap-3", children: /* @__PURE__ */ jsxs(Link, { to: s.cta_url || "/collections", className: "btn-primary", children: [
          s.cta_label,
          " ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
        ] }) })
      ] }),
      hasGallery ? (
        /* Floating interactive gallery */
        /* @__PURE__ */ jsx("div", { className: "relative aspect-square bg-surface-dim/40 rounded-sm overflow-hidden hidden md:block", children: /* @__PURE__ */ jsx(FloatingHeroGallery, { images: galleryImages }) })
      ) : (
        /* Single image / video fallback */
        /* @__PURE__ */ jsx("div", { className: "relative aspect-[4/5] md:aspect-square bg-surface-dim rounded-sm overflow-hidden", children: isVideo ? /* @__PURE__ */ jsx("video", { src: s.video_url, poster: s.image_url ?? void 0, autoPlay: true, muted: true, loop: true, playsInline: true, className: "absolute inset-0 w-full h-full object-cover" }) : s.image_url ? /* @__PURE__ */ jsx("img", { src: s.image_url, alt: s.title ?? "Hero", className: "absolute inset-0 w-full h-full object-cover" }) : null })
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "gold-divider" })
  ] });
}
function HeritageBlock({ s }) {
  return /* @__PURE__ */ jsx("section", { className: "bg-[#1a1a1a] text-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1440px] mx-auto px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      s.subtitle && /* @__PURE__ */ jsx("p", { className: "eyebrow mb-5 !text-white/50", children: s.subtitle }),
      s.title && /* @__PURE__ */ jsx("h2", { className: "font-serif text-4xl md:text-6xl leading-[1.05]", children: s.title }),
      s.body && /* @__PURE__ */ jsx("p", { className: "mt-8 text-white/70 leading-relaxed max-w-md", children: s.body })
    ] }),
    s.image_url && /* @__PURE__ */ jsx("img", { src: s.image_url, alt: s.title ?? "Heritage", className: "w-full aspect-[4/3] object-cover rounded-sm grayscale", loading: "lazy" })
  ] }) });
}
function ProductsBlock({ s, featuredOnly }) {
  const limit = Number(s.extra?.limit) || 4;
  const { data = [] } = useProducts({ featuredOnly, limit });
  return /* @__PURE__ */ jsxs("section", { className: "max-w-[1440px] mx-auto px-6 md:px-10 py-20 md:py-28", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
      s.subtitle && /* @__PURE__ */ jsx("p", { className: "eyebrow mb-3", children: s.subtitle }),
      s.title && /* @__PURE__ */ jsx("h2", { className: "font-serif text-4xl md:text-5xl", children: s.title })
    ] }),
    data.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-ink-soft text-sm", children: "No products yet." }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6", children: data.map((p) => /* @__PURE__ */ jsxs(Link, { to: "/product/$id", params: { id: p.slug }, className: "group", children: [
      /* @__PURE__ */ jsx("div", { className: "aspect-[3/4] overflow-hidden bg-surface-dim rounded-sm", children: p.image_url && /* @__PURE__ */ jsx("img", { src: p.image_url, alt: p.name, className: "w-full h-full object-cover group-hover:scale-105 transition duration-700", loading: "lazy" }) }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-[10px] tracking-[0.2em] uppercase text-ink-soft", children: p.category }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium mt-1", children: p.name }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft mt-0.5", children: currency(p.price) })
    ] }, p.id)) })
  ] });
}
function CategoriesBlock({ s }) {
  const { data = [] } = useCategories();
  return /* @__PURE__ */ jsxs("section", { className: "max-w-[1440px] mx-auto px-6 md:px-10 py-20 md:py-28", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
      s.subtitle && /* @__PURE__ */ jsx("p", { className: "eyebrow mb-3", children: s.subtitle }),
      s.title && /* @__PURE__ */ jsx("h2", { className: "font-serif text-4xl md:text-5xl", children: s.title })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: data.map((c) => /* @__PURE__ */ jsxs(Link, { to: "/collections", search: { category: c.name }, className: "group relative aspect-square overflow-hidden bg-surface-dim rounded-sm", children: [
      c.image_url && /* @__PURE__ */ jsx("img", { src: c.image_url, alt: c.name, className: "absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700", loading: "lazy" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/30 flex items-end p-5", children: /* @__PURE__ */ jsx("p", { className: "text-white font-serif text-xl", children: c.name }) })
    ] }, c.name)) })
  ] });
}
function OfferBlock({ s }) {
  return /* @__PURE__ */ jsx("section", { className: "relative overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1440px] mx-auto px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center bg-surface-dim/60 rounded-sm", children: [
    s.image_url && /* @__PURE__ */ jsx("img", { src: s.image_url, alt: s.title ?? "Offer", className: "w-full aspect-[4/3] object-cover rounded-sm", loading: "lazy" }),
    /* @__PURE__ */ jsxs("div", { children: [
      s.subtitle && /* @__PURE__ */ jsx("p", { className: "eyebrow mb-4", children: s.subtitle }),
      s.title && /* @__PURE__ */ jsx("h2", { className: "font-serif text-4xl md:text-5xl", children: s.title }),
      s.body && /* @__PURE__ */ jsx("p", { className: "mt-6 text-ink-soft max-w-md leading-relaxed", children: s.body }),
      s.cta_label && /* @__PURE__ */ jsxs(Link, { to: s.cta_url || "/collections", className: "btn-primary mt-8", children: [
        s.cta_label,
        " ",
        /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
      ] })
    ] })
  ] }) });
}
function TestimonialsBlock({ s }) {
  const manual = s.extra?.items ?? [];
  const { data: featured = [] } = useFeaturedReviews();
  const items = featured.length > 0 ? featured.map((r) => ({ name: r.author_name || "Customer", review: r.body || r.title || "", rating: r.rating, avatar: void 0 })) : manual;
  return /* @__PURE__ */ jsx("section", { className: "bg-surface-dim/40", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1440px] mx-auto px-6 md:px-10 py-20 md:py-28", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-12 text-center", children: [
      s.subtitle && /* @__PURE__ */ jsx("p", { className: "eyebrow mb-3", children: s.subtitle }),
      s.title && /* @__PURE__ */ jsx("h2", { className: "font-serif text-4xl md:text-5xl", children: s.title })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-6", children: [
      items.map((t, i) => /* @__PURE__ */ jsxs("div", { className: "bg-card border border-hairline p-6 rounded-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "flex gap-1 mb-4", children: Array.from({ length: t.rating ?? 5 }).map((_, k) => /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 fill-current" }, k)) }),
        /* @__PURE__ */ jsxs("p", { className: "text-ink leading-relaxed mb-6", children: [
          '"',
          t.review,
          '"'
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          t.avatar && /* @__PURE__ */ jsx("img", { src: t.avatar, alt: t.name, className: "w-10 h-10 rounded-full object-cover" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: t.name })
        ] })
      ] }, i)),
      items.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-ink-soft text-sm col-span-full text-center", children: "No reviews yet." })
    ] })
  ] }) });
}
function VideoBlock({ s }) {
  const src = s.video_url;
  return /* @__PURE__ */ jsx("section", { className: "relative", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1440px] mx-auto px-6 md:px-10 py-16", children: [
    (s.subtitle || s.title) && /* @__PURE__ */ jsxs("div", { className: "mb-8 text-center", children: [
      s.subtitle && /* @__PURE__ */ jsx("p", { className: "eyebrow mb-3", children: s.subtitle }),
      s.title && /* @__PURE__ */ jsx("h2", { className: "font-serif text-4xl md:text-5xl", children: s.title })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative w-full aspect-video bg-black overflow-hidden rounded-sm", children: src ? /* @__PURE__ */ jsx("video", { src, poster: s.image_url ?? void 0, controls: true, playsInline: true, className: "w-full h-full object-cover" }) : s.image_url ? /* @__PURE__ */ jsx("img", { src: s.image_url, alt: s.title ?? "Video", className: "w-full h-full object-cover" }) : null }),
    s.body && /* @__PURE__ */ jsx("p", { className: "text-ink-soft mt-6 text-center max-w-2xl mx-auto", children: s.body })
  ] }) });
}
function NewsletterBlock({ s }) {
  return /* @__PURE__ */ jsx("section", { className: "bg-surface-dim/50", children: /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto px-6 py-20 md:py-28 text-center", children: [
    s.subtitle && /* @__PURE__ */ jsx("p", { className: "eyebrow mb-4", children: s.subtitle }),
    s.title && /* @__PURE__ */ jsx("h2", { className: "font-serif text-4xl md:text-5xl", children: s.title }),
    s.body && /* @__PURE__ */ jsx("p", { className: "text-ink-soft mt-4", children: s.body }),
    /* @__PURE__ */ jsxs("form", { className: "mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto", onSubmit: (e) => e.preventDefault(), children: [
      /* @__PURE__ */ jsx("input", { type: "email", placeholder: "Your Email Address", className: "flex-1 px-5 py-4 bg-white border border-hairline rounded-sm text-sm focus:outline-none focus:border-primary" }),
      /* @__PURE__ */ jsx("button", { className: "btn-primary justify-center", children: s.cta_label || "Subscribe" })
    ] })
  ] }) });
}
function ImageBannerBlock({ s }) {
  const isVideo = isVideoUrl(s.image_url);
  return /* @__PURE__ */ jsxs("section", { className: "relative h-[60vh] min-h-[400px] overflow-hidden", children: [
    s.image_url && !isVideo && /* @__PURE__ */ jsx("img", { src: s.image_url, alt: s.title ?? "Banner", className: "absolute inset-0 w-full h-full object-cover" }),
    isVideo && /* @__PURE__ */ jsx("video", { src: s.image_url, autoPlay: true, muted: true, loop: true, playsInline: true, className: "absolute inset-0 w-full h-full object-cover" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40 flex items-center justify-center text-center text-white px-6", children: /* @__PURE__ */ jsxs("div", { children: [
      s.subtitle && /* @__PURE__ */ jsx("p", { className: "eyebrow mb-4 !text-white/70", children: s.subtitle }),
      s.title && /* @__PURE__ */ jsx("h2", { className: "font-serif text-4xl md:text-6xl", children: s.title }),
      s.cta_label && /* @__PURE__ */ jsxs(Link, { to: s.cta_url || "/collections", className: "btn-primary mt-8 inline-flex", children: [
        s.cta_label,
        " ",
        /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
      ] })
    ] }) })
  ] });
}
function ReelReviewsBlock({ s }) {
  const reels = Array.isArray(s.extra?.reels) ? s.extra.reels : [];
  if (reels.length === 0) return null;
  return /* @__PURE__ */ jsxs("section", { className: "pb-10 md:pb-24 overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-[1440px] mx-auto px-6 md:px-10 mb-8", children: [
      s.subtitle && /* @__PURE__ */ jsx("p", { className: "eyebrow mb-3", children: s.subtitle }),
      s.title && /* @__PURE__ */ jsx("h2", { className: "font-serif text-4xl md:text-5xl", children: s.title })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-5 overflow-x-auto px-6 md:px-10 pb-4 snap-x snap-mandatory scrollbar-hide", children: reels.map((reel, i) => /* @__PURE__ */ jsx(ReelCard, { reel }, i)) })
  ] });
}
function CustomHtmlBlock({ s }) {
  return /* @__PURE__ */ jsxs("section", { className: "max-w-[1440px] mx-auto px-6 md:px-10 py-16", children: [
    s.title && /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl md:text-4xl mb-6", children: s.title }),
    s.body && /* @__PURE__ */ jsx("div", { className: "prose max-w-none", dangerouslySetInnerHTML: { __html: s.body } })
  ] });
}
const heroJacket = "/assets/hero-jacket-NfnUgxjA.jpg";
const heritage = "/assets/heritage-CVwUXq3X.jpg";
const collectionAtelier = "/assets/collection-atelier-xdjQfmVM.jpg";
const collectionEvening = "/assets/collection-evening-BlgAkGVk.jpg";
const collectionBag = "/assets/collection-bag-DyEv-aDx.jpg";
const collectionCoat = "/assets/collection-coat-m34WA71z.jpg";
function Home() {
  const {
    data: sections = []
  } = useHomepageSections();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsx("main", { children: sections.length === 0 ? /* @__PURE__ */ jsx(DefaultStorefront, {}) : sections.map((s) => /* @__PURE__ */ jsx(HomepageBlock, { section: s }, s.id)) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function DefaultStorefront() {
  const {
    data: products = []
  } = useProducts({
    limit: 4
  });
  const {
    data: categories = []
  } = useCategories();
  const fallbackCategories = [{
    name: "Atelier",
    image_url: collectionAtelier
  }, {
    name: "Evening",
    image_url: collectionEvening
  }, {
    name: "Bags",
    image_url: collectionBag
  }, {
    name: "Coats",
    image_url: collectionCoat
  }];
  const displayCategories = categories.length > 0 ? categories : fallbackCategories;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-surface-dim/60", children: [
      [{
        top: "12%",
        left: "8%",
        delay: "0s",
        size: "text-lg"
      }, {
        top: "70%",
        left: "5%",
        delay: "0.8s",
        size: "text-sm"
      }, {
        top: "30%",
        left: "52%",
        delay: "1.4s",
        size: "text-xs"
      }, {
        top: "80%",
        left: "60%",
        delay: "0.3s",
        size: "text-base"
      }, {
        top: "18%",
        left: "78%",
        delay: "1.8s",
        size: "text-sm"
      }, {
        top: "55%",
        left: "90%",
        delay: "0.6s",
        size: "text-lg"
      }].map((s, i) => /* @__PURE__ */ jsx("span", { className: `absolute pointer-events-none select-none animate-sparkle ${s.size}`, style: {
        top: s.top,
        left: s.left,
        animationDelay: s.delay,
        color: "oklch(0.76 0.1 78)",
        opacity: 0.5
      }, children: "✦" }, i)),
      /* @__PURE__ */ jsx("div", { className: "gold-divider" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-[1440px] mx-auto px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "animate-fade-up", children: [
          /* @__PURE__ */ jsx("p", { className: "eyebrow mb-6", children: "New Festive Edit" }),
          /* @__PURE__ */ jsxs("h1", { className: "font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight", children: [
            "Wear the",
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("span", { className: "text-gold-shimmer", children: "Craft." })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-8 text-ink-soft max-w-md leading-relaxed text-base", children: "Hand-embroidered. Mirror-worked. Sequin-kissed. Each piece is a celebration — made for women who don't do ordinary." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxs(Link, { to: "/collections", className: "btn-primary", children: [
              "Shop the Edit ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
            ] }),
            /* @__PURE__ */ jsx(Link, { to: "/collections", search: {
              category: "Tops"
            }, className: "btn-ghost", children: "View Tops" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative aspect-[4/5] md:aspect-square bg-surface-dim rounded-sm overflow-hidden", children: [
          /* @__PURE__ */ jsx("img", { src: heroJacket, alt: "AESTHETE hero", className: "absolute inset-0 w-full h-full object-cover" }),
          /* @__PURE__ */ jsx("span", { className: "absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold-400 opacity-70", style: {
            borderColor: "oklch(0.76 0.1 78)"
          } }),
          /* @__PURE__ */ jsx("span", { className: "absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 opacity-70", style: {
            borderColor: "oklch(0.76 0.1 78)"
          } })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "gold-divider" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-hidden py-4 border-y border-hairline", style: {
      background: "oklch(0.34 0.13 22)"
    }, children: /* @__PURE__ */ jsx("div", { className: "marquee-track flex items-center whitespace-nowrap", children: ["Kutch Mirror Work", "Sequin Embroidery", "Rajasthani Craft", "Coin Tassel Tops", "Handmade in India", "Lucknowi Chikankari", "Festive Tops", "Boho Corsets", "Artisan Made", "Kutch Mirror Work", "Sequin Embroidery", "Rajasthani Craft", "Coin Tassel Tops", "Handmade in India", "Lucknowi Chikankari", "Festive Tops", "Boho Corsets", "Artisan Made"].map((t, i) => /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-5 px-6 text-[11px] tracking-[0.22em] uppercase font-semibold text-white/80", children: [
      t,
      /* @__PURE__ */ jsx("span", { className: "text-white/30 animate-sparkle", style: {
        animationDelay: `${i * 0.1}s`
      }, children: "✦" })
    ] }, i)) }) }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-[1440px] mx-auto px-6 md:px-10 py-20 md:py-28", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-3", children: "✦ Shop by Mood" }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-4xl md:text-5xl", children: "Collections" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: displayCategories.slice(0, 4).map((c) => /* @__PURE__ */ jsxs(Link, { to: "/collections", search: {
        category: c.name
      }, className: "group relative aspect-square overflow-hidden bg-surface-dim rounded-sm", children: [
        c.image_url && /* @__PURE__ */ jsx("img", { src: c.image_url, alt: c.name, className: "absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700", loading: "lazy" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/30 flex items-end p-5", children: /* @__PURE__ */ jsx("p", { className: "text-white font-serif text-xl", children: c.name }) })
      ] }, c.name)) })
    ] }),
    products.length > 0 && /* @__PURE__ */ jsx("section", { className: "bg-surface-dim/30", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1440px] mx-auto px-6 md:px-10 py-20 md:py-28", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-1 flex items-end justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "eyebrow mb-3", children: "✦ Most Loved" }),
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-4xl md:text-5xl", children: "Statement Pieces" })
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/collections", className: "btn-ghost hidden md:inline-flex", children: [
          "View All ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6", children: products.map((p) => /* @__PURE__ */ jsxs(Link, { to: "/product/$id", params: {
        id: p.slug
      }, className: "group", children: [
        /* @__PURE__ */ jsx("div", { className: "aspect-[3/4] overflow-hidden bg-surface-dim rounded-sm border border-hairline/50", children: p.image_url && /* @__PURE__ */ jsx("img", { src: p.image_url, alt: p.name, className: "w-full h-full object-cover group-hover:scale-105 transition duration-700", loading: "lazy" }) }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-[10px] tracking-[0.2em] uppercase", style: {
          color: "oklch(0.76 0.1 78)"
        }, children: p.category }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium mt-1", children: p.name }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft mt-0.5", children: currency(p.price) })
      ] }, p.id)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { style: {
      background: "oklch(0.22 0.06 30)"
    }, className: "text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-5", style: {
        backgroundImage: "radial-gradient(circle at 20% 50%, oklch(0.76 0.1 78) 1px, transparent 1px), radial-gradient(circle at 80% 20%, oklch(0.76 0.1 78) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      } }),
      /* @__PURE__ */ jsxs("div", { className: "relative max-w-[1440px] mx-auto px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "eyebrow mb-5 !text-[oklch(0.76_0.1_78)]", children: "✦ Our Story" }),
          /* @__PURE__ */ jsxs("h2", { className: "font-serif text-4xl md:text-6xl leading-[1.05]", children: [
            "Born in India.",
            /* @__PURE__ */ jsx("br", {}),
            "Made to Celebrate."
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-8 text-white/70 leading-relaxed max-w-md text-base", children: "AESTHETE is rooted in India's most vibrant craft traditions — Kutch embroidery, Rajasthani mirror work, Lucknowi sequin artistry. Every stitch is a love letter to the karigars who keep these crafts alive." }),
          /* @__PURE__ */ jsx("div", { className: "mt-2 gold-divider max-w-xs" })
        ] }),
        /* @__PURE__ */ jsx("img", { src: heritage, alt: "Heritage", className: "w-full aspect-[4/3] object-cover rounded-sm", loading: "lazy" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "bg-surface-dim/60 relative", children: [
      /* @__PURE__ */ jsx("div", { className: "gold-divider absolute top-0 left-0 right-0" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto px-6 py-20 md:py-28 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-4", children: "✦ Stay in the Loop" }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-4xl md:text-5xl", children: "Drop Alerts. Early Access." }),
        /* @__PURE__ */ jsx("p", { className: "text-ink-soft mt-4 text-base", children: "New festive drops, exclusive previews, and behind-the-craft stories — straight to your inbox." }),
        /* @__PURE__ */ jsxs("form", { className: "mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto", onSubmit: (e) => e.preventDefault(), children: [
          /* @__PURE__ */ jsx("input", { type: "email", placeholder: "Your Email Address", className: "flex-1 px-5 py-4 bg-white border border-hairline text-sm focus:outline-none focus:border-primary" }),
          /* @__PURE__ */ jsx("button", { className: "btn-primary justify-center", children: "Notify Me" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "gold-divider absolute bottom-0 left-0 right-0" })
    ] })
  ] });
}
export {
  Home as component
};
