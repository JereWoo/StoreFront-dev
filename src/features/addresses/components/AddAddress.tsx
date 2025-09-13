// features/addresses/components/AddAddressButton.tsx
import { useState } from "react";
import { Button } from "@/components/ui/9ui/button";
import { AddressFormModal } from "./AddressFormModal";
import { toVendureAddress } from "@/lib/toVendureAddress";

import {
  CreateCustomerAddressDocument,
  CreateCustomerAddressMutation,
  CreateCustomerAddressMutationVariables,
} from "@/generated/graphql";
import { vendureFetcher } from "@/api/vendure/fetcher";
import { AddressFormValues } from "@/features/addresses/components/AddressForm.tsx";

type AddAddressButtonProps = {
  onAdded?: () => void; // callback to trigger refetch in parent
};

export function AddAddressButton({ onAdded }: AddAddressButtonProps) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(values: AddressFormValues) {
    console.log("[AddAddressButton] form submit fired", values); // debug log

    try {
      const input = toVendureAddress(values);

      await vendureFetcher<
        CreateCustomerAddressMutation,
        CreateCustomerAddressMutationVariables
      >(CreateCustomerAddressDocument, { input })();

      console.log("[AddAddressButton] mutation complete");

      setOpen(false); // close modal only after success
      onAdded?.(); // refetch list
    } catch (err) {
      console.error("[AddAddressButton] Failed to create address", err);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add New Address</Button>
      <AddressFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
