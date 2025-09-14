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

type AddressListProps = {
  onSelect?: (address: Address) => void; // 👈 click-to-select
  selectedAddressId?: string | null;     // 👈 highlight currently active
};

export function AddressList({ onSelect, selectedAddressId }: AddressListProps) {
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

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            onClick={() => onSelect?.(addr)} // 👈 click selects & closes modal
            className={`cursor-pointer rounded-lg border p-3 transition
              ${selectedAddressId === addr.id
              ? "border-emerald-600 bg-emerald-50"
              : "border-gray-200 hover:border-emerald-400"}`}
          >
            <AddressCard
              address={addr}
              isDefault={addr.defaultShippingAddress}
              onEdit={() => setEditing(addr)}
              onDelete={() => handleDelete(addr.id)}
              onSetDefault={() => handleSetDefault(addr.id)}
            />
            {selectedAddressId === addr.id && (
              <p className="mt-1 text-xs text-emerald-700 font-medium">
                Selected
              </p>
            )}
          </div>
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
