export function formatPrice(price: {
  __typename: string;
  value?: number;
  min?: number;
  max?: number;
}) {
  if (price.__typename === "SinglePrice" && price.value != null) {
    return `$${(price.value / 100).toFixed(2)}`;
  }
  if (
    price.__typename === "PriceRange" &&
    price.min != null &&
    price.max != null
  ) {
    if (price.min === price.max) {
      return `$${(price.min / 100).toFixed(2)}`;
    }
    return `$${(price.min / 100).toFixed(2)} – $${(price.max / 100).toFixed(2)}`;
  }
  return "N/A";
}
