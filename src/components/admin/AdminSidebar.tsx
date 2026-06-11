import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, LogOut, Store,
  Image as ImageIcon, Menu as MenuIcon, FileText, Home, Star, RotateCcw, X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/homepage", label: "Homepage", icon: Home },
  { to: "/admin/pages", label: "Pages", icon: FileText },
  { to: "/admin/navigation", label: "Navigation", icon: MenuIcon },
  { to: "/admin/media", label: "Media", icon: ImageIcon },
  { to: "/admin/inventory", label: "Inventory", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/returns", label: "Returns", icon: RotateCcw },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function NavLinks({ path, onClose }: { path: string; onClose?: () => void }) {
  return (
    <>
      <nav className="flex-1 space-y-1">
        {items.map((it) => {
          const Icon = it.icon;
          const active = it.exact ? path === it.to : path.startsWith(it.to);
          return (
            <Link
              key={it.to}
              to={it.to as any}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 h-10 text-sm rounded-sm transition ${
                active ? "bg-primary text-primary-foreground" : "text-ink hover:bg-surface-dim"
              }`}
            >
              <Icon className="w-4 h-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 pt-6 border-t border-hairline space-y-1">
        <Link to="/" onClick={onClose} className="flex items-center gap-3 px-3 h-10 text-sm text-ink-soft hover:bg-surface-dim rounded-sm transition">
          <Store className="w-4 h-4" /> View Storefront
        </Link>
        <button
          onClick={async () => { await supabase.auth.signOut(); window.location.href = "/auth"; }}
          className="flex items-center gap-3 px-3 h-10 text-sm text-ink-soft hover:bg-surface-dim rounded-sm transition w-full"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </>
  );
}

export function AdminSidebar() {
  const { location } = useRouterState();
  const path = location.pathname;
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-hairline bg-surface-dim/40 min-h-screen p-6 sticky top-0 shrink-0">
        <Link to="/" className="font-serif text-2xl tracking-[0.18em] font-bold mb-1">AESTHETE</Link>
        <p className="eyebrow mb-10">Atelier Console</p>
        <NavLinks path={path} />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-background border-b border-hairline flex items-center justify-between px-4">
        <Link to="/" className="font-serif text-xl tracking-[0.18em] font-bold">AESTHETE</Link>
        <button onClick={() => setOpen(true)} className="p-2 -mr-2">
          <MenuIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-background border-r border-hairline flex flex-col p-6 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <Link to="/" className="font-serif text-2xl tracking-[0.18em] font-bold">AESTHETE</Link>
          <button onClick={() => setOpen(false)} className="p-1 -mr-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="eyebrow mb-8">Atelier Console</p>
        <NavLinks path={path} onClose={() => setOpen(false)} />
      </aside>
    </>
  );
}
