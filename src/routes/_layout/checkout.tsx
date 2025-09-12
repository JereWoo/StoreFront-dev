import { createFileRoute } from "@tanstack/react-router";
import { useEligibleShippingMethodsQuery } from "@/generated/hooks";
import { Button } from "@/components/ui/9ui/button";
import { AddressForm } from "@/components/ui/composites/AddressForm.tsx";

export const Route = createFileRoute("/_layout/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { data, isLoading, error } = useEligibleShippingMethodsQuery();

  if (isLoading) return <p>Loading checkout…</p>;
  if (error) return <p>Error loading checkout: {error.message}</p>;

  // Flat rate shipping for now
  const shippingMethod = data?.eligibleShippingMethods?.[0];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {/* Address section (already set by BuyNowButton, allow editing later) */}

      <section>
        <h2 className="text-xl mb-2">Shipping Address</h2>

        {/* TODO: display current address + “Change” option */}
        <AddressForm
          submitLabel="Use this address"
          onSubmit={(values) => {
            console.log("Submitted address:", values);
            // TODO: call useSetOrderShippingAddressMutation({ input: values })
          }}
        />
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

      {/* Payment placeholder */}
      <section>
        <h2 className="text-xl mb-2">Payment</h2>
        <Button disabled>Stripe Integration Coming Soon</Button>
      </section>
    </div>
  );
}
