import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { s as supabase } from "./client-BhH2qhhP.js";
import { a as useCart, d as useSiteSettings, c as currency } from "./router-Bjx56gfo.js";
import { F as Footer } from "./Footer-D-hgnv3x.js";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import "@supabase/supabase-js";
import "@tanstack/react-query";
import "@tanstack/zod-adapter";
const schema = z.object({
  customer_name: z.string().trim().min(2).max(120),
  customer_email: z.string().trim().email().max(255),
  line1: z.string().trim().min(2).max(200),
  line2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(1).max(100),
  region: z.string().trim().min(1).max(100),
  postal: z.string().trim().min(2).max(20),
  country: z.string().trim().min(2).max(80),
  notes: z.string().trim().max(500).optional().or(z.literal(""))
});
function CheckoutPage() {
  const {
    items,
    subtotal,
    clear
  } = useCart();
  const {
    data: settings
  } = useSiteSettings();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    line1: "",
    line2: "",
    city: "",
    region: "",
    postal: "",
    country: "India",
    notes: ""
  });
  const threshold = settings?.shipping.free_shipping_threshold ?? 5e3;
  const standardRate = settings?.shipping.standard_rate ?? 250;
  const shipping = subtotal > 0 && subtotal < threshold ? standardRate : 0;
  const total = subtotal + shipping;
  useEffect(() => {
    supabase.auth.getSession().then(({
      data
    }) => {
      const s = data.session;
      if (!s) {
        navigate({
          to: "/auth",
          search: {
            mode: "signin",
            redirect: "/checkout"
          },
          replace: true
        });
        return;
      }
      setUserId(s.user.id);
      setForm((f) => ({
        ...f,
        customer_email: f.customer_email || s.user.email || "",
        customer_name: f.customer_name || s.user.user_metadata?.full_name || ""
      }));
    });
  }, []);
  const set = (k, v) => setForm((f) => ({
    ...f,
    [k]: v
  }));
  const submit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    if (items.length === 0) {
      toast.error("Your bag is empty.");
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    setBusy(true);
    const {
      line1,
      line2,
      city,
      region,
      postal,
      country,
      customer_name,
      customer_email,
      notes
    } = parsed.data;
    const shipping_address = {
      line1,
      line2: line2 || null,
      city,
      region,
      postal,
      country
    };
    const {
      data: order,
      error
    } = await supabase.from("orders").insert({
      user_id: userId,
      total,
      status: "pending",
      customer_name,
      customer_email,
      shipping_address,
      notes: notes || null
    }).select("id").single();
    if (error || !order) {
      setBusy(false);
      toast.error(error?.message ?? "Could not place order.");
      return;
    }
    const productIds = items.map((i) => i.productId).filter(Boolean);
    const slugMap = /* @__PURE__ */ new Map();
    if (productIds.length) {
      const {
        data: prows
      } = await supabase.from("products").select("id,slug").in("id", productIds);
      (prows ?? []).forEach((p) => slugMap.set(p.id, p.slug));
    }
    const {
      error: itemsErr
    } = await supabase.from("order_items").insert(items.map((i) => ({
      order_id: order.id,
      product_id: i.productId ?? null,
      name: `${i.name}${i.size ? ` (Size ${i.size})` : ""}`,
      price: i.price,
      quantity: i.quantity,
      image_url: i.image || null,
      product_slug: i.productId ? slugMap.get(i.productId) ?? null : null
    })));
    if (itemsErr) {
      setBusy(false);
      toast.error("Order placed but line items failed: " + itemsErr.message);
      return;
    }
    clear();
    toast.success("Order placed.");
    navigate({
      to: "/account",
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxs("main", { className: "pt-6 max-w-[1200px] mx-auto px-6 md:px-10 pb-24", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-0 mb-10 max-w-xs", children: ["Bag", "Details", "Confirm"].map((step, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0 flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 ${i <= 1 ? "text-ink" : "text-ink-soft"}`, children: [
          /* @__PURE__ */ jsx("span", { className: `w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-medium ${i <= 1 ? "bg-primary text-primary-foreground" : "border border-hairline"}`, children: i + 1 }),
          /* @__PURE__ */ jsx("span", { className: "text-[11px] tracking-[0.15em] uppercase hidden sm:block", children: step })
        ] }),
        i < 2 && /* @__PURE__ */ jsx("span", { className: "flex-1 h-px bg-hairline mx-2" })
      ] }, step)) }),
      /* @__PURE__ */ jsx("p", { className: "eyebrow mb-3", children: "Final Step" }),
      /* @__PURE__ */ jsx("h1", { className: "font-serif text-4xl md:text-5xl mb-10", children: "Checkout" }),
      items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "border border-hairline p-16 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-ink-soft mb-6", children: "Your bag is empty." }),
        /* @__PURE__ */ jsx(Link, { to: "/collections", className: "btn-primary inline-flex", children: "Browse Collections" })
      ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "grid lg:grid-cols-[1fr_380px] gap-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsx(Section, { title: "Contact", children: /* @__PURE__ */ jsxs(Grid, { children: [
            /* @__PURE__ */ jsx(Field, { label: "Full Name", children: /* @__PURE__ */ jsx("input", { required: true, value: form.customer_name, onChange: (e) => set("customer_name", e.target.value), className: inp }) }),
            /* @__PURE__ */ jsx(Field, { label: "Email", children: /* @__PURE__ */ jsx("input", { type: "email", required: true, value: form.customer_email, onChange: (e) => set("customer_email", e.target.value), className: inp }) })
          ] }) }),
          /* @__PURE__ */ jsx(Section, { title: "Shipping Address", children: /* @__PURE__ */ jsxs(Grid, { children: [
            /* @__PURE__ */ jsx(Field, { label: "Address Line 1", className: "col-span-2", children: /* @__PURE__ */ jsx("input", { required: true, value: form.line1, onChange: (e) => set("line1", e.target.value), className: inp }) }),
            /* @__PURE__ */ jsx(Field, { label: "Address Line 2", className: "col-span-2", children: /* @__PURE__ */ jsx("input", { value: form.line2, onChange: (e) => set("line2", e.target.value), className: inp }) }),
            /* @__PURE__ */ jsx(Field, { label: "City", children: /* @__PURE__ */ jsx("input", { required: true, value: form.city, onChange: (e) => set("city", e.target.value), className: inp }) }),
            /* @__PURE__ */ jsx(Field, { label: "State / Region", children: /* @__PURE__ */ jsx("input", { required: true, value: form.region, onChange: (e) => set("region", e.target.value), className: inp }) }),
            /* @__PURE__ */ jsx(Field, { label: "Postal Code", children: /* @__PURE__ */ jsx("input", { required: true, value: form.postal, onChange: (e) => set("postal", e.target.value), className: inp }) }),
            /* @__PURE__ */ jsx(Field, { label: "Country", children: /* @__PURE__ */ jsx("input", { required: true, value: form.country, onChange: (e) => set("country", e.target.value), className: inp }) })
          ] }) }),
          /* @__PURE__ */ jsx(Section, { title: "Order Notes (optional)", children: /* @__PURE__ */ jsx("textarea", { value: form.notes, onChange: (e) => set("notes", e.target.value), rows: 3, className: `${inp} h-auto py-3`, placeholder: "Gift wrapping, delivery preferences…" }) }),
          /* @__PURE__ */ jsx(Section, { title: "Payment", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-ink-soft", children: [
            "Payment integration is not yet enabled. Your order will be placed as ",
            /* @__PURE__ */ jsx("strong", { children: "pending" }),
            " and our concierge will follow up by email to arrange payment."
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("aside", { className: "border border-hairline p-7 h-fit lg:sticky lg:top-28 space-y-4", children: [
          /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "Order Summary" }),
          /* @__PURE__ */ jsx("ul", { className: "divide-y divide-hairline border-y border-hairline -mx-7 px-7", children: items.map((i) => /* @__PURE__ */ jsxs("li", { className: "py-3 flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxs("span", { className: "truncate pr-3", children: [
              i.name,
              " × ",
              i.quantity
            ] }),
            /* @__PURE__ */ jsx("span", { children: currency(i.price * i.quantity) })
          ] }, `${i.id}-${i.size ?? ""}`)) }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-ink-soft", children: "Subtotal" }),
            /* @__PURE__ */ jsx("span", { children: currency(subtotal) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-ink-soft", children: "Shipping" }),
            /* @__PURE__ */ jsx("span", { children: shipping === 0 ? "Complimentary" : currency(shipping) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-t border-hairline pt-4", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Total" }),
            /* @__PURE__ */ jsx("span", { className: "font-serif text-xl", children: currency(total) })
          ] }),
          /* @__PURE__ */ jsxs("button", { type: "submit", disabled: busy, className: "btn-primary w-full justify-center", children: [
            busy && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
            "Place Order"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const inp = "w-full h-12 border border-hairline bg-transparent px-4 text-sm focus:border-primary outline-none";
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxs("section", { children: [
    /* @__PURE__ */ jsx("p", { className: "eyebrow mb-4", children: title }),
    children
  ] });
}
function Grid({
  children
}) {
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4", children });
}
function Field({
  label,
  children,
  className = ""
}) {
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsx("label", { className: "eyebrow block mb-2", children: label }),
    children
  ] });
}
export {
  CheckoutPage as component
};
