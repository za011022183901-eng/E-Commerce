import type { CategoryI } from "@/interfaces";

type CollectionKind = "brands" | "categories";
type CacheEntry = { expiresAt: number; request: Promise<CategoryI[]> };

const collectionCache = new Map<CollectionKind, CacheEntry>();
const SUCCESS_CACHE_MS = 10 * 60 * 1000;
const FAILURE_CACHE_MS = 5 * 60 * 1000;

export function getCollectionData(kind: CollectionKind): Promise<CategoryI[]> {
  const existing = collectionCache.get(kind);
  if (existing && existing.expiresAt > Date.now()) return existing.request;

  const request = (async () => {
    try {
      const response = await fetch(`https://ecommerce.routemisr.com/api/v1/${kind}`, {
        signal: AbortSignal.timeout(2000),
      });
      if (!response.ok) throw new Error(`Collection API returned ${response.status}`);
      const payload = await response.json();
      if (!Array.isArray(payload?.data)) throw new Error("Invalid collection response");

      collectionCache.set(kind, {
        expiresAt: Date.now() + SUCCESS_CACHE_MS,
        request: Promise.resolve(payload.data as CategoryI[]),
      });
      return payload.data as CategoryI[];
    } catch {
      collectionCache.set(kind, {
        expiresAt: Date.now() + FAILURE_CACHE_MS,
        request: Promise.resolve([]),
      });
      return [];
    }
  })();

  collectionCache.set(kind, { expiresAt: Date.now() + SUCCESS_CACHE_MS, request });
  return request;
}
