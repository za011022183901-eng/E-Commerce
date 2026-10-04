import type { products as Product } from "@/interfaces/products";

type ProductResult = { data: Product[]; unavailable: boolean };
type CacheEntry = { expiresAt: number; request: Promise<ProductResult> };

let productsCache: CacheEntry | undefined;
const CACHE_MS = 5 * 60 * 1000;

export function getProductList(): Promise<ProductResult> {
  if (productsCache && productsCache.expiresAt > Date.now()) return productsCache.request;

  const request = (async (): Promise<ProductResult> => {
    try {
      const response = await fetch("https://ecommerce.routemisr.com/api/v1/products", {
        signal: AbortSignal.timeout(2000),
      });
      if (!response.ok) throw new Error(`Products API returned ${response.status}`);
      const payload = await response.json();
      if (!Array.isArray(payload?.data)) throw new Error("Invalid products response");
      return { data: payload.data as Product[], unavailable: false };
    } catch {
      return { data: [], unavailable: true };
    }
  })();

  productsCache = { expiresAt: Date.now() + CACHE_MS, request };
  return request;
}
