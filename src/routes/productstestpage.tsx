import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { query } from "@/lib/vendure/client";
import { GET_PRODUCTS } from "@/lib/vendure/queries";

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products Test Page</h1>
      <ul className="space-y-4">
        {data.products.items.map((p: ProductItem) => (
          <li key={p.id} className="border p-4 rounded shadow">
            <h2 className="font-semibold">{p.name}</h2>
            {p.featuredAsset?.preview && (
              <img
                src={`${p.featuredAsset.preview}?preset=small`}
                alt={p.name}
                className="mt-2 w-32 h-auto rounded"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
