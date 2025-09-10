import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { query } from "@/lib/vendure/client";
import { SEARCH_PRODUCTS } from "@/lib/vendure/queries";
import { BadgeCard } from "@/components/mantine/badgecard";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { usePagination } from "@/lib/usePagination";
import { FilterModal } from "@/components/ui/filtermodal.tsx";

export const Route = createFileRoute("/_layout/products")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      query: typeof search.query === "string" ? search.query : "",
    };
  },
});

function RouteComponent() {
  const { query: term } = Route.useSearch();
  // Track facet filters (facetValueIds from modal)
  const [filters, setFilters] = useState<string[]>([]);
  // TODO: const [term] = useState(""); // later: add search box
  // TODO: const [collectionSlug] = useState<string | undefined>(undefined); // later: collection pages

  // pagination
  const { page, setPage, skip, take } = usePagination(0, 12);

  // fetch products via SEARCH
  const { data, isLoading, error } = useQuery({
    queryKey: ["search", { skip, take, filters }],
    queryFn: async () => {
      const res = await query(SEARCH_PRODUCTS, {
        input: {
          term,
          skip,
          take,
          groupByProduct: true,
          facetValueFilters: filters.length
            ? filters.map((id) => ({ and: id }))
            : undefined,
        },
      });

      if (res.errors && res.errors.length > 0) {
        throw new Error(
          res.errors.map((e: { message: string }) => e.message).join(", "),
        );
      }

      return res.data;
    },
  });

  if (isLoading) return <p>Loading products…</p>;
  if (error) {
    console.error("Search query error:", error);
    return (
      <div className="p-6 text-red-600">
        <p>Error loading products:</p>
        <pre className="whitespace-pre-wrap text-sm">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    );
  }

  type SearchItem = {
    productId: string;
    productName: string;
    slug: string;
    productAsset?: { preview: string } | null;
  };

  const totalItems = data?.search?.totalItems ?? 0;
  const items = data?.search?.items ?? [];
  const totalPages = Math.max(1, Math.ceil(totalItems / take));

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Filter button + modal */}
      <FilterModal onApply={setFilters} />

      {/* Product grid */}
      {items.length === 0 ? (
        <p>No products found for these filters.</p>
      ) : (
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]">
          {items.map((p: SearchItem) => (
            <BadgeCard
              key={p.productId}
              image={`${p.productAsset?.preview}?preset=large`}
              title={p.productName}
              description={`Slug: ${p.slug}`}
              country="USA"
              badges={[
                { emoji: "📚", label: "Book" },
                { emoji: "🔥", label: "Hot pick" },
              ]}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4 justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
              />
            </PaginationItem>

            <PaginationItem>
              <span className="px-3 py-2 text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
