import { Card } from "@/components/ui/9ui/card";
import { useActiveOrderQuery } from "@/generated/hooks";
import type { ActiveOrderQuery } from "@/generated/graphql";
import { Loader2 } from "lucide-react";

export function OrderSummaryCard() {
  const { data, isLoading, error } = useActiveOrderQuery();

  if (isLoading) {
    return (
      <Card className="p-4 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
        <span className="ml-2 text-sm">Loading order…</span>
      </Card>
    );
  }

  if (error || !data?.activeOrder) {
    return (
      <Card className="p-4">
        <p className="text-sm text-gray-500">No active order.</p>
      </Card>
    );
  }

  const order = data.activeOrder;

  return (
    <Card className="p-4 space-y-4">
      <h2 className="font-semibold text-lg">Order Summary</h2>

      <div className="divide-y">
        {order.lines.map(
          (line: ActiveOrderQuery["activeOrder"]["lines"][0]) => (
            <div
              key={line.id}
              className="flex items-center justify-between py-3"
            >
              {/* Image */}
              {line.featuredAsset?.preview && (
                <img
                  src={line.featuredAsset.preview}
                  alt={line.productVariant.name}
                  className="w-12 h-12 object-contain rounded border mr-3"
                />
              )}

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-sm">
                  {line.productVariant.name}
                </p>
                <p className="text-xs text-gray-500">Qty {line.quantity}</p>
              </div>

              {/* Price */}
              <span className="font-medium text-sm">
                ${(line.linePriceWithTax / 100).toFixed(2)}
              </span>
            </div>
          ),
        )}
      </div>

      {/* Totals */}
      <div className="space-y-1 text-sm border-t pt-3">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${(order.subTotalWithTax / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${(order.shippingWithTax / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${(order.totalWithTax / 100).toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
}
