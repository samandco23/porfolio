import { cache } from "react";
import { unstable_cache } from "next/cache";

export const PUBLIC_CACHE_TAG = "portfolio-public";

/** Cross-request data cache plus deduplication within a render. No private reads. */
export function publicCache<Args extends unknown[], Result>(
  key: string,
  read: (...args: Args) => Promise<Result>,
) {
  return cache(unstable_cache(read, ["portfolio-preferences-v3", key], { tags: [PUBLIC_CACHE_TAG], revalidate: 300 }));
}
