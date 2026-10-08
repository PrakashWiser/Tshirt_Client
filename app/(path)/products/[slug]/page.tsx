import CollectionSection from "@/app/components/Container/CollectionSection/CollectionSection";
import ProductSection from "@/app/components/Container/ProductSection/ProductSection";
import type { Metadata } from "next";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;

  const collectionName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${collectionName} | Collections`,
    description:
      "Explore the latest collections at SND Shop. Discover stylish and comfortable clothing, footwear, and accessories for everyone.",
    alternates: {
      canonical: `/products/${slug}`,
    },
  };
}

async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;

  return <ProductSection slug={slug} />;
}

export default CollectionPage;
