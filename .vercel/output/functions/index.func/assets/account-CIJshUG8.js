import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { s as supabase } from "./client-BhH2qhhP.js";
import { F as Footer } from "./Footer-D-hgnv3x.js";
import { Star, Upload, X, Loader2, Package, Truck, CheckCircle2, RotateCcw } from "lucide-react";
import { c as currency } from "./router-Bjx56gfo.js";
import { u as useMyOrders, a as useMyReturns, R as RETURN_STATUS_LABEL, b as useOrderEvents, S as STATUS_LABEL, c as STATUS_STYLE } from "./orders-Dp7z8102.js";
import { u as uploadMedia } from "./media-DJIl8De8.js";
import { toast } from "sonner";
import "@supabase/supabase-js";
import "@tanstack/react-query";
import "zod";
import "@tanstack/zod-adapter";
function ReviewForm({
  productId,
  orderId,
  userId,
  authorName,
  onDone
}) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState([]);
  const [busy, setBusy] = useState(false);
  const onUpload = async (files) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const up = await Promise.all(Array.from(files).map((f) => uploadMedia(f)));
      setImages((prev) => [...prev, ...up.map((u) => u.url)]);
    } catch (e) {
      toast.error(e.message ?? "Upload failed");
    }
    setBusy(false);
  };
  const submit = async () => {
    if (rating < 1) {
      toast.error("Pick a rating");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      order_id: orderId,
      user_id: userId,
      rating,
      title: title || null,
      body: body || null,
      images,
      author_name: authorName || null
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Review submitted — pending approval.");
    onDone?.();
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Your Rating" }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setRating(n), className: "p-1", children: /* @__PURE__ */ jsx(Star, { className: `w-6 h-6 ${n <= rating ? "fill-current" : "text-ink-soft"}` }) }, n)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Title" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          value: title,
          onChange: (e) => setTitle(e.target.value),
          maxLength: 120,
          className: "w-full h-11 border border-hairline bg-transparent px-3 text-sm",
          placeholder: "Sums up your experience"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Review" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          value: body,
          onChange: (e) => setBody(e.target.value),
          maxLength: 2e3,
          rows: 4,
          className: "w-full border border-hairline bg-transparent px-3 py-2 text-sm",
          placeholder: "What did you love?"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Photos (optional)" }),
      /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase border border-hairline px-4 h-9 cursor-pointer hover:bg-surface-dim", children: [
        /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4" }),
        " Add Photos",
        /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", multiple: true, hidden: true, onChange: (e) => onUpload(e.target.files) })
      ] }),
      images.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mt-3", children: images.map((u, i) => /* @__PURE__ */ jsxs("div", { className: "relative w-20 h-20 border border-hairline", children: [
        /* @__PURE__ */ jsx("img", { src: u, alt: "", className: "w-full h-full object-cover" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setImages((p) => p.filter((_, k) => k !== i)), className: "absolute -top-2 -right-2 bg-background border border-hairline p-1", children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" }) })
      ] }, u)) })
    ] }),
    /* @__PURE__ */ jsxs("button", { onClick: submit, disabled: busy, className: "btn-primary justify-center", children: [
      busy && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
      " Submit Review"
    ] })
  ] });
}
const reasons = ["Damaged on arrival", "Wrong item received", "Doesn't match description", "Quality issue", "No longer needed", "Other"];
function ReturnForm({ order, userId, onDone }) {
  const [selected, setSelected] = useState({});
  const [reason, setReason] = useState(reasons[0]);
  const [comments, setComments] = useState("");
  const [images, setImages] = useState([]);
  const [busy, setBusy] = useState(false);
  const toggle = (item, qty) => setSelected((p) => {
    const n = { ...p };
    if (qty <= 0) delete n[item.id];
    else n[item.id] = Math.min(qty, item.quantity);
    return n;
  });
  const onUpload = async (files) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const up = await Promise.all(Array.from(files).map((f) => uploadMedia(f)));
      setImages((p) => [...p, ...up.map((u) => u.url)]);
    } catch (e) {
      toast.error(e.message ?? "Upload failed");
    }
    setBusy(false);
  };
  const submit = async () => {
    const items = Object.entries(selected).map(([id, qty]) => {
      const it = order.order_items.find((x) => x.id === id);
      return { order_item_id: id, name: it.name, quantity: qty };
    });
    if (items.length === 0) {
      toast.error("Select at least one item");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("return_requests").insert({
      order_id: order.id,
      user_id: userId,
      reason,
      comments: comments || null,
      items,
      images
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Return request submitted.");
    onDone?.();
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow mb-3", children: "Items to Return" }),
      /* @__PURE__ */ jsx("ul", { className: "divide-y divide-hairline border border-hairline", children: order.order_items.map((it) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3 p-3", children: [
        it.image_url && /* @__PURE__ */ jsx("img", { src: it.image_url, alt: "", className: "w-12 h-12 object-cover border border-hairline" }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm truncate", children: it.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-ink-soft", children: [
            "Qty available: ",
            it.quantity
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            min: 0,
            max: it.quantity,
            value: selected[it.id] ?? 0,
            onChange: (e) => toggle(it, Number(e.target.value) || 0),
            className: "w-16 h-9 border border-hairline bg-transparent px-2 text-sm"
          }
        )
      ] }, it.id)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Reason" }),
      /* @__PURE__ */ jsx("select", { value: reason, onChange: (e) => setReason(e.target.value), className: "w-full h-11 border border-hairline bg-transparent px-3 text-sm", children: reasons.map((r) => /* @__PURE__ */ jsx("option", { children: r }, r)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Additional Comments" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          value: comments,
          onChange: (e) => setComments(e.target.value),
          maxLength: 1500,
          rows: 3,
          className: "w-full border border-hairline bg-transparent px-3 py-2 text-sm"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow mb-2", children: "Photos (proof)" }),
      /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase border border-hairline px-4 h-9 cursor-pointer hover:bg-surface-dim", children: [
        /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4" }),
        " Add Photos",
        /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", multiple: true, hidden: true, onChange: (e) => onUpload(e.target.files) })
      ] }),
      images.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mt-3", children: images.map((u, i) => /* @__PURE__ */ jsxs("div", { className: "relative w-20 h-20 border border-hairline", children: [
        /* @__PURE__ */ jsx("img", { src: u, alt: "", className: "w-full h-full object-cover" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setImages((p) => p.filter((_, k) => k !== i)), className: "absolute -top-2 -right-2 bg-background border border-hairline p-1", children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" }) })
      ] }, u)) })
    ] }),
    /* @__PURE__ */ jsxs("button", { onClick: submit, disabled: busy, className: "btn-primary justify-center", children: [
      busy && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
      " Submit Return Request"
    ] })
  ] });
}
function AccountPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const {
    data: orders = [],
    isLoading
  } = useMyOrders();
  const {
    data: returns = []
  } = useMyReturns();
  const [reviewing, setReviewing] = useState(null);
  const [returningOrder, setReturningOrder] = useState(null);
  useEffect(() => {
    (async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        navigate({
          to: "/auth",
          search: {
            mode: "signin",
            redirect: "/account"
          },
          replace: true
        });
        return;
      }
      setUserId(session.user.id);
      setEmail(session.user.email ?? "");
      setFullName(session.user.user_metadata?.full_name || "");
    })();
  }, []);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const cancelOrder = async (id) => {
    const {
      error
    } = await supabase.from("orders").update({
      status: "cancelled"
    }).eq("id", id);
    setConfirmCancelId(null);
    if (error) toast.error(error.message);
    else toast.success("Order cancelled.");
  };
  const hasReturnFor = (orderId) => returns.some((r) => r.order_id === orderId);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxs("main", { className: "pt-6 max-w-[1200px] mx-auto px-6 md:px-10 pb-24", children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow mb-3", children: "Members" }),
      /* @__PURE__ */ jsx("h1", { className: "font-serif text-4xl md:text-5xl", children: "My Account" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft mt-3", children: email }),
      /* @__PURE__ */ jsxs("section", { className: "mt-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between mb-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl", children: "Order History" }),
          /* @__PURE__ */ jsx(Link, { to: "/collections", className: "text-[11px] tracking-[0.2em] uppercase underline", children: "Continue Shopping" })
        ] }),
        isLoading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-20", children: /* @__PURE__ */ jsx(Loader2, { className: "w-6 h-6 animate-spin text-ink-soft" }) }) : orders.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "border border-hairline p-16 text-center", children: [
          /* @__PURE__ */ jsx(Package, { className: "w-10 h-10 mx-auto mb-4 text-ink-soft" }),
          /* @__PURE__ */ jsx("p", { className: "text-ink-soft mb-6", children: "You haven't placed any orders yet." }),
          /* @__PURE__ */ jsx(Link, { to: "/collections", className: "btn-primary inline-flex", children: "Explore Collections" })
        ] }) : /* @__PURE__ */ jsx("ul", { className: "space-y-5", children: orders.map((o) => /* @__PURE__ */ jsx(OrderCard, { order: o, userId, authorName: fullName, hasReturn: hasReturnFor(o.id), onCancel: () => setConfirmCancelId(o.id), onReview: (itemId) => setReviewing({
          order: o,
          itemId
        }), onReturn: () => setReturningOrder(o) }, o.id)) })
      ] }),
      returns.length > 0 && /* @__PURE__ */ jsxs("section", { className: "mt-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl mb-6", children: "Return Requests" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: returns.map((r) => /* @__PURE__ */ jsxs("li", { className: "border border-hairline p-5 flex flex-wrap items-center gap-4 justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "eyebrow mb-1", children: [
              "Order #",
              String(r.order_id).slice(0, 8)
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm", children: r.reason }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-soft mt-1", children: (r.items ?? []).map((i) => `${i.name} ×${i.quantity}`).join(", ") }),
            r.admin_notes && /* @__PURE__ */ jsxs("p", { className: "text-xs text-ink-soft mt-2", children: [
              "Admin: ",
              r.admin_notes
            ] }),
            r.pickup_scheduled_at && /* @__PURE__ */ jsxs("p", { className: "text-xs mt-1 inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Truck, { className: "w-3 h-3" }),
              " Pickup ",
              new Date(r.pickup_scheduled_at).toLocaleDateString()
            ] })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 bg-surface-dim", children: RETURN_STATUS_LABEL[r.status] ?? r.status })
        ] }, r.id)) })
      ] })
    ] }),
    reviewing && userId && /* @__PURE__ */ jsx(Modal, { title: "Write a Review", onClose: () => setReviewing(null), children: /* @__PURE__ */ jsx(ReviewForm, { productId: reviewing.order.order_items.find((i) => i.id === reviewing.itemId)?.product_id ?? "", orderId: reviewing.order.id, userId, authorName: fullName, onDone: () => setReviewing(null) }) }),
    returningOrder && userId && /* @__PURE__ */ jsx(Modal, { title: "Return Request", onClose: () => setReturningOrder(null), children: /* @__PURE__ */ jsx(ReturnForm, { order: returningOrder, userId, onDone: () => setReturningOrder(null) }) }),
    confirmCancelId && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4", onClick: () => setConfirmCancelId(null), children: /* @__PURE__ */ jsxs("div", { className: "bg-background border border-hairline w-full max-w-sm p-8 text-center", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl mb-3", children: "Cancel Order?" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft mb-8", children: "This action cannot be undone. The order will be marked as cancelled." }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setConfirmCancelId(null), className: "btn-ghost flex-1 justify-center", children: "Keep Order" }),
        /* @__PURE__ */ jsx("button", { onClick: () => cancelOrder(confirmCancelId), className: "flex-1 h-12 border border-destructive text-destructive text-sm tracking-wide hover:bg-destructive hover:text-destructive-foreground transition", children: "Yes, Cancel" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function OrderCard({
  order: o,
  userId,
  authorName,
  hasReturn,
  onCancel,
  onReview,
  onReturn
}) {
  const {
    data: events = []
  } = useOrderEvents(o.id);
  const [reviewedItems, setReviewedItems] = useState(/* @__PURE__ */ new Set());
  useEffect(() => {
    if (o.status !== "delivered" || !userId) return;
    const productIds = o.order_items.map((i) => i.product_id).filter(Boolean);
    if (!productIds.length) return;
    supabase.from("reviews").select("product_id").eq("user_id", userId).eq("order_id", o.id).in("product_id", productIds).then(({
      data
    }) => setReviewedItems(new Set((data ?? []).map((r) => r.product_id))));
  }, [o.id, o.status, userId]);
  return /* @__PURE__ */ jsxs("li", { className: "border border-hairline", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 p-6 border-b border-hairline", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "eyebrow mb-1", children: [
          "Order #",
          o.id.slice(0, 8)
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-soft", children: new Date(o.created_at).toLocaleDateString(void 0, {
          dateStyle: "medium"
        }) })
      ] }),
      /* @__PURE__ */ jsx("span", { className: `text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 ${STATUS_STYLE[o.status] ?? "bg-surface-dim"}`, children: STATUS_LABEL[o.status] ?? o.status }),
      /* @__PURE__ */ jsx("p", { className: "font-serif text-xl", children: currency(o.total) })
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "divide-y divide-hairline", children: o.order_items.map((it) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-4 p-4", children: [
      it.image_url ? /* @__PURE__ */ jsx("img", { src: it.image_url, alt: it.name, className: "w-16 h-16 object-cover border border-hairline" }) : /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-surface-dim border border-hairline" }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium truncate", children: it.name }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-ink-soft", children: [
          "Qty ",
          it.quantity,
          " · ",
          currency(Number(it.price))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        it.product_slug && /* @__PURE__ */ jsx(Link, { to: "/product/$id", params: {
          id: it.product_slug
        }, className: "text-[10px] tracking-[0.2em] uppercase underline", children: "View Product" }),
        o.status === "delivered" && it.product_id && !reviewedItems.has(it.product_id) && /* @__PURE__ */ jsxs("button", { onClick: () => onReview(it.id), className: "text-[10px] tracking-[0.2em] uppercase border border-hairline px-3 h-8 hover:bg-surface-dim inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Star, { className: "w-3 h-3" }),
          " Review"
        ] }),
        o.status === "delivered" && it.product_id && reviewedItems.has(it.product_id) && /* @__PURE__ */ jsxs("span", { className: "text-[10px] tracking-[0.2em] uppercase text-emerald-700 inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3" }),
          " Reviewed"
        ] })
      ] })
    ] }, it.id)) }),
    events.length > 0 && /* @__PURE__ */ jsxs("details", { className: "border-t border-hairline", children: [
      /* @__PURE__ */ jsx("summary", { className: "cursor-pointer px-6 py-3 text-[11px] tracking-[0.2em] uppercase text-ink-soft hover:bg-surface-dim", children: "Timeline" }),
      /* @__PURE__ */ jsx("ol", { className: "px-6 pb-4 space-y-2", children: events.map((e) => /* @__PURE__ */ jsxs("li", { className: "text-xs text-ink-soft flex gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "w-32 shrink-0", children: new Date(e.created_at).toLocaleString() }),
        /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: e.status ? STATUS_LABEL[e.status] ?? e.status : "Note" }),
        e.note && /* @__PURE__ */ jsxs("span", { children: [
          "— ",
          e.note
        ] }),
        /* @__PURE__ */ jsx("span", { className: "ml-auto text-[10px] uppercase tracking-[0.18em]", children: e.actor_role })
      ] }, e.id)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 p-4 border-t border-hairline", children: [
      o.status === "pending" && /* @__PURE__ */ jsxs("button", { onClick: onCancel, className: "text-[11px] tracking-[0.2em] uppercase border border-hairline px-4 h-9 hover:bg-surface-dim inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(X, { className: "w-3 h-3" }),
        " Cancel Order"
      ] }),
      o.status === "delivered" && !hasReturn && /* @__PURE__ */ jsxs("button", { onClick: onReturn, className: "text-[11px] tracking-[0.2em] uppercase border border-hairline px-4 h-9 hover:bg-surface-dim inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(RotateCcw, { className: "w-3 h-3" }),
        " Return Product"
      ] }),
      o.shipping_address && /* @__PURE__ */ jsxs("span", { className: "text-xs text-ink-soft ml-auto", children: [
        o.shipping_address.line1,
        ", ",
        o.shipping_address.city,
        ", ",
        o.shipping_address.country
      ] })
    ] })
  ] });
}
function Modal({
  title,
  children,
  onClose
}) {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { className: "bg-background border border-hairline w-full max-w-xl max-h-[90vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-5 border-b border-hairline", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl", children: title }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "p-2 hover:bg-surface-dim", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-5", children })
  ] }) });
}
export {
  AccountPage as component
};
