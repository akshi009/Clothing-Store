import { useRef, useState, useEffect } from "react";

type CardConfig = {
  x: string; y: string; rotate: number; scale: number; zIndex: number; delay: number;
};

// Positions spread across the full square container so even 2–3 images fill the space
const POSITIONS: CardConfig[] = [
  { x: "25%", y: "18%",  rotate: -7,  scale: 0.82, zIndex: 2, delay: 0 },
  { x: "68%", y: "12%",  rotate: 8,   scale: 0.76, zIndex: 1, delay: 0.12 },
  { x: "50%", y: "52%",  rotate: -4,  scale: 0.88, zIndex: 3, delay: 0.22 },
  { x: "20%", y: "68%",  rotate: 6,   scale: 0.72, zIndex: 2, delay: 0.08 },
  { x: "78%", y: "55%",  rotate: -10, scale: 0.78, zIndex: 2, delay: 0.3 },
  { x: "82%", y: "25%",  rotate: 12,  scale: 0.65, zIndex: 1, delay: 0.18 },
];

// Fewer-image layouts that fill the space well
const POSITIONS_2: CardConfig[] = [
  { x: "32%", y: "35%", rotate: -8,  scale: 0.9, zIndex: 2, delay: 0 },
  { x: "72%", y: "45%", rotate: 7,   scale: 0.85, zIndex: 3, delay: 0.15 },
];
const POSITIONS_3: CardConfig[] = [
  { x: "28%", y: "28%", rotate: -9,  scale: 0.85, zIndex: 2, delay: 0 },
  { x: "72%", y: "22%", rotate: 8,   scale: 0.78, zIndex: 1, delay: 0.12 },
  { x: "52%", y: "65%", rotate: -4,  scale: 0.9,  zIndex: 3, delay: 0.22 },
];
const POSITIONS_4: CardConfig[] = [
  { x: "25%", y: "22%", rotate: -8,  scale: 0.82, zIndex: 2, delay: 0 },
  { x: "72%", y: "15%", rotate: 7,   scale: 0.76, zIndex: 1, delay: 0.12 },
  { x: "30%", y: "65%", rotate: 5,   scale: 0.85, zIndex: 3, delay: 0.22 },
  { x: "75%", y: "60%", rotate: -6,  scale: 0.78, zIndex: 2, delay: 0.08 },
];
const POSITIONS_5: CardConfig[] = [
  { x: "22%", y: "20%", rotate: -7,  scale: 0.8,  zIndex: 2, delay: 0 },
  { x: "65%", y: "12%", rotate: 9,   scale: 0.74, zIndex: 1, delay: 0.1 },
  { x: "48%", y: "50%", rotate: -4,  scale: 0.88, zIndex: 3, delay: 0.2 },
  { x: "20%", y: "68%", rotate: 6,   scale: 0.72, zIndex: 2, delay: 0.08 },
  { x: "76%", y: "55%", rotate: -10, scale: 0.76, zIndex: 2, delay: 0.28 },
];

function getPositions(count: number): CardConfig[] {
  if (count <= 2) return POSITIONS_2.slice(0, count);
  if (count === 3) return POSITIONS_3;
  if (count === 4) return POSITIONS_4;
  if (count === 5) return POSITIONS_5;
  return POSITIONS;
}

export function FloatingHeroGallery({ images }: { images: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [focused, setFocused] = useState<number | null>(null);
  const [offsets, setOffsets] = useState<Record<number, { x: number; y: number }>>({});

  // Use refs so event listeners always see latest values (fixes stale closure drag bug)
  const draggingRef = useRef<number | null>(null);
  const dragStartRef = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null);
  const offsetsRef = useRef(offsets);
  offsetsRef.current = offsets;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
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
          [i]: { x: dragStartRef.current!.ox + dx, y: dragStartRef.current!.oy + dy },
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

  const startDrag = (i: number, e: React.MouseEvent) => {
    e.preventDefault();
    const cur = offsetsRef.current[i] ?? { x: 0, y: 0 };
    dragStartRef.current = { mx: e.clientX, my: e.clientY, ox: cur.x, oy: cur.y };
    draggingRef.current = i;
    setFocused(i);
  };

  const count = Math.min(images.length, 6);
  const positions = getPositions(count);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none"
      style={{ perspective: "1200px" }}
    >
      {images.slice(0, count).map((src, i) => {
        const cfg = positions[i];
        const off = offsets[i] ?? { x: 0, y: 0 };
        const isFocused = focused === i;
        const isDragging = draggingRef.current === i;

        const parallaxX = (mouse.x - 0.5) * cfg.zIndex * 14;
        const parallaxY = (mouse.y - 0.5) * cfg.zIndex * 10;

        return (
          <div
            key={i}
            onMouseDown={(e) => startDrag(i, e)}
            onMouseEnter={() => setFocused(i)}
            onMouseLeave={() => setFocused(null)}
            style={{
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
              animationDelay: `${cfg.delay}s`,
            }}
            className="animate-fade-up"
          >
            <div
              style={{
                width: `clamp(110px, ${count <= 3 ? "18vw" : "14vw"}, ${count <= 3 ? "240px" : "200px"})`,
                aspectRatio: "3/4",
                boxShadow: isFocused
                  ? "0 24px 60px rgba(0,0,0,0.35), 0 0 0 2px oklch(0.76 0.1 78)"
                  : "0 8px 32px rgba(0,0,0,0.18)",
                transition: "box-shadow 0.3s ease",
                overflow: "hidden",
                borderRadius: "3px",
              }}
            >
              <img
                src={src}
                alt={`Look ${i + 1}`}
                draggable={false}
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
            {isFocused && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ border: "1.5px solid oklch(0.76 0.1 78 / 0.6)", borderRadius: "3px" }}
              />
            )}
          </div>
        );
      })}

      <p className="absolute bottom-3 right-4 text-[10px] tracking-[0.15em] uppercase text-ink-soft/60 select-none pointer-events-none">
        drag to explore
      </p>
    </div>
  );
}
