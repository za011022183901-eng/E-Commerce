import type { Metadata } from "next";
import CollectionShowcase from "@/components/CollectionShowcase/CollectionShowcase";
import type { CategoryI } from "@/interfaces";

export const metadata: Metadata = { title: "Discover brands", description: "Find your favourite brands at ShopMart." };
export default async function Brands() {
  const response = await fetch("https://ecommerce.routemisr.com/api/v1/brands", { next: { revalidate: 60 * 60 * 24 } });
  const payload = response.ok ? await response.json() : { data: [] };
  return <CollectionShowcase items={(payload.data ?? []) as CategoryI[]} kind="brands" />;
}
