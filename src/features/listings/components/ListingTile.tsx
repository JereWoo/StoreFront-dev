import { Link } from "@tanstack/react-router";
import { ProductSearchItemFieldsFragment } from "@/generated/graphql";

export function ListingTile({
  listing,
}: {
  listing: ProductSearchItemFieldsFragment;
}) {
  return (
    <Link
      to="/listing/$id"
      params={{ id: listing.productId, slug: listing.slug }}
      className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
    >
      <div className="aspect-square w-full bg-gray-50 flex items-center justify-center">
        <img
          src={`${listing.productAsset?.preview}?preset=large`}
          alt={listing.productName}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="p-3">
        <div className="font-medium text-sm line-clamp-2">
          {listing.productName}
        </div>
        <div className="text-xs text-gray-500 mb-1">{listing.slug}</div>
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
