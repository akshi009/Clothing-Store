import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, ChevronDown, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useProductBySlug, useProducts } from "@/lib/storefront";
import { useProductReviews } from "@/lib/orders";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { currency } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Product | AESTHETE` },
      { name: "description", content: `Discover ${params.id} at AESTHETE.` },
    ],
  }),
  component: ProductPage,
});

const sizes = ["XS", "S", "M", "L", "XL"];

function ProductPage() {
  const { id } = Route.useParams();
  const { data: product, isLoading } = useProductBySlug(id);
  const { data: all = [] } = useProducts();
  const { data: reviews = [] } = useProductReviews(product?.id ?? null);
  const { add } = useCart();
  const { toggle: wishlistToggle, has: inWishlist } = useWishlist();
  const [size, setSize] = useState<string>("M");
  const [activeImg, setActiveImg] = useState(0);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
  
        <div className="pt-6 text-center text-ink-soft">Loading…</div>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground">
  
        <div className="pt-6 text-center">
          <p className="text-ink-soft mb-4">Product not found.</p>
          <Link to="/collections" className="btn-primary inline-flex">Browse Collections</Link>
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    if (product.stock <= 0) { toast.error("Out of stock."); return; }
    add({
      id: `${product.id}`,
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image_url ?? "",
      size,
    });
    toast.success(`${product.name} added to bag.`);
  };

  const related = all.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground">

      <main className="pt-6 pb-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <p className="text-xs tracking-[0.2em] uppercase text-ink-soft mb-8">
            <Link to="/" className="hover:opacity-60">Home</Link> /{" "}
            <Link to="/collections" className="hover:opacity-60">Collections</Link> /{" "}
            <span>{product.name}</span>
          </p>

          <div className="grid lg:grid-cols-2 gap-10 md:gap-16">
            {/* Image gallery */}
            <div>
              {(() => {
                const allImgs = [
                  ...(product.image_url ? [product.image_url] : []),
                  ...product.images.filter((u) => u !== product.image_url),
                ];
                return (
                  <>
                    {/* Main image */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-surface-dim rounded-sm">
                      {allImgs.length > 0 ? (
                        <img
                          key={activeImg}
                          src={allImgs[activeImg]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-opacity duration-300"
                          width={768}
                          height={1024}
                        />
                      ) : <div className="w-full h-full" />}
                      {/* Prev / Next arrows */}
                      {allImgs.length > 1 && (
                        <>
                          <button
                            onClick={() => setActiveImg((p) => (p - 1 + allImgs.length) % allImgs.length)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 flex items-center justify-center hover:bg-background transition"
                          ><ChevronLeft className="w-4 h-4" /></button>
                          <button
                            onClick={() => setActiveImg((p) => (p + 1) % allImgs.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 flex items-center justify-center hover:bg-background transition"
                          ><ChevronRight className="w-4 h-4" /></button>
                          {/* Dot indicator */}
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {allImgs.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setActiveImg(i)}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeImg ? "bg-primary w-4" : "bg-white/60"}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    {/* Thumbnails */}
                    {allImgs.length > 1 && (
                      <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                        {allImgs.map((src, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImg(i)}
                            className={`shrink-0 w-16 h-20 overflow-hidden border-2 transition ${i === activeImg ? "border-primary" : "border-transparent hover:border-hairline"}`}
                          >
                            <img src={src} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            <div className="lg:sticky lg:top-28 self-start">
              <p className="eyebrow mb-4">{product.category}</p>
              <h1 className="font-serif text-4xl md:text-5xl leading-tight">{product.name}</h1>
              {reviews.length > 0 && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <div className="flex">{[1,2,3,4,5].map((n) => <Star key={n} className={`w-4 h-4 ${n <= Math.round(avg) ? "fill-current" : "text-ink-soft"}`} />)}</div>
                  <span className="text-ink-soft">{avg.toFixed(1)} · {reviews.length} review{reviews.length === 1 ? "" : "s"}</span>
                </div>
              )}
              <p className="font-serif text-2xl mt-4">{currency(product.price)}</p>
              <p className="mt-2 text-xs tracking-[0.2em] uppercase text-ink-soft">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
              <p className="mt-8 text-ink-soft leading-relaxed whitespace-pre-line">{product.description}</p>

              <div className="mt-8">
                <p className="eyebrow mb-3">Select Size</p>
                <div className="grid grid-cols-5 gap-2">
                  {sizes.map((s) => (
                    <button key={s} type="button" onClick={() => setSize(s)} className={`h-12 text-sm border ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-hairline"} hover:border-primary transition`}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button onClick={handleAdd} disabled={product.stock <= 0} className="btn-primary w-full justify-center disabled:opacity-50">
                  {product.stock > 0 ? "Add to Shopping Bag" : "Sold Out"}
                </button>
                <button
                  onClick={() => {
                    const wasInWishlist = inWishlist(product.id);
                    wishlistToggle({ id: product.id, name: product.name, price: Number(product.price), image: product.image_url ?? "", slug: product.slug, category: product.category ?? undefined });
                    toast.success(wasInWishlist ? `${product.name} removed from wishlist.` : `${product.name} saved to wishlist.`);
                  }}
                  className="btn-ghost w-full justify-center"
                >
                  <Heart className={`w-4 h-4 transition-all ${inWishlist(product.id) ? "fill-current" : ""}`} />
                  {inWishlist(product.id) ? "Saved" : "Wishlist"}
                </button>
              </div>

              {(product.composition_care || product.shipping_returns) && (
                <div className="mt-10 divide-y divide-hairline border-y border-hairline">
                  {[
                    { label: "Composition & Care", content: product.composition_care },
                    { label: "Shipping & Returns", content: product.shipping_returns },
                  ].map(({ label, content }) => content ? (
                    <details key={label} className="group">
                      <summary className="flex justify-between items-center py-5 cursor-pointer text-sm tracking-wide uppercase">
                        {label}
                        <ChevronDown className="w-4 h-4 group-open:rotate-180 transition" />
                      </summary>
                      <p className="text-sm text-ink-soft pb-5 leading-relaxed whitespace-pre-line">{content}</p>
                    </details>
                  ) : null)}
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="max-w-[1200px] mx-auto px-6 md:px-10 mt-20">
          <h2 className="font-serif text-3xl md:text-4xl mb-8">Customer Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-ink-soft text-sm">No reviews yet. Be the first to share your thoughts after your delivery.</p>
          ) : (
            <ul className="grid md:grid-cols-2 gap-5">
              {reviews.map((r: any) => (
                <li key={r.id} className="border border-hairline p-6 bg-card">
                  <div className="flex gap-1 mb-2">{[1,2,3,4,5].map((n) => <Star key={n} className={`w-4 h-4 ${n <= r.rating ? "fill-current" : "text-ink-soft"}`} />)}</div>
                  {r.title && <p className="font-medium mb-1">{r.title}</p>}
                  {r.body && <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-line">{r.body}</p>}
                  {Array.isArray(r.images) && r.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {r.images.map((u: string) => <img key={u} src={u} alt="" className="w-16 h-16 object-cover border border-hairline" />)}
                    </div>
                  )}
                  <p className="text-xs text-ink-soft mt-3">— {r.author_name || "Customer"}, {new Date(r.created_at).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {related.length > 0 && (
          <section className="max-w-[1440px] mx-auto px-6 md:px-10 mt-24 md:mt-32">
            <h2 className="font-serif text-3xl md:text-4xl mb-10">Complete the Look</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p) => (
                <Link key={p.id} to="/product/$id" params={{ id: p.slug }} className="group">
                  <div className="aspect-[3/4] overflow-hidden bg-surface-dim rounded-sm">
                    {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />}
                  </div>
                  <p className="mt-4 text-[10px] tracking-[0.2em] uppercase text-ink-soft">{p.category}</p>
                  <p className="text-sm font-medium mt-1 truncate">{p.name}</p>
                  <p className="text-sm text-ink-soft mt-0.5">{currency(p.price)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
