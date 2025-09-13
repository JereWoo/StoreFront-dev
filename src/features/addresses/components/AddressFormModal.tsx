// features/addresses/components/AddressFormModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/9ui/dialog";
import { AddressForm, AddressFormValues } from "./AddressForm";

type AddressFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddressFormValues) => void;
  initialValues?: Partial<AddressFormValues>;
};

export function AddressFormModal({
  open,
  onClose,
  onSubmit,
  initialValues,
}: AddressFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialValues ? "Edit Address" : "Add Address"}
          </DialogTitle>
        </DialogHeader>

        <AddressForm
          initialValues={initialValues}
          onSubmit={(vals) => {
            onSubmit(vals); // forward up to AddAddressButton
            // ❗️only close AFTER the mutation, not before
          }}
          submitLabel={initialValues ? "Save Changes" : "Save Address"}
        />
      </DialogContent>
    </Dialog>
  );
}
