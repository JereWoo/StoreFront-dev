// CheckoutForm.tsx
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";

export function CheckoutForm({ orderCode }: { orderCode: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${location.origin}/checkout/confirmation/${orderCode}`,
      },
    });

    if (result.error) {
      setErrorMessage(result.error.message ?? "Payment failed");
      setLoading(false);
    }
    // Success path is handled by Stripe redirect → your return_url page
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <PaymentElement />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="px-4 py-2 rounded bg-primary text-primary-foreground"
      >
        {loading ? "Processing…" : "Pay Now"}
      </button>
    </form>
  );
}
