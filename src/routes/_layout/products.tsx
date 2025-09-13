import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FilterModal } from "@/features/search/components/filtermodal";
import { useSearchProductsQuery } from "@/generated/hooks";
import { ListingResults } from "@/features/listings/components/ListingResults";
import { usePagination } from "@/lib/usePagination";

export const Route = createFileRoute("/_layout/products")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    query: typeof search.query === "string" ? search.query : "",
  }),
});

function RouteComponent() {
  const { query: term } = Route.useSearch();
  const [filters, setFilters] = useState<string[]>([]);

  const { page, setPage, skip, take } = usePagination(1, 12);

  const { data, isLoading, error } = useSearchProductsQuery({
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

  const totalItems = data?.search.totalItems ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / take));
  const items = data?.search.items ?? [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <FilterModal onApply={setFilters} />
      <ListingResults
        items={items}
        page={page}
        take={take}
        totalPages={totalPages}
        setPage={setPage}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
