import {
  useActiveCustomerQuery,
  useSetOrderShippingAddressMutation,
} from "@/generated/hooks";
import { toVendureAddress } from "@/lib/toVendureAddress.ts";

export function UseDefaultShippingButton() {
  const { data } = useActiveCustomerQuery();
  const setOrderShippingAddress = useSetOrderShippingAddressMutation();

  const address = data?.activeCustomer?.addresses.find(
    (a) => a.defaultShippingAddress

);

  if (!address) return "fuck"

  return (
    <button
      type="button"
      disabled={setOrderShippingAddress.isPending}
      onClick={() =>
        setOrderShippingAddress.mutate({
          input: toVendureAddress(address),
        })
      }
      className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      Use Default Shipping
    </button>
  );
}
