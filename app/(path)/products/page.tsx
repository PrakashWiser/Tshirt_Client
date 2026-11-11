import ProductListingSection from "@/app/components/Container/ProductSection/ProductListingSection";

interface ProductsPageProps {
  searchParams: Promise<{
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const query = await searchParams;
  const sort =
    query.sort === "newest" || query.sort === "popular" ? query.sort : "";
  const requestedPage = Number(query.page);
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  return <ProductListingSection sort={sort} page={page} />;
}
