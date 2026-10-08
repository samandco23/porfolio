import { beforeEach, describe, expect, it, vi } from "vitest";
import { submitContactMessage } from "@/lib/actions/public";

const mocks = vi.hoisted(() => ({ create: vi.fn(), notify: vi.fn(), limit: vi.fn(), revalidate: vi.fn() }));
vi.mock("@/lib/db", () => ({ prisma: { message: { create: mocks.create } } }));
vi.mock("@/lib/contact-notifications", () => ({ notifyContactMessage: mocks.notify }));
vi.mock("@/lib/rate-limit", () => ({ rateLimit: mocks.limit }));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ "x-real-ip": "203.0.113.1" }) }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
const idle = { ok: false, message: "", errors: {} };
beforeEach(() => vi.resetAllMocks());

describe("contact persistence and notification", () => {
  it("saves the message before notification and reports success if email delivery fails", async () => {
    const message = { id: "saved", name: "Visitor", email: "visitor@example.com", subject: "Project", body: "A sufficiently long inquiry about a project." };
    mocks.limit.mockResolvedValue({ ok: true });
    mocks.create.mockResolvedValue(message);
    mocks.notify.mockResolvedValue("failed");
    const form = new FormData();
    for (const [name, value] of Object.entries(message)) form.set(name, value);
    expect((await submitContactMessage(idle, form)).ok).toBe(true);
    expect(mocks.notify).toHaveBeenCalledWith(message);
    expect(mocks.create.mock.invocationCallOrder[0]).toBeLessThan(mocks.notify.mock.invocationCallOrder[0]);
  });

  it("does not save or notify a honeypot submission", async () => {
    const form = new FormData();
    form.set("website", "spam");
    expect((await submitContactMessage(idle, form)).ok).toBe(true);
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.notify).not.toHaveBeenCalled();
  });
});
