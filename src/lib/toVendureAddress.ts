import type { AddressFormValues } from "@/components/ui/composites/AddressForm";
import type { CreateAddressInput } from "@/generated/graphql";

export function toVendureAddress(
  values: AddressFormValues,
): CreateAddressInput {
  const { firstName, lastName, ...rest } = values;

  return {
    ...rest, // TS will check this against CreateAddressInput
    fullName: [firstName, lastName].filter(Boolean).join(" ").trim(),
  };
}
