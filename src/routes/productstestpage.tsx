import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { query } from "@/lib/vendure/client";
import { GET_PRODUCTS } from "@/lib/vendure/queries";
import { BadgeCard } from "@/components/mantine/badgecard";

export const Route = createFileRoute("/productstestpage")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", { take: 5 }],
    queryFn: () =>
      query(GET_PRODUCTS, { options: { take: 5 } }).then((res) => res.data),
  });

  if (isLoading) return <p>Loading products…</p>;
  if (error) return <p>Error loading products</p>;

  type ProductItem = {
    id: string;
    name: string;
    featuredAsset?: { preview: string } | null;
  };

  return (
    <div className="p-6 grid gap-6 grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]">
      {data.products.items.map((p: ProductItem) => (
        <BadgeCard
          key={p.id}
          image={`${p.featuredAsset?.preview}?preset=large`}
          title={p.name}
          description={`Slug: ${p.name}`}
          country="USA" // or remove if you don’t have this data
          badges={[
            { emoji: "📚", label: "Book" },
            { emoji: "🔥", label: "Hot pick" },
          ]}
        />
      ))}
    </div>
  );
}
