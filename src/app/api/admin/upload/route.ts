import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { imageUploadConfigured } from "@/lib/integrations";
import { MAX_IMAGE_BYTES, uploadImage, validateImage } from "@/lib/image-upload";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Upload from the portfolio administration." }, { status: 403 });
  }
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Sign in to upload an image." }, { status: 401 });
  }
  if (!imageUploadConfigured()) {
    return NextResponse.json({ error: "Image upload is not connected yet. Paste an image URL instead." }, { status: 503 });
  }
  if (Number(request.headers.get("content-length")) > MAX_IMAGE_BYTES + 65536) {
    return NextResponse.json({ error: "Choose an image smaller than 4 MB." }, { status: 413 });
  }
  let file: File;
  try {
    const data = await request.formData();
    const entry = data.get("file");
    if (!(entry instanceof File)) throw new Error("Choose an image to upload.");
    file = entry;
    await validateImage(file);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Choose a valid image." }, { status: 400 });
  }
  try {
    return NextResponse.json({ url: await uploadImage(file) });
  } catch {
    return NextResponse.json({ error: "Image upload failed. Please try again or paste an image URL." }, { status: 502 });
  }
}
