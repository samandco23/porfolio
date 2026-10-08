import { contactNotificationsConfigured } from "./integrations";

type NotificationMessage = { id: string; name: string; email: string; subject: string | null; body: string };

/** The inbox is authoritative; a provider failure must never lose a saved message. */
export async function notifyContactMessage(message: NotificationMessage): Promise<"sent" | "disabled" | "failed"> {
  if (!contactNotificationsConfigured()) return "disabled";
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", cache: "no-store", signal: AbortSignal.timeout(8000),
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `contact-${message.id}`,
      },
      body: JSON.stringify({
        from: process.env.CONTACT_NOTIFICATION_FROM,
        to: [process.env.CONTACT_NOTIFICATION_TO],
        reply_to: message.email,
        subject: `Portfolio: ${(message.subject || "New contact message").replace(/[\r\n]/g, " ")}`,
        text: `From: ${message.name}\nEmail: ${message.email}\n\n${message.body}`,
      }),
    });
    if (response.ok) return "sent";
  } catch { /* The visitor's message is already stored. */ }
  console.error("Contact notification failed; the message remains in the admin inbox.");
  return "failed";
}
