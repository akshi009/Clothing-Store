import { jsxs, jsx } from "react/jsx-runtime";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { s as supabase } from "./client-BhH2qhhP.js";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { s as setCurrencyFormat } from "./router-Bjx56gfo.js";
import "@supabase/supabase-js";
import "@tanstack/react-router";
import "zod";
import "@tanstack/zod-adapter";
const CURRENCIES = [{
  code: "INR",
  locale: "en-IN",
  label: "Indian Rupee (₹)"
}, {
  code: "USD",
  locale: "en-US",
  label: "US Dollar ($)"
}, {
  code: "EUR",
  locale: "en-IE",
  label: "Euro (€)"
}, {
  code: "GBP",
  locale: "en-GB",
  label: "Pound Sterling (£)"
}, {
  code: "AED",
  locale: "en-AE",
  label: "UAE Dirham (د.إ)"
}];
function Settings() {
  const qc = useQueryClient();
  const {
    data
  } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const {
        data: data2
      } = await supabase.from("site_settings").select("*");
      const map = {};
      (data2 ?? []).forEach((r) => {
        map[r.key] = r.value;
      });
      return map;
    }
  });
  const [general, setGeneral] = useState({
    store_name: "AESTHETE",
    currency: "INR",
    locale: "en-IN",
    support_email: "",
    tagline: ""
  });
  const [shipping, setShipping] = useState({
    free_shipping_threshold: 5e3,
    standard_rate: 250,
    express_rate: 600
  });
  const [ticker, setTicker] = useState({
    items: []
  });
  const [tickerRaw, setTickerRaw] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (data?.general) setGeneral((g) => ({
      ...g,
      ...data.general
    }));
    if (data?.shipping) setShipping((s) => ({
      ...s,
      ...data.shipping
    }));
    if (data?.ticker) {
      setTicker((t) => ({
        ...t,
        ...data.ticker
      }));
      setTickerRaw((data.ticker.items ?? []).join("\n"));
    }
  }, [data]);
  const save = async () => {
    setBusy(true);
    const {
      error
    } = await supabase.from("site_settings").upsert([{
      key: "general",
      value: general,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }, {
      key: "shipping",
      value: shipping,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }, {
      key: "ticker",
      value: {
        items: tickerRaw.split("\n").map((s) => s.trim()).filter(Boolean)
      },
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }]);
    setBusy(false);
    if (error) return toast.error(error.message);
    setCurrencyFormat(general.currency, general.locale);
    toast.success("Settings saved.");
    qc.invalidateQueries({
      queryKey: ["site-settings"]
    });
    qc.invalidateQueries({
      queryKey: ["storefront-settings"]
    });
  };
  const inp = "w-full h-12 border border-hairline bg-transparent px-4 text-sm focus:border-primary outline-none";
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10 max-w-3xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Configuration" }),
      /* @__PURE__ */ jsx("h1", { className: "font-serif text-3xl md:text-4xl", children: "Settings" })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "border border-hairline bg-card p-6 md:p-8 mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-serif text-xl mb-6", children: "General" }),
      /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-5", children: [
        /* @__PURE__ */ jsx(Field, { label: "Store Name", children: /* @__PURE__ */ jsx("input", { value: general.store_name, onChange: (e) => setGeneral({
          ...general,
          store_name: e.target.value
        }), className: inp }) }),
        /* @__PURE__ */ jsx(Field, { label: "Currency", children: /* @__PURE__ */ jsx("select", { value: general.currency, onChange: (e) => {
          const c = CURRENCIES.find((x) => x.code === e.target.value);
          setGeneral({
            ...general,
            currency: e.target.value,
            locale: c?.locale ?? general.locale
          });
        }, className: inp, children: CURRENCIES.map((c) => /* @__PURE__ */ jsx("option", { value: c.code, children: c.label }, c.code)) }) }),
        /* @__PURE__ */ jsx(Field, { label: "Support Email", children: /* @__PURE__ */ jsx("input", { type: "email", value: general.support_email, onChange: (e) => setGeneral({
          ...general,
          support_email: e.target.value
        }), className: inp }) }),
        /* @__PURE__ */ jsx(Field, { label: "Locale", children: /* @__PURE__ */ jsx("input", { value: general.locale, onChange: (e) => setGeneral({
          ...general,
          locale: e.target.value
        }), className: inp, placeholder: "en-IN" }) }),
        /* @__PURE__ */ jsx(Field, { label: "Tagline", className: "sm:col-span-2", children: /* @__PURE__ */ jsx("input", { value: general.tagline, onChange: (e) => setGeneral({
          ...general,
          tagline: e.target.value
        }), className: inp }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "border border-hairline bg-card p-6 md:p-8 mb-8", children: [
      /* @__PURE__ */ jsxs("h2", { className: "font-serif text-xl mb-6", children: [
        "Shipping (",
        general.currency,
        ")"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-3 gap-5", children: [
        /* @__PURE__ */ jsx(Field, { label: "Free Shipping Over", children: /* @__PURE__ */ jsx("input", { type: "number", min: "0", value: shipping.free_shipping_threshold, onChange: (e) => setShipping({
          ...shipping,
          free_shipping_threshold: +e.target.value
        }), className: inp }) }),
        /* @__PURE__ */ jsx(Field, { label: "Standard Rate", children: /* @__PURE__ */ jsx("input", { type: "number", min: "0", value: shipping.standard_rate, onChange: (e) => setShipping({
          ...shipping,
          standard_rate: +e.target.value
        }), className: inp }) }),
        /* @__PURE__ */ jsx(Field, { label: "Express Rate", children: /* @__PURE__ */ jsx("input", { type: "number", min: "0", value: shipping.express_rate, onChange: (e) => setShipping({
          ...shipping,
          express_rate: +e.target.value
        }), className: inp }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "border border-hairline bg-card p-6 md:p-8 mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-serif text-xl mb-2", children: "Ticker Strip" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-soft mb-5", children: "One item per line. Shown in the scrolling announcement bar at the top of the site." }),
      /* @__PURE__ */ jsx("textarea", { rows: 6, className: "w-full border border-hairline bg-transparent px-4 py-3 text-sm focus:border-primary outline-none resize-y", placeholder: "Free shipping on orders above ₹5,000\nNew arrivals just dropped\nUse FESTIVE10 for 10% off", value: tickerRaw, onChange: (e) => setTickerRaw(e.target.value) }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-ink-soft mt-2", children: [
        ticker.items.length,
        " item",
        ticker.items.length !== 1 ? "s" : "",
        " in ticker"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("button", { onClick: save, disabled: busy, className: "btn-primary", children: [
      busy && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
      "Save Settings"
    ] })
  ] });
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
  Settings as component
};
