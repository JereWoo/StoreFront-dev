// features/addresses/components/AddressFormModal.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/9ui/dialog";
import { AddressForm, AddressFormValues } from "./AddressForm";
import { ReactNode } from "react";

type AddressFormModalProps = {
  open: boolean; // 👈 always required
  onClose: () => void;
  title?: string;

  // For direct AddressForm usage
  onSubmit?: (values: AddressFormValues) => void;
  initialValues?: Partial<AddressFormValues>;

  // For custom content (e.g. AddressList)
  children?: ReactNode;
};

export function AddressFormModal({
                                   open,
                                   onClose,
                                   title,
                                   onSubmit,
                                   initialValues,
                                   children,
                                 }: AddressFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title ??
              (initialValues ? "Edit Address" : "Add Address")}
          </DialogTitle>
        </DialogHeader>

        {children ? (
          children
        ) : (
          <AddressForm
            initialValues={initialValues}
            onSubmit={(vals) => {
              onSubmit?.(vals);
            }}
            submitLabel={initialValues ? "Save Changes" : "Save Address"}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
