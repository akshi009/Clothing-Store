import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  category?: string;
};

type WishlistCtx = {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  has: (id: string) => boolean;
  count: number;
};

const Ctx = createContext<WishlistCtx | null>(null);
const KEY = "aesthete-wishlist-v1";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const toggle = (item: WishlistItem) => {
    setItems((prev) =>
      prev.some((p) => p.id === item.id)
        ? prev.filter((p) => p.id !== item.id)
        : [...prev, item],
    );
  };

  const has = (id: string) => items.some((p) => p.id === id);
  const count = items.length;

  return <Ctx.Provider value={{ items, toggle, has, count }}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useWishlist must be used within WishlistProvider");
  return c;
}
