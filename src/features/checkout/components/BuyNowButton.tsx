import { Button } from "@/components/ui/9ui/button.tsx";
import { useNavigate } from "@tanstack/react-router";
import { Route as CheckoutRoute } from "@/routes/_layout/checkout.tsx";
import {
  useAddItemToOrderMutation,
  useActiveCustomerQuery,
  useSetOrderShippingAddressMutation,
  useRemoveAllOrderLinesMutation,
} from "@/generated/hooks.ts";
import { toVendureAddress } from "@/lib/toVendureAddress.ts";

type BuyNowButtonProps = {
  productId: string;
  variantId: string;
};

export function BuyNowButton({ productId, variantId }: BuyNowButtonProps) {
  const navigate = useNavigate();
  const { data } = useActiveCustomerQuery();
  const removeAll = useRemoveAllOrderLinesMutation();
  const addItemToOrder = useAddItemToOrderMutation();
  const setOrderShippingAddress = useSetOrderShippingAddressMutation();

  const handleBuyNow = async () => {
    try {
      // clear cart
      await removeAll.mutateAsync({});

      // add this one variant
      const result = await addItemToOrder.mutateAsync({
        productVariantId: variantId,
        quantity: 1,
      });

      const added = result?.addItemToOrder;

      if (added?.__typename === "Order") {
        // set default shipping if available
        const defaultAddress = data?.activeCustomer?.addresses?.find(
          (a) => a.defaultShippingAddress === true,
        );

        if (defaultAddress) {
          await setOrderShippingAddress.mutateAsync({
            input: toVendureAddress(defaultAddress)

          });
        }
      }

      // go to checkout
      navigate({ to: CheckoutRoute.to, search: { variantId, productId } });
    } catch (err) {
      console.error("Buy now failed", err);
    }
  };

  return <Button onClick={handleBuyNow}>Buy Now</Button>;
}