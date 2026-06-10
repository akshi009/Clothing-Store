import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useHomepageSections, useProducts, useCategories } from "@/lib/storefront";
import { HomepageBlock } from "@/components/HomepageBlocks";
import { currency } from "@/lib/format";
import heroJacket from "@/assets/hero-jacket.jpg";
import heritage from "@/assets/heritage.jpg";
import collectionAtelier from "@/assets/collection-atelier.jpg";
import collectionEvening from "@/assets/collection-evening.jpg";
import collectionBag from "@/assets/collection-bag.jpg";
import collectionCoat from "@/assets/collection-coat.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quietly extraordinary." },
      { name: "description", content: "Atelier-crafted pieces redefining quiet luxury." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: sections = [] } = useHomepageSections({ onlyVisible: true });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20">
        {sections.length === 0 ? <DefaultStorefront /> : sections.map((s) => <HomepageBlock key={s.id} section={s} />)}
      </main>
      <Footer />
    </div>
  );
}

function DefaultStorefront() {
  const { data: products = [] } = useProducts({ limit: 4 });
  const { data: categories = [] } = useCategories();

  const fallbackCategories = [
    { name: "Atelier", image_url: collectionAtelier },
    { name: "Evening", image_url: collectionEvening },
    { name: "Bags", image_url: collectionBag },
    { name: "Coats", image_url: collectionCoat },
  ];

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface-dim/40">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-up">
            <p className="eyebrow mb-6">New Season</p>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight">
              Quiet Luxury,<br />Redefined.
            </h1>
            <p className="mt-8 text-ink-soft max-w-md leading-relaxed">
              Atelier-crafted pieces built for those who let their presence speak. Impeccable construction, timeless restraint.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/collections" className="btn-primary">
                Explore Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] md:aspect-square bg-surface-dim rounded-sm overflow-hidden">
            <img src={heroJacket} alt="AESTHETE hero" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Collections grid */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="mb-10">
          <p className="eyebrow mb-3">Explore</p>
          <h2 className="font-serif text-4xl md:text-5xl">Collections</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayCategories.slice(0, 4).map((c) => (
            <Link
              key={c.name}
              to="/collections"
              search={{ category: c.name } as any}
              className="group relative aspect-square overflow-hidden bg-surface-dim rounded-sm"
            >
              {c.image_url && (
                <img src={c.image_url} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-end p-5">
                <p className="text-white font-serif text-xl">{c.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Products */}
      {products.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-3">Curated</p>
              <h2 className="font-serif text-4xl md:text-5xl">Featured Pieces</h2>
            </div>
            <Link to="/collections" className="btn-ghost hidden md:inline-flex">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <Link key={p.id} to="/product/$id" params={{ id: p.slug }} className="group">
                <div className="aspect-[3/4] overflow-hidden bg-surface-dim rounded-sm">
                  {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />}
                </div>
                <p className="mt-4 text-[10px] tracking-[0.2em] uppercase text-ink-soft">{p.category}</p>
                <p className="text-sm font-medium mt-1">{p.name}</p>
                <p className="text-sm text-ink-soft mt-0.5">{currency(p.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Heritage / Brand story */}
      <section className="bg-[#1a1a1a] text-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow mb-5 !text-white/50">Our Story</p>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.05]">
              Crafted with intention, worn with conviction.
            </h2>
            <p className="mt-8 text-white/70 leading-relaxed max-w-md">
              AESTHETE was born from a belief that true luxury is never loud. Each piece passes through the hands of master craftspeople across ateliers in Mumbai, Milano, and Paris — merging Indian heritage with contemporary restraint.
            </p>
          </div>
          <img src={heritage} alt="Heritage" className="w-full aspect-[4/3] object-cover rounded-sm grayscale" loading="lazy" />
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-surface-dim/50">
        <div className="max-w-2xl mx-auto px-6 py-20 md:py-28 text-center">
          <p className="eyebrow mb-4">Stay Close</p>
          <h2 className="font-serif text-4xl md:text-5xl">First Access. Always.</h2>
          <p className="text-ink-soft mt-4">New arrivals, private events, and atelier notes — delivered quietly to your inbox.</p>
          <form className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your Email Address" className="flex-1 px-5 py-4 bg-white border border-hairline rounded-sm text-sm focus:outline-none focus:border-primary" />
            <button className="btn-primary justify-center">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
}
