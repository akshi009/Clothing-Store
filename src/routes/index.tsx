import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
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
      { title: "AESTHETE — Wear the Craft." },
      { name: "description", content: "Hand-embroidered festive wear rooted in Indian craft traditions. Mirror work, sequins, coin tassels — made for women who celebrate loudly." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: sections = [] } = useHomepageSections({ onlyVisible: true });

  return (
    <div className="min-h-screen bg-background text-foreground">

      <main>
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
      <section className="relative overflow-hidden bg-surface-dim/60">
        {/* Floating sparkles */}
        {[
          { top: "12%", left: "8%", delay: "0s", size: "text-lg" },
          { top: "70%", left: "5%", delay: "0.8s", size: "text-sm" },
          { top: "30%", left: "52%", delay: "1.4s", size: "text-xs" },
          { top: "80%", left: "60%", delay: "0.3s", size: "text-base" },
          { top: "18%", left: "78%", delay: "1.8s", size: "text-sm" },
          { top: "55%", left: "90%", delay: "0.6s", size: "text-lg" },
        ].map((s, i) => (
          <span
            key={i}
            className={`absolute pointer-events-none select-none animate-sparkle ${s.size}`}
            style={{ top: s.top, left: s.left, animationDelay: s.delay, color: "oklch(0.76 0.1 78)", opacity: 0.5 }}
          >✦</span>
        ))}
        {/* Decorative top border */}
        <div className="gold-divider" />
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-up">
            <p className="eyebrow mb-6">New Festive Edit</p>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight">
              Wear the<br />
              <span className="text-gold-shimmer">Craft.</span>
            </h1>
            <p className="mt-8 text-ink-soft max-w-md leading-relaxed text-base">
              Hand-embroidered. Mirror-worked. Sequin-kissed. Each piece is a celebration — made for women who don't do ordinary.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/collections" className="btn-primary">
                Shop the Edit <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/collections" search={{ category: "Tops" } as any} className="btn-ghost">
                View Tops
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] md:aspect-square bg-surface-dim rounded-sm overflow-hidden">
            <img src={heroJacket} alt="AESTHETE hero" className="absolute inset-0 w-full h-full object-cover" />
            {/* Gold corner accents */}
            <span className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold-400 opacity-70" style={{ borderColor: 'oklch(0.76 0.1 78)' }} />
            <span className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 opacity-70" style={{ borderColor: 'oklch(0.76 0.1 78)' }} />
          </div>
        </div>
        <div className="gold-divider" />
      </section>

      {/* Craft ticker strip */}
      <div className="overflow-hidden py-4 border-y border-hairline" style={{ background: "oklch(0.34 0.13 22)" }}>
        <div className="marquee-track flex items-center whitespace-nowrap">
          {[
            "Kutch Mirror Work", "Sequin Embroidery", "Rajasthani Craft",
            "Coin Tassel Tops", "Handmade in India", "Lucknowi Chikankari",
            "Festive Tops", "Boho Corsets", "Artisan Made",
            "Kutch Mirror Work", "Sequin Embroidery", "Rajasthani Craft",
            "Coin Tassel Tops", "Handmade in India", "Lucknowi Chikankari",
            "Festive Tops", "Boho Corsets", "Artisan Made",
          ].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-5 px-6 text-[11px] tracking-[0.22em] uppercase font-semibold text-white/80">
              {t}<span className="text-white/30 animate-sparkle" style={{ animationDelay: `${i * 0.1}s` }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Collections grid */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="mb-10">
          <p className="eyebrow mb-3">✦ Shop by Mood</p>
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
        <section className="bg-surface-dim/30">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-20 md:py-28">
            <div className="mb-1 flex items-end justify-between">
              <div>
                <p className="eyebrow mb-3">✦ Most Loved</p>
                <h2 className="font-serif text-4xl md:text-5xl">Statement Pieces</h2>
              </div>
              <Link to="/collections" className="btn-ghost hidden md:inline-flex">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((p) => (
                <Link key={p.id} to="/product/$id" params={{ id: p.slug }} className="group">
                  <div className="aspect-[3/4] overflow-hidden bg-surface-dim rounded-sm border border-hairline/50">
                    {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />}
                  </div>
                  <p className="mt-4 text-[10px] tracking-[0.2em] uppercase" style={{ color: 'oklch(0.76 0.1 78)' }}>{p.category}</p>
                  <p className="text-sm font-medium mt-1">{p.name}</p>
                  <p className="text-sm text-ink-soft mt-0.5">{currency(p.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Heritage / Brand story */}
      <section style={{ background: 'oklch(0.22 0.06 30)' }} className="text-white relative overflow-hidden">
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, oklch(0.76 0.1 78) 1px, transparent 1px), radial-gradient(circle at 80% 20%, oklch(0.76 0.1 78) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow mb-5 !text-[oklch(0.76_0.1_78)]">✦ Our Story</p>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.05]">
              Born in India.<br />Made to Celebrate.
            </h2>
            <p className="mt-8 text-white/70 leading-relaxed max-w-md text-base">
              AESTHETE is rooted in India's most vibrant craft traditions — Kutch embroidery, Rajasthani mirror work, Lucknowi sequin artistry. Every stitch is a love letter to the karigars who keep these crafts alive.
            </p>
            <div className="mt-2 gold-divider max-w-xs" />
          </div>
          <img src={heritage} alt="Heritage" className="w-full aspect-[4/3] object-cover rounded-sm" loading="lazy" />
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-surface-dim/60 relative">
        <div className="gold-divider absolute top-0 left-0 right-0" />
        <div className="max-w-2xl mx-auto px-6 py-20 md:py-28 text-center">
          <p className="eyebrow mb-4">✦ Stay in the Loop</p>
          <h2 className="font-serif text-4xl md:text-5xl">Drop Alerts. Early Access.</h2>
          <p className="text-ink-soft mt-4 text-base">New festive drops, exclusive previews, and behind-the-craft stories — straight to your inbox.</p>
          <form className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your Email Address" className="flex-1 px-5 py-4 bg-white border border-hairline text-sm focus:outline-none focus:border-primary" />
            <button className="btn-primary justify-center">Notify Me</button>
          </form>
        </div>
        <div className="gold-divider absolute bottom-0 left-0 right-0" />
      </section>
    </>
  );
}
