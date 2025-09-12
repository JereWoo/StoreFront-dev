// StripePayments.tsx
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

type StripePaymentsProps = {
  clientSecret: string;
  orderCode: string;
};

export function StripePayments({
  clientSecret,
  orderCode,
}: StripePaymentsProps) {
  const options = { clientSecret };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm orderCode={orderCode} />
    </Elements>
  );
}
