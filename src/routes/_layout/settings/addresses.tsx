// routes/_layout/settings/address.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useAddressListQuery } from "@/generated/hooks";
import { AddressList } from "@/features/addresses/";

export const Route = createFileRoute("/_layout/settings/addresses")({
  component: AddressPage,
});

function AddressPage() {
  const { data, loading } = useAddressListQuery();

  if (loading) return <p>Loading addresses…</p>;
  const customer = data?.activeCustomer;
  if (!customer) return <p>No customer found.</p>;

  return (
    <div>
      <AddressList
        addresses={customer.addresses ?? []}
        defaultId={customer.defaultShippingAddress?.id ?? null}
      />
    </div>
  );
}
