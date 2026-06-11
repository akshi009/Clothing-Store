import { Instagram, Twitter, Youtube, Facebook } from "lucide-react";
import { useSiteSettings, useNavItems } from "@/lib/storefront";

export function Footer() {
  const { data: settings } = useSiteSettings();
  const { data: nav = [] } = useNavItems("footer");
  const storeName = settings?.general.store_name ?? "AESTHETE";
  const tagline = settings?.general.tagline ?? "Hand-embroidered. Mirror-worked. Made for women who celebrate loudly.";
  const supportEmail = settings?.general.support_email;
  const social = settings?.social ?? {};
  const visitLocations = settings?.visit?.locations ?? ["Mumbai — Bandra Kurla", "Delhi — Lodhi Colony", "Bengaluru — Indiranagar"];

  const socialLinks = [
    { key: "instagram", Icon: Instagram, label: "Instagram" },
    { key: "youtube",   Icon: Youtube,   label: "YouTube" },
    { key: "facebook",  Icon: Facebook,  label: "Facebook" },
    { key: "twitter",   Icon: Twitter,   label: "X / Twitter" },
  ].filter(({ key }) => !!social[key]);

  return (
    <footer className="bg-surface-dim/40">
      <div className="gold-divider" />
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <p className="font-serif text-xl tracking-[0.18em] font-bold mb-4 uppercase">{storeName}</p>
          <p className="text-sm text-ink-soft leading-relaxed max-w-[220px]">{tagline}</p>
          {supportEmail && <p className="text-xs text-ink-soft mt-3">{supportEmail}</p>}
        </div>

        <div>
          <p className="eyebrow mb-5">Client Services</p>
          <ul className="space-y-3 text-sm">
            {nav.length > 0
              ? nav.map((item) => (
                  <li key={item.id}>
                    <a href={item.url} className="hover:opacity-60 transition">{item.label}</a>
                  </li>
                ))
              : [
                  { label: "Collections", href: "/collections" },
                  { label: "Size Guide", href: "/collections" },
                  { label: "Returns & Exchanges", href: "/account" },
                  { label: "Contact Us", href: "mailto:hello@aesthete.in" },
                  { label: "Order Tracking", href: "/account" },
                ].map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:opacity-60 transition">{link.label}</a>
                  </li>
                ))
            }
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-5">Visit</p>
          <ul className="space-y-3 text-sm text-ink-soft">
            {visitLocations.map((loc, i) => <li key={i}>{loc}</li>)}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-5">Social</p>
          {socialLinks.length > 0 ? (
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map(({ key, Icon, label }) => (
                <a
                  key={key}
                  href={social[key]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-hairline flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"
                >
                  <Icon className="w-4 h-4 stroke-[1.5]" />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-xs text-ink-soft">Add social links in Admin → Navigation.</p>
          )}
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-6 flex flex-wrap justify-between text-xs text-ink-soft tracking-wider">
          <span>© {new Date().getFullYear()} {storeName.toUpperCase()}. ALL RIGHTS RESERVED.</span>
        </div>
      </div>
    </footer>
  );
}
