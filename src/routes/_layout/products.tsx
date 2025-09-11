import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/composites/pagination";
import { usePagination } from "@/lib/usePagination";
import { FilterModal } from "@/components/ui/composites/filtermodal.tsx";
import { ToggleGroup } from "@/components/ui/9ui/toggle-group";
import { Toggle } from "@/components/ui/9ui/toggle";

import { useSearchProductsQuery } from "@/generated/hooks";
import { ProductSearchItemFragment } from "@/generated/graphql"; // typed fragment

export const Route = createFileRoute("/_layout/products")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      query: typeof search.query === "string" ? search.query : "",
    };
  },
});

function ProductTile({ p }: { p: ProductSearchItemFragment }) {
  return (
    <div className="border rounded-lg p-3 hover:shadow-md">
      <img
        src={`${p.productAsset?.preview}?preset=large`}
        alt={p.productName}
        className="w-full h-40 object-contain"
      />
      <div className="mt-2 font-medium line-clamp-2">{p.productName}</div>
      <div className="text-sm text-gray-500">Slug: {p.slug}</div>
      <div className="mt-1 font-bold">$—</div>
      <div className="text-xs text-gray-400">USA</div>
    </div>
  );
}

function ProductRow({ p }: { p: ProductSearchItemFragment }) {
  return (
    <div className="flex items-center gap-4 border-b py-3 hover:bg-gray-50">
      <img
        src={`${p.productAsset?.preview}?preset=large`}
        alt={p.productName}
        className="w-16 h-16 object-contain"
      />
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{p.productName}</div>
        <div className="text-sm text-gray-500">Slug: {p.slug} • USA</div>
      </div>
      <div className="font-bold">$—</div>
    </div>
  );
}

function RouteComponent() {
  const { query: term } = Route.useSearch();
  const [filters, setFilters] = useState<string[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");

  const { page, setPage, skip, take } = usePagination(0, 12);

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

  const totalItems = data?.search.totalItems ?? 0;
  const items = data?.search.items ?? [];
  const totalPages = Math.max(1, Math.ceil(totalItems / take));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <FilterModal onApply={setFilters} />

      <ToggleGroup
        type="single"
        value={view}
        onValueChange={(v) => v && setView(v as "grid" | "list")}
        className="flex gap-2"
      >
        <Toggle value="grid">Grid</Toggle>
        <Toggle value="list">List</Toggle>
      </ToggleGroup>

      {items.length === 0 ? (
        <p>No products found for these filters.</p>
      ) : view === "grid" ? (
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]">
          {items.map((p) => (
            <ProductTile key={p.productId} p={p} />
          ))}
        </div>
      ) : (
        <div>
          {items.map((p) => (
            <ProductRow key={p.productId} p={p} />
          ))}
        </div>
      )}

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
