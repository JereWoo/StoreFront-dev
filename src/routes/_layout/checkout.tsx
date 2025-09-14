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

import {
  AddressForm,
  AddressCard,

} from "@/features/addresses";

import { AddressFormModal } from "@/features/addresses/components/AddressFormModal.tsx"; // 👈 reuse
import { AddressList } from "@/features/addresses/components/AddressList.tsx"; // 👈 reuse

import { toVendureAddress } from "@/lib/toVendureAddress.ts";
import { StripePayments } from "@/features/checkout/components/StripePayments.tsx";
import { useState } from "react";
import type { AddressFormValues } from "@/features/addresses/components/AddressForm.tsx";
import type { ActiveCustomerQuery } from "@/generated/graphql";

import { OrderSummaryCard } from "@/features/checkout";
import { CheckoutAddressSection } from "@/features/checkout/components/CheckoutAddressSection.tsx";
import { queryClient } from "@/lib/utils.ts";

type CustomerAddress = NonNullable<
  ActiveCustomerQuery["activeCustomer"]
>["addresses"][number];

export const Route = createFileRoute("/_layout/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { data: activeOrderData, refetch: refetchOrder } = useActiveOrderQuery({});
  const { data: customerData, refetch: refetchCustomer } = useActiveCustomerQuery({});
  const {
    data: shippingData,
    isLoading,
    error,
    refetch: refetchShippingMethods
  } = useEligibleShippingMethodsQuery({});

  const { mutateAsync: setOrderShippingAddress } = useSetOrderShippingAddressMutation();
  const { mutateAsync: setOrderShippingMethod } = useSetOrderShippingMethodMutation();
  const { mutateAsync: createStripePaymentIntent } = useCreateStripePaymentIntentMutation();

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const [showAddressForm, setShowAddressForm] = useState(false); // 👈 toggle form

  const orderCode = activeOrderData?.activeOrder?.code ?? "";
  const orderAddress = activeOrderData?.activeOrder?.shippingAddress ?? null;
  const hasAddress = !!activeOrderData?.activeOrder?.shippingAddress;
  const hasMethod = !!activeOrderData?.activeOrder?.shippingLines?.length;




  if (isLoading) return <p>Loading checkout…</p>;
  if (error) return <p>Error loading checkout: {error.message}</p>;

  const shippingMethod = shippingData?.eligibleShippingMethods?.[0];
  const addresses = customerData?.activeCustomer?.addresses ?? [];

  async function handleSetOrderAddress(source: AddressFormValues | CustomerAddress) {
    try {
      const input = toVendureAddress(source);
      await setOrderShippingAddress({ input });
      await setOrderShippingMethod({ shippingMethodId: [shippingMethod?.id ?? ""] });
      // TODO: Transition to payment arrangements
      await queryClient.invalidateQueries({ queryKey: ["ActiveOrder"] });
      //await Promise.all([refetchOrder(), refetchShippingMethods()]);
      console.log("Order address set:", input.fullName);
    } catch (err) {
      console.error("Failed to set order address:", err);
    }
  }



//  const defaultAddress = addresses.find((a) => a.defaultShippingAddress) ?? addresses[0];
/*
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

      await refetchCustomer();
      setShowAddressForm(false);
    } catch (err) {
      console.error("Checkout error:", err);
    }
  }

*/
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <OrderSummaryCard />

      <CheckoutAddressSection
        orderAddress={orderAddress}
        addresses={addresses}
        onSelect={handleSetOrderAddress}
      />

      {hasAddress && hasMethod && !clientSecret && (
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg"
            onClick={async () => {
              try {
                const intentResult = await createStripePaymentIntent({});
                const secret = intentResult.createStripePaymentIntent;
                if (secret) {
                  setClientSecret(secret);
                }
              } catch (err) {
                console.error("Failed to create payment intent:", err);
              }
            }}
          >
            Continue to Payment
          </button>
        </div>
      )}


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