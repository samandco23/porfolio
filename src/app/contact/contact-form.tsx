"use client";

import { SiteText, useSiteContent } from "@/components/site-content";

import { useFormState } from "react-dom";
import { Send } from "lucide-react";
import { submitContactMessage, type ContactFormState } from "@/lib/actions/public";
import { Reveal } from "@/components/motion/reveal";

const initialState: ContactFormState = { ok: false, message: "", errors: {} };

export function ContactForm() {
  const content = useSiteContent();
  const [state, formAction, pending] = useFormState(submitContactMessage, initialState);

  return (
    <Reveal>
      <form action={formAction} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="label-dark"> <SiteText name="app.contact.contact-form.1" /> </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="input-dark"
              placeholder={content["contact.namePlaceholder"]}
            />
            {state.errors?.name && (
              <p className="mt-1 font-mono text-xs text-red-400">{state.errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="label-dark"> <SiteText name="app.contact.contact-form.2" /> </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              required
              className="input-dark"
              placeholder={content["contact.emailPlaceholder"]}
            />
            {state.errors?.email && (
              <p className="mt-1 font-mono text-xs text-red-400">{state.errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="label-dark"> <SiteText name="app.contact.contact-form.3" /> </label>
          <input
            id="subject"
            name="subject"
            type="text"
            autoComplete="off"
            className="input-dark"
            placeholder={content["contact.subjectPlaceholder"]}
          />
        </div>

        <div>
          <label htmlFor="body" className="label-dark"> <SiteText name="app.contact.contact-form.4" /> </label>
          <textarea
            id="body"
            name="body"
            autoComplete="off"
            required
            rows={6}
            className="input-dark resize-y"
            placeholder={content["contact.bodyPlaceholder"]}
          />
          {state.errors?.body && (
            <p className="mt-1 font-mono text-xs text-red-400">{state.errors.body}</p>
          )}
        </div>

        {/* Honeypot — hidden from humans, catnip for bots */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website"> Website </label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={pending} className="btn-primary">
            <Send className="h-4 w-4" />
            {pending ? <SiteText name="app.contact.contact-form.6" /> : <SiteText name="app.contact.contact-form.7" />}
          </button>
          {state.message && (
            <p
              className={`font-mono text-xs ${
                state.ok ? "text-[#00FF66]" : "text-red-400"
              }`}
              role="status"
              aria-live="polite"
            >
              {state.ok ? "✓ " : "✗ "}
              {state.ok ? content["contact.success"] : content[state.messageKey ?? ""] ?? state.message}
            </p>
          )}
        </div>
      </form>
    </Reveal>
  );
}
