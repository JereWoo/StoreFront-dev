import type {
  ActiveCustomerQuery,
  CreateAddressInput,
} from "@/generated/graphql";
import type { AddressFormValues } from "@/features/addresses/components/AddressForm";

type CustomerAddress = NonNullable<
  ActiveCustomerQuery["activeCustomer"]
>["addresses"][number];

/**
 * Normalize either form values or an existing customer address
 * into a CreateAddressInput for Vendure mutations.
 */
export function toVendureAddress(
  source: AddressFormValues | CustomerAddress,
): CreateAddressInput {
  // Case 1: Form values → build fullName
  if ("firstName" in source || "lastName" in source) {
    const { firstName, lastName, ...rest } = source;
    return {
      ...rest,
      fullName: [firstName, lastName].filter(Boolean).join(" ").trim(),
    };
  }

  // Case 2: Existing customer address → flatten country + drop flags
  return {
    fullName: source.fullName,
    company: source.company ?? "",
    streetLine1: source.streetLine1,
    streetLine2: source.streetLine2 ?? "",
    city: source.city,
    province: source.province ?? "",
    postalCode: source.postalCode ?? "",
    countryCode: source.country.code,
    phoneNumber: source.phoneNumber ?? "",
  };
}
