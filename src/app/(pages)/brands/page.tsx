import type { Metadata } from "next";
import CollectionShowcase from "@/components/CollectionShowcase/CollectionShowcase";
import { getCollectionData } from "@/lib/collectionData";

export const metadata: Metadata = { title: "Discover brands", description: "Find your favourite brands at ShopMart." };
export const dynamic = "force-dynamic";

export default async function Brands() {
  const items = await getCollectionData("brands");
  return <CollectionShowcase items={items} kind="brands" />;
}
