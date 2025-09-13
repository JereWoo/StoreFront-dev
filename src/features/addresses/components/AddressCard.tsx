// components/address/AddressCard.tsx
import { Button } from "@/components/ui/9ui/button.tsx";

export function AddressCard({
  address,
  isDefault,
  onEdit,
  onDelete,
  onSetDefault,
}) {
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
        <Button variant="outline" size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          Delete
        </Button>
        {!isDefault && (
          <Button variant="secondary" size="sm" onClick={onSetDefault}>
            Set Default
          </Button>
        )}
      </div>
    </div>
  );
}
