// features/addresses/components/AddressCard.tsx
import { Button } from "@/components/ui/9ui/button";
import type { AddressListQuery } from "@/generated/graphql";

type Address = NonNullable<
  AddressListQuery["activeCustomer"]
>["addresses"][number];

type Props = {
  address: Address;
  isDefault: boolean;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
};

export function AddressCard({
  address,
  isDefault,
  onEdit,
  onDelete,
  onSetDefault,
}: Props) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex justify-between items-start">
        <div className="text-sm space-y-0.5">
          <p className="font-medium">{address.fullName}</p>
          <p>{address.streetLine1}</p>
          {address.streetLine2 && <p>{address.streetLine2}</p>}
          <p>
            {address.city}, {address.province} {address.postalCode}
          </p>
          <p>{address.country.name}</p>
          {address.phoneNumber && <p>{address.phoneNumber}</p>}
        </div>
        {isDefault && (
          <span className="text-xs text-primary border px-2 py-1 rounded">
            Default
          </span>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onEdit(address)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(address.id)}
        >
          Delete
        </Button>
        {!isDefault && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onSetDefault(address.id)}
          >
            Set Default
          </Button>
        )}
      </div>
    </div>
  );
}
