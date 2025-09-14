// features/checkout/components/CheckoutAddressSection.tsx

import { useState } from "react";
import { AddressCard } from "@/features/addresses";
import { AddressList } from "@/features/addresses/components/AddressList";
import { AddressFormModal } from "@/features/addresses/components/AddressFormModal";

import type { AddressListQuery } from "@/generated/graphql";

// GraphQL type for an Address
type Address = NonNullable<
  AddressListQuery["activeCustomer"]
>["addresses"][number];

type Props = {
  orderAddress: Address | null;
  addresses: Address[];
  onSelect: (address: Address) => Promise<void>; // updates order
};

export function CheckoutAddressSection({
                                         orderAddress,
                                         addresses,
                                         onSelect,
                                       }: Props) {
  const [showList, setShowList] = useState(false);

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

      {!orderAddress ? (
        <button
          className="px-4 py-2 bg-emerald-700 text-white rounded-lg"
          onClick={() => setShowList(true)}
        >
          Select Address
        </button>
      ) : (
        <div>
          {/* Always show current order address */}
          <AddressCard
            address={orderAddress}
            isDefault={false} // never show default badge at checkout
            onEdit={() => setShowList(true)} // 👈 open list to change
            onDelete={() => {}}
            onSetDefault={() => {}}
          />
        </div>
      )}

      {/* Select address modal */}
      <AddressFormModal
        open={showList}
        title="Select Address"
        onClose={() => setShowList(false)}
      >
        <AddressList
          addresses={addresses}
          selectedAddressId={orderAddress?.id ?? null}
          onSelect={async (addr) => {
            await onSelect(addr); // update order shipping
            setShowList(false);   // close modal immediately
          }}
        />
      </AddressFormModal>
    </section>
  );
}
