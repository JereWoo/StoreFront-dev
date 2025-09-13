import { ProductSearchItemFieldsFragment } from "@/generated/graphql";
import { Link } from "@tanstack/react-router";
import { formatPrice } from "@/lib/formatPrice";
export function ListingRow({
  listing,
}: {
  listing: ProductSearchItemFieldsFragment;
}) {
  const price = formatPrice(listing.priceWithTax);

  return (
    <Link
      to="/listing/$id"
      params={{ id: listing.productId, slug: listing.slug }}
      className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
    >
      <div className="flex items-center gap-4 border-b py-3 hover:bg-gray-50">
        <img
          src={`${listing.productAsset?.preview}?preset=large`}
          alt={listing.productName}
          className="w-16 h-16 object-contain"
        />
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{listing.productName}</div>
          <div className="text-sm text-gray-500">
            Slug: {listing.slug} • USA
          </div>
        </div>
        {price !== null ? (
          <div className="font-bold mr-4 text-emerald-700">{price}</div>
        ) : (
          <div className="text-gray-400">N/A</div>
        )}
      </div>
    </Link>
  );
}
