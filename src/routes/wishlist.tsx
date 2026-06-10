import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";
import { currency } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist | AESTHETE" },
      { name: "description", content: "Your saved pieces." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { items, toggle } = useWishlist();
  const { add } = useCart();

  const moveToCart = (item: (typeof items)[number]) => {
    add({ id: item.id, productId: item.id, name: item.name, price: item.price, image: item.image, slug: item.slug });
    toggle(item);
    toast.success(`${item.name} moved to bag.`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-28 md:pt-32 pb-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <p className="eyebrow mb-3">Saved</p>
          <h1 className="font-serif text-4xl md:text-5xl mb-12">Your Wishlist</h1>

          {items.length === 0 ? (
            <div className="py-24 text-center">
              <Heart className="w-10 h-10 stroke-[1] mx-auto text-ink-soft mb-5" />
              <p className="text-ink-soft mb-6">Nothing saved yet — browse the collection and heart what you love.</p>
              <Link to="/collections" className="btn-primary inline-flex">Browse Collections</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
              {items.map((item) => (
                <div key={item.id} className="group">
                  <div className="relative aspect-[3/4] overflow-hidden bg-surface-dim rounded-sm">
                    <Link to="/product/$id" params={{ id: item.slug }}>
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
                        : <div className="w-full h-full" />
                      }
                    </Link>
                    <button
                      onClick={() => { toggle(item); toast.success(`${item.name} removed from wishlist.`); }}
                      aria-label="Remove from wishlist"
                      className="absolute top-3 right-3 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {item.category && <p className="mt-4 text-[10px] tracking-[0.2em] uppercase text-ink-soft">{item.category}</p>}
                  <p className="text-sm font-medium mt-1 truncate">{item.name}</p>
                  <p className="text-sm text-ink-soft mt-0.5">{currency(item.price)}</p>
                  <button
                    onClick={() => moveToCart(item)}
                    className="btn-ghost w-full justify-center mt-3 text-xs"
                  >
                    Move to Bag
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
