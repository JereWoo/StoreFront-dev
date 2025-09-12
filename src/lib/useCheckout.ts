import {
  useAddItemToOrderMutation,
  useSetOrderShippingMethodMutation,
  useAddPaymentToOrderMutation,
} from "@/generated/hooks";

export function useCheckout() {
  const addItem = useAddItemToOrderMutation();
  const setShipping = useSetOrderShippingMethodMutation();
  const addPayment = useAddPaymentToOrderMutation();

  async function checkout({
    variantId,
    quantity,
    shippingMethodId,
    paymentMethodCode,
  }: {
    variantId: string;
    quantity: number;
    shippingMethodId: string;
    paymentMethodCode: string;
  }) {
    // 1. add item
    const itemRes = await addItem.mutateAsync({
      productVariantId: variantId,
      quantity,
    });
    if (itemRes.addItemToOrder.__typename === "ErrorResult") {
      throw new Error(itemRes.addItemToOrder.message);
    }

    // 2. shipping
    const shipRes = await setShipping.mutateAsync({
      shippingMethodId,
    });
    if (shipRes.setOrderShippingMethod.__typename === "ErrorResult") {
      throw new Error(shipRes.setOrderShippingMethod.message);
    }

    // 3. payment
    const payRes = await addPayment.mutateAsync({
      input: {
        method: paymentMethodCode,
        metadata: {},
      },
    });
    if (payRes.addPaymentToOrder.__typename === "ErrorResult") {
      throw new Error(payRes.addPaymentToOrder.message);
    }

    return payRes.addPaymentToOrder;
  }

  return { checkout, addItem, setShipping, addPayment };
}
