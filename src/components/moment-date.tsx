"use client";
import { usePreferences } from "./site-content";
export function MomentDate({ date }: { date: string }) {
  const { locale } = usePreferences();
  if (date.length === 4) return <span>{date}</span>;
  const monthOnly = date.length === 7;
  const value = new Date(`${monthOnly ? `${date}-01` : date}T12:00:00Z`);
  const text = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", { year: "numeric", month: "long", ...(monthOnly ? {} : { day: "numeric" as const }), timeZone: "UTC" }).format(value);
  return <time dateTime={date}>{text}</time>;
}
