import { ProductSearchItemFieldsFragment } from "@/generated/graphql";

export function ListingRow({
  listing,
}: {
  listing: ProductSearchItemFieldsFragment;
}) {
  return (
    <div className="flex items-center gap-4 border-b py-3 hover:bg-gray-50">
      <img
        src={`${listing.productAsset?.preview}?preset=large`}
        alt={listing.productName}
        className="w-16 h-16 object-contain"
      />
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{listing.productName}</div>
        <div className="text-sm text-gray-500">Slug: {listing.slug} • USA</div>
      </div>
      <div className="font-bold">$—</div>
    </div>
  );
}
