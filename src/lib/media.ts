/** Optimize only sources explicitly allowed in next.config; preserve arbitrary admin URLs. */
export function canOptimizeImage(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const url = new URL(src);
    if (url.protocol !== "https:") return false;
    if (url.hostname === "www.getsmarter-group.com") return /^\/image\/[^/]+\.(jpe?g|png|webp|avif)$/i.test(url.pathname);
    if (url.hostname === "res.cloudinary.com") return /^\/[^/]+\/image\/upload\/.*\.(jpe?g|png|webp|avif)$/i.test(url.pathname);
    return false;
  } catch { return false; }
}
