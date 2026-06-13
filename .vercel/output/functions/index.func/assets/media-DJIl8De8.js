import { s as supabase } from "./client-BhH2qhhP.js";
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;
async function uploadMedia(file) {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
  if (error) throw error;
  return { url: await signedUrl(path), path };
}
async function signedUrl(path) {
  const { data, error } = await supabase.storage.from("media").createSignedUrl(path, TEN_YEARS);
  if (error || !data?.signedUrl) throw error ?? new Error("Failed to sign URL");
  return data.signedUrl;
}
function isVideoUrl(url) {
  if (!url) return false;
  const u = url.toLowerCase().split("?")[0];
  return /\.(mp4|webm|mov|m4v|ogg)$/.test(u);
}
export {
  isVideoUrl as i,
  signedUrl as s,
  uploadMedia as u
};
