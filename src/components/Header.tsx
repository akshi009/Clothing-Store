import { Link } from "@tanstack/react-router";
import { Search, Heart, ShoppingBag, User, LogOut, LayoutDashboard, Package, Menu, X } from "lucide-react";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useSiteSettings, useNavItems } from "@/lib/storefront";
import { useState, useRef, useEffect } from "react";

export function Header() {
  const { user, signOut } = useAuth();
  const isAdmin = useIsAdmin(user?.id);
  const { count, setOpen: openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { data: settings } = useSiteSettings();
  const { data: nav = [] } = useNavItems("header");
  const storeName = settings?.general.store_name ?? "AESTHETE";
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const defaultNav = [
    { id: "collections", label: "Collections", url: "/collections", open_new_tab: false },
    { id: "wishlist", label: "Wishlist", url: "/wishlist", open_new_tab: false },
  ];
  const navItems = nav.length > 0 ? nav : defaultNav;

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 glass border-b border-hairline">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
          <Link to="/" onClick={() => setMobileOpen(false)} className="font-serif text-2xl md:text-3xl tracking-[0.18em] font-bold uppercase">{storeName}</Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <a key={item.id} href={item.url} target={item.open_new_tab ? "_blank" : undefined} rel={item.open_new_tab ? "noreferrer" : undefined} className="nav-link">
                {item.label}
              </a>
            ))}
            {isAdmin && <Link to="/admin" className="nav-link">Atelier</Link>}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4 md:gap-5 text-ink">
            <button aria-label="Search" className="hover:opacity-60 transition hidden md:block"><Search className="w-[18px] h-[18px] stroke-[1.5]" /></button>
            <Link to="/wishlist" aria-label="Wishlist" className="relative hover:opacity-60 transition">
              <Heart className="w-[18px] h-[18px] stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[9px] font-medium min-w-4 h-4 px-1 rounded-full flex items-center justify-center">{wishlistCount}</span>
              )}
            </Link>
            <button onClick={() => openCart(true)} aria-label="Bag" className="relative hover:opacity-60 transition">
              <ShoppingBag className="w-[18px] h-[18px] stroke-[1.5]" />
              {count > 0 && <span className="absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[9px] font-medium min-w-4 h-4 px-1 rounded-full flex items-center justify-center">{count}</span>}
            </button>

            {/* Account dropdown (desktop) */}
            <div className="relative hidden md:block" ref={accountRef}>
              {user ? (
                <>
                  <button onClick={() => setAccountOpen((o) => !o)} aria-label="Account" className="hover:opacity-60 transition">
                    <User className="w-[18px] h-[18px] stroke-[1.5]" />
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 top-full mt-3 w-56 bg-background border border-hairline shadow-lg py-2 text-sm">
                      <p className="px-4 py-2 text-xs text-ink-soft truncate border-b border-hairline">{user.email}</p>
                      <Link to="/account" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-surface-dim">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-surface-dim">
                          <LayoutDashboard className="w-4 h-4" /> Atelier Console
                        </Link>
                      )}
                      <button onClick={() => signOut()} className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-surface-dim">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/auth" search={{ mode: "signin", redirect: "/" }} aria-label="Sign in" className="hover:opacity-60 transition">
                  <User className="w-[18px] h-[18px] stroke-[1.5]" />
                </Link>
              )}
            </div>

            {/* Hamburger (mobile only) */}
            <button onClick={() => setMobileOpen((o) => !o)} aria-label="Menu" className="md:hidden hover:opacity-60 transition">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <nav className="absolute top-full left-0 right-0 bg-background border-b border-hairline flex flex-col divide-y divide-hairline">
            {navItems.map((item) => (
              <a key={item.id} href={item.url} onClick={() => setMobileOpen(false)} className="px-6 py-4 text-sm tracking-wide hover:bg-surface-dim">
                {item.label}
              </a>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-6 py-4 text-sm tracking-wide hover:bg-surface-dim">Atelier Console</Link>
            )}
            <div className="px-6 py-4">
              {user ? (
                <div className="space-y-3 text-sm">
                  <p className="text-xs text-ink-soft">{user.email}</p>
                  <Link to="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 hover:opacity-60">
                    <Package className="w-4 h-4" /> My Orders
                  </Link>
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="flex items-center gap-2 hover:opacity-60">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <Link to="/auth" search={{ mode: "signin", redirect: "/" }} onClick={() => setMobileOpen(false)} className="btn-primary inline-flex">Sign In</Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
