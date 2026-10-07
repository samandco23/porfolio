"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { contactSchema, zodFieldErrors } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";

export type ContactFormState = {
  ok: boolean;
  message: string;
  errors: Record<string, string>;
};

export async function submitContactMessage(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Honeypot: bots fill the hidden "website" field; humans never see it.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return {
      ok: true, // pretend success so bots move on
      message: "Thanks! Your message has been sent.",
      errors: {},
    };
  }

  // Rate limit per IP: 5 messages / 10 minutes
  const headerList = await headers();
  const ip =
    headerList.get("x-real-ip")?.trim() ||
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!ip) {
    return {
      ok: false,
      message: "We couldn't verify your connection. Please use the email address shown on this page.",
      errors: {},
    };
  }
  const { ok } = await rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
  if (!ok) {
    return {
      ok: false,
      message: "Too many messages. Please try again later.",
      errors: {},
    };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") ?? "",
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      errors: zodFieldErrors(parsed.error),
    };
  }

  await prisma.message.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject || null,
      body: parsed.data.body,
    },
  });

  revalidatePath("/admin");
  return { ok: true, message: "Message sent — I'll get back to you soon.", errors: {} };
}
