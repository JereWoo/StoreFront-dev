// CheckoutPage.tsx

import { createFileRoute } from "@tanstack/react-router";
import {
  useEligibleShippingMethodsQuery,
  useSetOrderShippingAddressMutation,
  useSetOrderShippingMethodMutation,
  useCreateStripePaymentIntentMutation,
  useActiveOrderQuery,
  useActiveCustomerQuery, // 👈 new
} from "@/generated/hooks";

import { AddressForm } from "@/features/addresses/components/AddressForm.tsx";
import { AddressCard } from "@/features/addresses/components/AddressCard.tsx"; // 👈 reuse
import { AddressFormModal } from "@/features/addresses/components/AddressFormModal.tsx"; // 👈 reuse
import { AddressList } from "@/features/addresses/components/AddressList.tsx"; // 👈 reuse

import { toVendureAddress } from "@/lib/toVendureAddress.ts";
import { StripePayments } from "@/features/checkout/components/StripePayments.tsx";
import { useState } from "react";
import type { AddressFormValues } from "@/features/addresses/components/AddressForm.tsx";
import { OrderSummaryCard } from "@/features/checkout";

export const Route = createFileRoute("/_layout/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { data: activeOrderData } = useActiveOrderQuery({});
  const { data: customerData, refetch: refetchCustomer } =
    useActiveCustomerQuery({}); // 👈 pull saved addresses
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
  const [showAddressForm, setShowAddressForm] = useState(false); // 👈 toggle form
  const orderCode = activeOrderData?.activeOrder?.code ?? "";

  if (isLoading) return <p>Loading checkout…</p>;
  if (error) return <p>Error loading checkout: {error.message}</p>;

  const shippingMethod = shippingData?.eligibleShippingMethods?.[0];
  const addresses = customerData?.activeCustomer?.addresses ?? [];
  const defaultAddress =
    addresses.find((a) => a.defaultShippingAddress) ?? addresses[0];

  async function handleAddressSubmit(values: AddressFormValues) {
    const input = toVendureAddress(values);

    try {
      const addrResult = await setOrderShippingAddress({ input });
      console.log("Address set:", addrResult);

      if (!shippingMethod) {
        console.error("No eligible shipping methods found!");
        return;
      }
      await setOrderShippingMethod({
        shippingMethodId: [shippingMethod.id],
      });

      const intentResult = await createStripePaymentIntent({});
      const secret = intentResult.createStripePaymentIntent;
      if (secret) setClientSecret(secret);
      await refetchCustomer();
      setShowAddressForm(false);
    } catch (err) {
      console.error("Checkout error:", err);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <OrderSummaryCard />

      {/* Shipping Address */}
      <section>
        <h2 className="text-xl mb-2">Shipping Address</h2>
        {addresses.length === 0 || showAddressForm ? (
          <AddressForm
            submitLabel="Save Address"
            onSubmit={handleAddressSubmit}
          />
        ) : (
          <div>
            <AddressCard
              address={defaultAddress}
              isDefault
              onEdit={() => setShowAddressForm(true)}
              onDelete={() => {
                /* optional: delete flow */
              }}
              onSetDefault={() => {
                /* already default */
              }}
            />
            <button
              className="mt-2 text-emerald-700 underline"
              onClick={() => setShowAddressForm(true)}
            >
              Change address
            </button>
          </div>
        )}
      </section>

      {/* Shipping method */}
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

      {/* Payment */}
      {clientSecret && (
        <section>
          <h2 className="text-xl mb-2">Payment</h2>
          <StripePayments clientSecret={clientSecret} orderCode={orderCode} />
        </section>
      )}
    </div>
  );
}
