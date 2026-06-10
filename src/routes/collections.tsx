import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, Heart, SlidersHorizontal, X } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useProducts } from "@/lib/storefront";
import { useWishlist } from "@/lib/wishlist";
import { currency } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — The Curated Edit | AESTHETE" },
      { name: "description", content: "Browse the curated edit of AESTHETE: tailored coats, silk dresses, knitwear, and accessories." },
      { property: "og:title", content: "The Curated Edit | AESTHETE" },
    ],
  }),
  component: Collections,
});

function Collections() {
  const { data: products = [], isLoading } = useProducts();
  const { toggle: wishlistToggle, has: inWishlist } = useWishlist();
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "newest">("featured");
  const [filterOpen, setFilterOpen] = useState(false);

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((p) => p.category)))], [products]);

  const filtered = useMemo(() => {
    let list = category === "All" ? products : products.filter((p) => p.category === category);
    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sort === "price-desc") list.sort((a, b) => Number(b.price) - Number(a.price));
    else if (sort === "newest") list.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    else list.sort((a, b) => Number(b.featured) - Number(a.featured));
    return list;
  }, [products, category, sort]);

  const FilterSidebar = () => (
    <div className="space-y-10">
      <div>
        <p className="eyebrow mb-4">Category</p>
        <ul className="space-y-3">
          {categories.map((c) => (
            <li key={c}>
              <button onClick={() => { setCategory(c); setFilterOpen(false); }} className="flex items-center gap-3 text-sm cursor-pointer group w-full text-left">
                <span className={`w-4 h-4 border ${category === c ? "bg-primary border-primary" : "border-hairline"} flex items-center justify-center`}>
                  {category === c && <span className="text-primary-foreground text-[9px]">✓</span>}
                </span>
                {c}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={() => { setCategory("All"); setSort("featured"); setFilterOpen(false); }} className="w-full py-3 border border-hairline text-[11px] tracking-[0.2em] uppercase hover:bg-primary hover:text-primary-foreground transition">Clear All</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">

      <main className="pt-6 max-w-[1440px] mx-auto px-6 md:px-10 pb-20">
        <p className="text-xs tracking-[0.2em] uppercase text-ink-soft mb-4">
          <Link to="/" className="hover:opacity-60">Home</Link> / Collections
        </p>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10 md:mb-16">
          <h1 className="font-serif text-5xl md:text-6xl">The Festive Edit</h1>
          <div className="flex items-center gap-4 md:gap-6 text-sm">
            <span className="text-[11px] tracking-[0.2em] uppercase text-ink-soft">{filtered.length} Items</span>
            {/* Mobile filter toggle */}
            <button onClick={() => setFilterOpen(true)} className="md:hidden flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase border border-hairline px-3 h-9">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
            </button>
            <span className="hidden md:block h-4 w-px bg-hairline" />
            <div className="relative">
              <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="appearance-none bg-transparent pr-6 text-[11px] tracking-[0.2em] uppercase cursor-pointer focus:outline-none">
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Mobile filter drawer */}
        {filterOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-background p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <p className="eyebrow">Filters</p>
                <button onClick={() => setFilterOpen(false)} className="p-1 hover:bg-surface-dim"><X className="w-4 h-4" /></button>
              </div>
              <FilterSidebar />
            </aside>
          </div>
        )}

        <div className="grid md:grid-cols-[220px_1fr] gap-10 md:gap-14">
          {/* Desktop sidebar */}
          <aside className="hidden md:block">
            <FilterSidebar />
          </aside>

          <div>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-surface-dim rounded-sm" />
                    <div className="h-2 bg-surface-dim rounded mt-4 w-1/3" />
                    <div className="h-3 bg-surface-dim rounded mt-2 w-2/3" />
                    <div className="h-3 bg-surface-dim rounded mt-1 w-1/4" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center border border-hairline">
                <p className="text-ink-soft mb-4">No products match your filters.</p>
                <button onClick={() => { setCategory("All"); setSort("featured"); }} className="btn-ghost inline-flex">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                {filtered.map((p) => (
                  <div key={p.id} className="group relative">
                    <Link to="/product/$id" params={{ id: p.slug }}>
                      <div className="aspect-[3/4] overflow-hidden bg-surface-dim rounded-sm">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" width={768} height={1024} />
                        ) : <div className="w-full h-full" />}
                      </div>
                    </Link>
                    {/* Wishlist heart on card */}
                    <button
                      onClick={() => {
                        const wasIn = inWishlist(p.id);
                        wishlistToggle({ id: p.id, name: p.name, price: Number(p.price), image: p.image_url ?? "", slug: p.slug, category: p.category ?? undefined });
                        toast.success(wasIn ? `${p.name} removed from wishlist.` : `${p.name} saved.`);
                      }}
                      aria-label={inWishlist(p.id) ? "Remove from wishlist" : "Save to wishlist"}
                      className="absolute top-3 right-3 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-background"
                    >
                      <Heart className={`w-3.5 h-3.5 ${inWishlist(p.id) ? "fill-current" : ""}`} />
                    </button>
                    <Link to="/product/$id" params={{ id: p.slug }}>
                      <p className="mt-4 text-[10px] tracking-[0.2em] uppercase text-ink-soft">{p.category}</p>
                      <p className="text-sm font-medium mt-1 truncate">{p.name}</p>
                      <p className="text-sm text-ink-soft mt-0.5">{currency(p.price)}</p>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
