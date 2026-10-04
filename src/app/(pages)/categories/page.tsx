import type { Metadata } from "next";
import CollectionShowcase from "@/components/CollectionShowcase/CollectionShowcase";
import { getCollectionData } from "@/lib/collectionData";

export const metadata: Metadata = { title: "Shop by category", description: "Explore ShopMart collections by category." };
export const dynamic = "force-dynamic";

export default async function Categories() {
  const items = await getCollectionData("categories");
  return <CollectionShowcase items={items} kind="categories" />;
}
