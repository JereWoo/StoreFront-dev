import { Button } from "@/components/ui/9ui/button.tsx";
import { useNavigate } from "@tanstack/react-router";
import { Route as CheckoutRoute } from "@/routes/_layout/checkout.tsx";
import {
  useAddItemToOrderMutation,
  useActiveCustomerQuery,
  useSetOrderShippingAddressMutation,
} from "@/generated/hooks.ts";

type BuyNowButtonProps = {
  productId: string;
  variantId: string;
};

export function BuyNowButton({ productId, variantId }: BuyNowButtonProps) {
  const navigate = useNavigate();

  const { data } = useActiveCustomerQuery(); // gets customer + addresses
  const addItemToOrder = useAddItemToOrderMutation();
  const setOrderShippingAddress = useSetOrderShippingAddressMutation();

  async function handleBuyNow() {
    const result = await addItemToOrder.mutateAsync({
      productVariantId: variantId,
      quantity: 1,
    });

    const added = result?.addItemToOrder;

    if (added?.__typename === "Order") {
      const defaultAddress = data?.activeCustomer?.addresses?.find(
        (a) => a.defaultShippingAddress === true,
      );

      if (defaultAddress) {
        await setOrderShippingAddress.mutateAsync({
          input: {
            fullName: defaultAddress.fullName,
            streetLine1: defaultAddress.streetLine1,
            streetLine2: defaultAddress.streetLine2 || "",
            city: defaultAddress.city,
            postalCode: defaultAddress.postalCode,
            countryCode: defaultAddress.country.code,
            phoneNumber: defaultAddress.phoneNumber || "",
          },
        });
      }

      console.log("navigating to checkout", { variantId, productId });
      navigate({ to: CheckoutRoute.to, search: { variantId, productId } });
    } else {
      console.log("navigating to checkout", { variantId, productId });
      navigate({ to: CheckoutRoute.to, search: { variantId, productId } });
    }
  }
  return <Button onClick={handleBuyNow}>Buy Now</Button>;
}
