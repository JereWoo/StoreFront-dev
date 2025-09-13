// components/address/AddressList.tsx
import { AddressCard } from "./AddressCard.tsx";

type Address = {
  id: string;
  fullName: string;
  streetLine1: string;
  streetLine2?: string | null;
  city: string;
  province?: string | null;
  postalCode: string;
  country: { id: string; code: string; name: string };
  phoneNumber?: string | null;
};

type AddressListProps = {
  addresses: Address[];
  defaultId: string | null;
  onEdit?: (address: Address) => void;
  onDelete?: (id: string) => void;
  onSetDefault?: (id: string) => void;
};

export function AddressList({
  addresses,
  defaultId,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressListProps) {
  if (addresses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No addresses saved yet.</p>
    );
  }

  return (
    <div className="grid gap-4">
      {addresses.map((addr) => (
        <AddressCard
          key={addr.id}
          address={addr}
          isDefault={addr.id === defaultId}
          onEdit={() => onEdit?.(addr)}
          onDelete={() => onDelete?.(addr.id)}
          onSetDefault={() => onSetDefault?.(addr.id)}
        />
      ))}
    </div>
  );
}
