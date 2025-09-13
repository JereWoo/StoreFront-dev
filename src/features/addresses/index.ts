// features/account/addresses/index.ts

// Components you want to expose
export { AddressCard } from "./components/AddressCard.tsx";
export { AddressForm } from "./components/AddressForm.tsx";
export { AddressFormModal } from "./components/AddressFormModal.tsx";
export { AddressList } from "./components/AddressList.tsx";
export { ShipToCard } from "../checkout/components/ShipToCard.tsx";

// If you want to re-export hooks later, you can do that too:
// export { useShippingAddressesQuery } from "@/generated/graphql";

// ⚠️ Notice: we are NOT exporting queries/mutations directly.
// They stay internal to the feature and only surface via generated hooks.
