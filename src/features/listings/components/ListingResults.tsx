import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";

import { ListingTile } from "./ListingTile";
import { ListingRow } from "./ListingRow";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/composites/pagination";
import { Toggle } from "@/components/ui/9ui/toggle";
import { ProductSearchItemFieldsFragment } from "@/generated/graphql";

type ListingResultsProps = {
  items: ProductSearchItemFieldsFragment[];
  page: number;
  take: number;
  totalPages: number;
  setPage: (p: number) => void;
  isLoading?: boolean;
  error?: unknown;
};

export function ListingResults({
  items,
  page,
  take,
  totalPages,
  setPage,
  isLoading,
  error,
}: ListingResultsProps) {
  const [view, setView] = useState<"grid" | "list">("grid");

  if (isLoading) return <p>Loading listings…</p>;
  if (error) {
    console.error("Search query error:", error);
    return (
      <div className="p-6 text-red-600">
        <p>Error loading listings:</p>
        <pre className="whitespace-pre-wrap text-sm">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View toggle */}
      <Toggle
        pressed
        onPressedChange={() => setView(view === "grid" ? "list" : "grid")}
        aria-label="Toggle view"
      >
        {view === "grid" ? (
          <LayoutGrid className="h-4 w-4" />
        ) : (
          <List className="h-4 w-4" />
        )}
      </Toggle>

      {/* Listings */}
      {items.length === 0 ? (
        <p>No listings found for these filters.</p>
      ) : view === "grid" ? (
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]">
          {items.map((listing) => (
            <ListingTile key={listing.productId} listing={listing} />
          ))}
        </div>
      ) : (
        <div>
          {items.map((listing) => (
            <ListingRow key={listing.productId} listing={listing} />
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
                  setPage(Math.max(1, page - 1));
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
                  setPage(Math.min(totalPages, page + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
