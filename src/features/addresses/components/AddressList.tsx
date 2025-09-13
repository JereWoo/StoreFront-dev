// features/addresses/components/AddressList.tsx
import { useState } from "react";
import {
  UpdateCustomerAddressDocument,
  useAddressListQuery,
  useDeleteCustomerAddressMutation,
  useUpdateCustomerAddressMutation,
} from "@/generated/hooks";
import { vendureFetcher } from "@/api/vendure/fetcher";
import { AddressCard } from "./AddressCard";
import { AddAddressButton } from "./AddAddress";
import { AddressFormModal } from "./AddressFormModal";
import type {
  AddressListQuery,
  UpdateCustomerAddressMutation,
  UpdateCustomerAddressMutationVariables,
} from "@/generated/graphql";
import { toVendureAddress } from "@/lib/toVendureAddress.ts";
import type { AddressFormValues } from "./AddressForm";

type Address = NonNullable<
  AddressListQuery["activeCustomer"]
>["addresses"][number];

export function AddressList() {
  // React Query hook — note the client arg and isLoading/isError
  const { data, isLoading, isError, refetch } =
    useAddressListQuery(vendureFetcher);

  const deleteAddress = useDeleteCustomerAddressMutation(vendureFetcher);
  const updateAddress = useUpdateCustomerAddressMutation(vendureFetcher);
  const [editing, setEditing] = useState<Address | null>(null);

  const handleDelete = async (id: string) => {
    await deleteAddress.mutateAsync({ id });
    await refetch();
  };

  const handleSetDefault = async (id: string) => {
    await updateAddress.mutateAsync({
      input: { id, defaultShippingAddress: true },
    });
    await refetch();
  };
  async function handleSave(values: AddressFormValues, id?: string) {
    try {
      const input = toVendureAddress(values);

      if (id) {
        await vendureFetcher<
          UpdateCustomerAddressMutation,
          UpdateCustomerAddressMutationVariables
        >(UpdateCustomerAddressDocument, { input: { id, ...input } })();
      }

      await refetch();
      setEditing(null);
    } catch (err) {
      console.error("[AddressList] update failed", err);
    }
  }

  if (isLoading) return <p>Loading addresses…</p>;
  if (isError) return <p>Failed to load addresses.</p>;

  const addresses = data?.activeCustomer?.addresses ?? [];

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your Addresses</h2>
        <AddAddressButton onAdded={refetch} />
      </div>

      <div className="space-y-4">
        {addresses.map((addr) => (
          <AddressCard
            key={addr.id}
            address={addr}
            isDefault={addr.defaultShippingAddress}
            onEdit={() => setEditing(addr)}
            onDelete={() => handleDelete(addr.id)}
            onSetDefault={() => handleSetDefault(addr.id)}
          />
        ))}

        <AddressFormModal
          open={!!editing}
          onClose={() => setEditing(null)}
          initialValues={
            editing
              ? {
                  ...editing,
                  firstName: editing.fullName?.split(" ")[0] ?? "",
                  lastName:
                    editing.fullName?.split(" ").slice(1).join(" ") ?? "",
                }
              : undefined
          }
          onSubmit={(vals) => handleSave(vals, editing?.id)}
        />
      </div>
    </section>
  );
}
