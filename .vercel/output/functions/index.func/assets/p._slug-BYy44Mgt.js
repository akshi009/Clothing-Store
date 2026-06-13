import { jsx, jsxs } from "react/jsx-runtime";
import { notFound } from "@tanstack/react-router";
import { F as Footer } from "./Footer-D-hgnv3x.js";
import { j as Route, k as useCmsPage } from "./router-Bjx56gfo.js";
import { Loader2 } from "lucide-react";
import "@tanstack/react-query";
import "react";
import "sonner";
import "./client-BhH2qhhP.js";
import "@supabase/supabase-js";
import "zod";
import "@tanstack/zod-adapter";
function PageView() {
  const {
    slug
  } = Route.useParams();
  const {
    data,
    isLoading
  } = useCmsPage(slug);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsx(Loader2, { className: "w-6 h-6 animate-spin text-ink-soft" }) });
  }
  if (!data) throw notFound();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxs("main", { className: "pt-6 max-w-3xl mx-auto px-6 md:px-10 pb-24", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-serif text-4xl md:text-5xl mb-8", children: data.title }),
      /* @__PURE__ */ jsx("article", { className: "prose prose-neutral max-w-none [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-ink-soft [&_p]:leading-relaxed [&_p]:mb-4 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1", dangerouslySetInnerHTML: {
        __html: data.content
      } })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  PageView as component
};
