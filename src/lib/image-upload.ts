import { imageUploadConfigured } from "./integrations";

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export async function validateImage(file: File): Promise<void> {
  if (!file.size || file.size > MAX_IMAGE_BYTES) throw new Error("Choose an image smaller than 4 MB.");
  const bytes = Buffer.from(await file.slice(0, 32).arrayBuffer());
  const formats: Record<string, boolean> = {
    "image/jpeg": bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
    "image/png": bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    "image/webp": bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP",
    "image/avif": bytes.toString("ascii", 4, 8) === "ftyp" && /avif|avis/.test(bytes.toString("ascii", 8)),
  };
  if (!formats[file.type]) throw new Error("Choose a valid JPEG, PNG, WebP or AVIF image.");
}

export async function uploadImage(file: File): Promise<string> {
  if (!imageUploadConfigured()) throw new Error("Image upload is not configured.");
  await validateImage(file);
  const cloud = process.env.CLOUDINARY_CLOUD_NAME!;
  if (!/^[a-z0-9_-]+$/i.test(cloud)) throw new Error("Image upload configuration is invalid.");
  const body = new FormData();
  body.set("file", file);
  body.set("folder", "portfolio");
  body.set("allowed_formats", "jpg,png,webp,avif");
  const credentials = Buffer.from(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`).toString("base64");
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST", headers: { Authorization: `Basic ${credentials}` },
    body, signal: AbortSignal.timeout(15000), cache: "no-store",
  });
  if (!response.ok) throw new Error("Image upload failed. Please try again.");
  const data = await response.json();
  if (typeof data.secure_url !== "string" || !data.secure_url.startsWith("https://res.cloudinary.com/")) {
    throw new Error("The image service returned an invalid image URL.");
  }
  return data.secure_url;
}
