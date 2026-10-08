"use client";

import { createContext, useContext } from "react";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content";

const ContentContext = createContext(DEFAULT_SITE_CONTENT);
export function SiteContentProvider({ content, children }: { content: Record<string, string>; children: React.ReactNode }) {
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}
export function useSiteContent() { return useContext(ContentContext); }
export function SiteText({ name }: { name: string }) {
  const content = useSiteContent();
  return <>{content[name] ?? DEFAULT_SITE_CONTENT[name] ?? ""}</>;
}
