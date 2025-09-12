import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/9ui/dialog";
import { Button } from "@/components/ui/9ui/button";
import { useState } from "react";
import { useCheckout } from "@/lib/useCheckout"; // 👈 new import

// fake shipping + payment options
const shippingOptions = [
  { id: "flat", label: "Flat Rate - $5.00" },
  { id: "express", label: "Express - $15.00" },
];
const paymentMethods = [
  { id: "card", label: "Credit Card" },
  { id: "paypal", label: "PayPal" },
];

export function CheckoutDialog({
  productId,
  variantId,
  onClose,
}: {
  productId: string;
  variantId: string;
  onClose: () => void;
}) {
  const [shipping, setShipping] = useState<string>(shippingOptions[0].id);
  const [payment, setPayment] = useState<string>(paymentMethods[0].id);
  const [loading, setLoading] = useState(false);

  const { checkout } = useCheckout(); // 👈 hook

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const order = await checkout({
        variantId,
        quantity: 1,
        shippingMethodId: shipping,
        paymentMethodCode: payment,
      });

      console.log("✅ Order placed:", order);
      alert("Order placed successfully!");
      onClose();
    } catch (err) {
      console.error("Checkout error", err);
      alert("Something went wrong: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
        </DialogHeader>

        {/* Shipping */}
        <div className="space-y-2">
          <label className="font-medium text-sm">Shipping</label>
          {shippingOptions.map((opt) => (
            <div key={opt.id}>
              <input
                type="radio"
                id={opt.id}
                checked={shipping === opt.id}
                onChange={() => setShipping(opt.id)}
              />
              <label htmlFor={opt.id} className="ml-2">
                {opt.label}
              </label>
            </div>
          ))}
        </div>

        {/* Payment */}
        <div className="space-y-2 mt-4">
          <label className="font-medium text-sm">Payment</label>
          {paymentMethods.map((opt) => (
            <div key={opt.id}>
              <input
                type="radio"
                id={opt.id}
                checked={payment === opt.id}
                onChange={() => setPayment(opt.id)}
              />
              <label htmlFor={opt.id} className="ml-2">
                {opt.label}
              </label>
            </div>
          ))}
        </div>

        {/* Action */}
        <div className="mt-6 flex justify-end">
          <Button onClick={handleCheckout} disabled={loading}>
            {loading ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
