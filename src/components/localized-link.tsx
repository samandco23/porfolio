"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { usePreferences } from "./site-content";
import { localizedPath } from "@/lib/locale-routes";

export function LocalizedLink({ href, ...props }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const { locale } = usePreferences();
  return <Link href={localizedPath(href, locale)} {...props} />;
}
