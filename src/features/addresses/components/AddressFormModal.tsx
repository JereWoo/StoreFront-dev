// components/address/AddressFormModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/9ui/dialog.tsx";
import { AddressForm, AddressFormValues } from "./AddressForm.tsx";

type AddressFormModalProps = {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<AddressFormValues>;
  onSuccess?: () => void; // called after mutation completes
};

export function AddressFormModal({
  open,
  onClose,
  initialValues,
  onSuccess,
}: AddressFormModalProps) {
  // TODO: wire in generated mutation
  const [loading, setLoading] = useState(false);

  async function handleSubmit(values: AddressFormValues) {
    setLoading(true);
    try {
      // Placeholder for mutation
      console.log("Submitting address:", values);

      // Simulate API success
      await new Promise((r) => setTimeout(r, 500));

      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialValues ? "Edit Address" : "Add Address"}
          </DialogTitle>
        </DialogHeader>
        <AddressForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel={loading ? "Saving…" : "Save Address"}
        />
      </DialogContent>
    </Dialog>
  );
}
