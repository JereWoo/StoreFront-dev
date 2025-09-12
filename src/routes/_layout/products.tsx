import { createFileRoute, Link } from "@tanstack/react-router";
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
import { Toggle } from "@/components/ui/9ui/toggle";

import { useSearchProductsQuery } from "@/generated/hooks";
import { ProductSearchItemFieldsFragment } from "@/generated/graphql"; // typed fragment

export const Route = createFileRoute("/_layout/products")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      query: typeof search.query === "string" ? search.query : "",
    };
  },
});

export function ProductTile({ p }: { p: ProductSearchItemFieldsFragment }) {
  return (
    <Link
      to="/listing/$id"
      params={{ id: p.productId, slug: p.slug }}
      className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
    >
      {/* Image */}
      <div className="aspect-square w-full bg-gray-50 flex items-center justify-center">
        <img
          src={`${p.productAsset?.preview}?preset=large`}
          alt={p.productName}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Details */}
      <div className="p-3">
        <div className="font-medium text-sm line-clamp-2">{p.productName}</div>
        <div className="text-xs text-gray-500 mb-1">{p.slug}</div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-emerald-700">
            ${Math.floor(Math.random() * 100) + 10}
          </span>
          <span className="text-xs text-gray-400">USA</span>
        </div>
      </div>
    </Link>
  );
}

function ProductRow({ p }: { p: ProductSearchItemFieldsFragment }) {
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

import { LayoutGrid, List } from "lucide-react"; // if you prefer Lucide icons

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

      {/* Single toggle button with icon */}
      <Toggle
        pressed
        onPressedChange={() => setView(view === "grid" ? "list" : "grid")}
        aria-label="Toggle view"
      >
        {view === "grid" ? (
          // grid icon
          <LayoutGrid className="h-4 w-4" />
        ) : (
          // list icon
          <List className="h-4 w-4" />
        )}
      </Toggle>

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
