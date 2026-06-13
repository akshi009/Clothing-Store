import { jsxs, jsx } from "react/jsx-runtime";
import { useSearch, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { s as supabase } from "./client-BhH2qhhP.js";
import { createLovableAuth } from "@lovable.dev/cloud-auth-js";
import { F as Footer } from "./Footer-D-hgnv3x.js";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import "@supabase/supabase-js";
import "./router-Bjx56gfo.js";
import "@tanstack/react-query";
import "zod";
import "@tanstack/zod-adapter";
const lovableAuth = createLovableAuth();
const lovable = {
  auth: {
    signInWithOAuth: async (provider, opts) => {
      const result = await lovableAuth.signInWithOAuth(provider, {
        redirect_uri: opts?.redirect_uri,
        extraParams: {
          ...opts?.extraParams
        }
      });
      if (result.redirected) {
        return result;
      }
      if (result.error) {
        return result;
      }
      try {
        await supabase.auth.setSession(result.tokens);
      } catch (e) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
      return result;
    }
  }
};
function AuthPage() {
  const {
    mode,
    redirect
  } = useSearch({
    from: "/auth"
  });
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({
      data
    }) => {
      if (data.session) navigate({
        to: redirect,
        replace: true
      });
    });
  }, []);
  const handleEmail = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: name
            }
          }
        });
        if (error) throw error;
        toast.success("Account created. You're signed in.");
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast.success("Welcome back.");
      }
      navigate({
        to: redirect,
        replace: true
      });
    } catch (err) {
      toast.error(err.message ?? "Authentication failed.");
    } finally {
      setBusy(false);
    }
  };
  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin
    });
    if (result.error) {
      toast.error(result.error.message ?? "Google sign-in failed.");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({
      to: redirect,
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsx("main", { className: "pt-6 pb-20 min-h-screen flex items-center justify-center px-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow mb-3", children: "Members" }),
        /* @__PURE__ */ jsx("h1", { className: "font-serif text-3xl md:text-4xl", children: mode === "signup" ? "Join AESTHETE" : "Welcome Back" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft mt-3", children: mode === "signup" ? "Join the tribe. Track orders, save your favourites, and get early access to new drops." : "Welcome back — the new festive edit is waiting for you." })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: handleGoogle, disabled: busy, className: "btn-ghost w-full justify-center mb-5", type: "button", children: "Continue with Google" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 my-6", children: [
        /* @__PURE__ */ jsx("span", { className: "flex-1 h-px bg-hairline" }),
        /* @__PURE__ */ jsx("span", { className: "eyebrow", children: "or" }),
        /* @__PURE__ */ jsx("span", { className: "flex-1 h-px bg-hairline" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleEmail, className: "space-y-4", children: [
        mode === "signup" && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "eyebrow block mb-2", children: "Full Name" }),
          /* @__PURE__ */ jsx("input", { value: name, onChange: (e) => setName(e.target.value), required: true, className: "w-full h-12 border border-hairline bg-transparent px-4 text-sm focus:border-primary outline-none" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "eyebrow block mb-2", children: "Email" }),
          /* @__PURE__ */ jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "w-full h-12 border border-hairline bg-transparent px-4 text-sm focus:border-primary outline-none" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsx("label", { className: "eyebrow", children: "Password" }),
            mode === "signin" && /* @__PURE__ */ jsx("a", { href: "mailto:hello@aesthete.in?subject=Password Reset", className: "text-xs text-ink-soft hover:text-ink underline transition", children: "Forgot password?" })
          ] }),
          /* @__PURE__ */ jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: 6, className: "w-full h-12 border border-hairline bg-transparent px-4 text-sm focus:border-primary outline-none" }),
          mode === "signup" && /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-soft mt-1.5", children: "Minimum 6 characters." })
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "submit", disabled: busy, className: "btn-primary w-full justify-center", children: [
          busy && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
          mode === "signup" ? "Create Account" : "Sign In"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-center mt-8 text-sm text-ink-soft", children: [
        mode === "signup" ? "Already a member?" : "New to AESTHETE?",
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/auth", search: {
          mode: mode === "signup" ? "signin" : "signup",
          redirect
        }, className: "underline text-ink", children: mode === "signup" ? "Sign in" : "Create an account" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  AuthPage as component
};
