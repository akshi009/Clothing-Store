import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { s as supabase } from "./client-BhH2qhhP.js";
const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned"
];
const STATUS_LABEL = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned"
};
const STATUS_STYLE = {
  pending: "bg-amber-100 text-amber-900",
  confirmed: "bg-sky-100 text-sky-900",
  processing: "bg-blue-100 text-blue-900",
  shipped: "bg-indigo-100 text-indigo-900",
  out_for_delivery: "bg-violet-100 text-violet-900",
  delivered: "bg-emerald-100 text-emerald-900",
  cancelled: "bg-rose-100 text-rose-900",
  returned: "bg-stone-200 text-stone-900"
};
function useMyOrders() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("id,user_id,status,total,created_at,customer_name,customer_email,shipping_address,order_items(id,order_id,product_id,name,price,quantity,image_url,product_slug)").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
  });
  useEffect(() => {
    const ch = supabase.channel("my-orders-live").on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => qc.invalidateQueries({ queryKey: ["my-orders"] })).on("postgres_changes", { event: "*", schema: "public", table: "order_events" }, (payload) => {
      const oid = (payload?.new ?? payload?.old)?.order_id;
      if (oid) qc.invalidateQueries({ queryKey: ["order-events", oid] });
      qc.invalidateQueries({ queryKey: ["my-orders"] });
    }).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);
  return q;
}
function useOrderEvents(orderId) {
  return useQuery({
    queryKey: ["order-events", orderId],
    enabled: !!orderId,
    queryFn: async () => {
      const { data, error } = await supabase.from("order_events").select("*").eq("order_id", orderId).order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    }
  });
}
function useProductReviews(productId) {
  return useQuery({
    queryKey: ["product-reviews", productId],
    enabled: !!productId,
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("id,rating,title,body,images,author_name,created_at").eq("product_id", productId).eq("status", "approved").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
  });
}
function useFeaturedReviews() {
  return useQuery({
    queryKey: ["featured-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("id,rating,title,body,author_name,images,created_at").eq("status", "approved").eq("featured", true).order("created_at", { ascending: false }).limit(6);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 6e4
  });
}
function useMyReturns() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["my-returns"],
    queryFn: async () => {
      const { data, error } = await supabase.from("return_requests").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
  });
  useEffect(() => {
    const ch = supabase.channel("my-returns-live").on("postgres_changes", { event: "*", schema: "public", table: "return_requests" }, () => qc.invalidateQueries({ queryKey: ["my-returns"] })).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);
  return q;
}
const RETURN_STATUS_LABEL = {
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  scheduled: "Return Scheduled",
  completed: "Completed"
};
export {
  ORDER_STATUSES as O,
  RETURN_STATUS_LABEL as R,
  STATUS_LABEL as S,
  useMyReturns as a,
  useOrderEvents as b,
  STATUS_STYLE as c,
  useFeaturedReviews as d,
  useProductReviews as e,
  useMyOrders as u
};
