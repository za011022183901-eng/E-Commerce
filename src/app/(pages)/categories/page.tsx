import type { Metadata } from "next";
import CollectionShowcase from "@/components/CollectionShowcase/CollectionShowcase";
import type { CategoryI } from "@/interfaces";

export const metadata: Metadata = { title: "Shop by category", description: "Explore ShopMart collections by category." };
export default async function Categories() {
  const response = await fetch("https://ecommerce.routemisr.com/api/v1/categories", { next: { revalidate: 60 * 60 * 24 } });
  const payload = response.ok ? await response.json() : { data: [] };
  return <CollectionShowcase items={(payload.data ?? []) as CategoryI[]} kind="categories" />;
}
