import { createFileRoute } from "@tanstack/react-router";
import {
  useEligibleShippingMethodsQuery,
  useSetOrderShippingAddressMutation,
  useSetOrderShippingMethodMutation,
  useCreateStripePaymentIntentMutation,
  useActiveOrderQuery,
} from "@/generated/hooks";

import { AddressForm } from "@/features/addresses/components/AddressForm.tsx";
import { toVendureAddress } from "@/lib/toVendureAddress.ts";
import { StripePayments } from "@/components/ui/composites/StripePayments";
import { useState } from "react";
import type { AddressFormValues } from "@/features/addresses/components/AddressForm.tsx";

export const Route = createFileRoute("/_layout/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { data: activeOrderData } = useActiveOrderQuery({});
  const {
    data: shippingData,
    isLoading,
    error,
  } = useEligibleShippingMethodsQuery({});

  const { mutateAsync: setOrderShippingAddress } =
    useSetOrderShippingAddressMutation();
  const { mutateAsync: setOrderShippingMethod } =
    useSetOrderShippingMethodMutation();
  const { mutateAsync: createStripePaymentIntent } =
    useCreateStripePaymentIntentMutation();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const orderCode = activeOrderData?.activeOrder?.code ?? "";

  if (isLoading) return <p>Loading checkout…</p>;
  if (error) return <p>Error loading checkout: {error.message}</p>;

  const shippingMethod = shippingData?.eligibleShippingMethods?.[0];

  async function handleAddressSubmit(values: AddressFormValues) {
    const input = toVendureAddress(values);

    try {
      // 1. Save shipping address
      const addrResult = await setOrderShippingAddress({ input });
      console.log("Address set:", addrResult);

      // 2. Apply first eligible shipping method
      if (!shippingMethod) {
        console.error("No eligible shipping methods found!");
        return;
      }
      const shipResult = await setOrderShippingMethod({
        shippingMethodId: [shippingMethod.id],
      });
      console.log("Shipping set:", shipResult);

      // 3. Create Stripe PaymentIntent
      const intentResult = await createStripePaymentIntent({});
      console.log("Payment intent result:", intentResult);

      const secret = intentResult.createStripePaymentIntent;
      if (secret) {
        setClientSecret(secret);
        console.log("Got clientSecret:", secret);
      } else {
        console.error("No clientSecret returned from Vendure/Stripe");
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {/* Address section */}
      <section>
        <h2 className="text-xl mb-2">Shipping Address</h2>
        <AddressForm submitLabel="Done" onSubmit={handleAddressSubmit} />
      </section>

      {/* Shipping method (flat rate for now) */}
      <section>
        <h2 className="text-xl mb-2">Shipping Method</h2>
        {shippingMethod ? (
          <p>
            {shippingMethod.name} – {shippingMethod.description} ($
            {shippingMethod.price / 100})
          </p>
        ) : (
          <p>No shipping methods available</p>
        )}
      </section>

      {/* Payment step */}
      {clientSecret && (
        <section>
          <h2 className="text-xl mb-2">Payment</h2>
          <StripePayments clientSecret={clientSecret} orderCode={orderCode} />
        </section>
      )}
    </div>
  );
}
