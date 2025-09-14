// features/addresses/components/AddressCard.tsx
import { Button } from "@/components/ui/9ui/button";
import type { AddressListQuery, ActiveOrderQuery } from "@/generated/graphql";

type CustomerAddress = NonNullable<
  AddressListQuery["activeCustomer"]
>["addresses"][number];

type OrderAddress = NonNullable<ActiveOrderQuery["activeOrder"]>["shippingAddress"];

// Props allow either type
type Props = {
  address: CustomerAddress | OrderAddress | null | undefined;
  isDefault?: boolean;
  onEdit?: (address: CustomerAddress | OrderAddress) => void;
  onDelete?: (id: string) => void;
  onSetDefault?: (id: string) => void;
};

export function AddressCard({
                              address,
                              isDefault,
                              onEdit,
                              onDelete,
                              onSetDefault,
                            }: Props) {
  if (!address) {
    return <p className="text-sm text-gray-500">No address selected</p>;
  }

  // Normalize fields between CustomerAddress and OrderAddress
  const fullName =
    (address as any).fullName ??
    [ (address as any).firstName, (address as any).lastName ]
      .filter(Boolean)
      .join(" ")
      .trim();

  const street1 = (address as any).streetLine1 ?? "";
  const street2 = (address as any).streetLine2 ?? "";

  const city = (address as any).city ?? "";
  const province = (address as any).province ?? "";
  const postalCode = (address as any).postalCode ?? "";

  const country =
    (address as any).country?.name ??
    (address as any).countryCode ??
    "";

  const phoneNumber = (address as any).phoneNumber ?? "";

  // id only exists on CustomerAddress
  const id = (address as any).id;

  return (
    <div>
      <div className="flex justify-between items-start">
        <div className="text-sm space-y-0.5">
          <p className="font-medium">{fullName}</p>
          <p>{street1}</p>
          {street2 && <p>{street2}</p>}
          <p>
            {city}, {province} {postalCode}
          </p>
          <p>{country}</p>
          {phoneNumber && <p>{phoneNumber}</p>}
        </div>
        {isDefault && (
          <span className="text-xs text-primary border px-2 py-1 rounded">
            Default
          </span>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        {onEdit && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEdit(address)}
          >
            Edit
          </Button>
        )}
        {onDelete && id && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(id)}
          >
            Delete
          </Button>
        )}
        {onSetDefault && id && !isDefault && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onSetDefault(id)}
          >
            Set Default
          </Button>
        )}
      </div>
    </div>
  );
}
