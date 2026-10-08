import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { notifyContactMessage } from "@/lib/contact-notifications";

const fetchMock = vi.fn();
const message = { id: "message-1", name: "Visitor", email: "visitor@example.com", subject: "A project", body: "Let’s work together." };

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("RESEND_API_KEY", "test-only-key");
  vi.stubEnv("CONTACT_NOTIFICATION_FROM", "Portfolio <portfolio@example.com>");
  vi.stubEnv("CONTACT_NOTIFICATION_TO", "owner@example.com");
  fetchMock.mockReset();
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("contact notifications", () => {
  it("does not send anything when the service is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect(await notifyContactMessage(message)).toBe("disabled");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("notifies only the configured owner, with reply-to and deduplication", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 201 }));
    expect(await notifyContactMessage(message)).toBe("sent");
    const options = fetchMock.mock.calls[0][1];
    expect(JSON.parse(options.body)).toEqual(expect.objectContaining({
      to: ["owner@example.com"], reply_to: message.email, text: expect.stringContaining(message.body),
    }));
    expect(options.headers["Idempotency-Key"]).toBe("contact-message-1");
  });

  it.each(["network", "provider"])("handles a %s failure without throwing or logging personal data", async (failure) => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    if (failure === "network") fetchMock.mockRejectedValue(new Error("provider secret"));
    else fetchMock.mockResolvedValue(new Response("private payload", { status: 500 }));
    expect(await notifyContactMessage(message)).toBe("failed");
    expect(JSON.stringify(log.mock.calls)).not.toContain(message.email);
    expect(JSON.stringify(log.mock.calls)).not.toContain("provider secret");
  });
});
