// src/routes/_layout/sell/new-listing.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/9ui/input";
import { Textarea } from "@/components/ui/9ui/textarea";
import { Button } from "@/components/ui/9ui/button";
import { useCreateSellerProductMutation } from "@/generated/hooks";
import { DropzoneButton } from "@/components/ui/mantine/DropzoneButton.tsx";

export const Route = createFileRoute("/_layout/sell/new-listing")({
  component: NewListingPage,
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function dollarsToCents(v: string) {
  const n = parseFloat(v);
  return Number.isNaN(n) ? 0 : Math.round(n * 100);
}

function NewListingPage() {
  // form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(""); // store as string for nicer UX
  const [sku, setSku] = useState("");
  const [enabled, setEnabled] = useState(true);

  // auto-generate slug when user types name (user can still edit slug)
  useEffect(() => {
    setSlug((prev) => (prev ? prev : slugify(name)));
  }, [name]);

  const createMutation = useCreateSellerProductMutation();

  const invalid = !name.trim() || !slug.trim() || dollarsToCents(price) <= 0;

  async function handleSubmit() {
    await createMutation.mutateAsync({
      input: {
        product: {
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || undefined,
          enabled,
        },
        variant: {
          sku: sku.trim() || undefined,
          price: dollarsToCents(price),
          // you can add stockOnHand / trackInventory later if desired
          enabled,
        },
      },
    });

    // reset
    setName("");
    setSlug("");
    setDescription("");
    setPrice("");
    setSku("");
    setEnabled(true);
    alert("Listing created!");
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <DropzoneButton />

      <h1 className="text-2xl font-bold">Create New Listing</h1>

      {/* Title */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Title</h2>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Book title"
        />
      </div>

      {/* Slug */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Slug</h2>
        <Input
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          placeholder="collected-poems-1920"
        />
        <p className="text-xs text-muted-foreground mt-1">
          URL key; must be unique.
        </p>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your item"
          rows={5}
        />
      </div>

      {/* Price */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Price (USD)</h2>
        <Input
          type="number"
          inputMode="decimal"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. 249.99"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Converted to cents for Vendure.
        </p>
      </div>

      {/* SKU */}
      <div>
        <h2 className="text-lg font-semibold mb-2">SKU (optional)</h2>
        <Input
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          placeholder="BOOK-1920-001"
        />
      </div>

      {/* Enabled */}
      <div className="flex items-center gap-2">
        <input
          id="enabled"
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        <label htmlFor="enabled">Enabled</label>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <Button
          onClick={handleSubmit}
          disabled={createMutation.isPending || invalid}
        >
          {createMutation.isPending ? "Listing..." : "List Item"}
        </Button>
        {createMutation.isError && (
          <p className="text-red-600 text-sm">
            {(createMutation.error as Error)?.message ?? "Something went wrong"}
          </p>
        )}
      </div>
    </div>
  );
}
