import { useState } from "react";
import { Button } from "@/components/ui/9ui/button";
import { FloatingInput } from "./FloatingInput";
import { PhoneInput } from "@/components/ui/9ui/phone-input"; // adjust path if needed
import { Checkbox } from "@/components/ui/9ui/checkbox";
import { Label } from "@/components/ui/9ui/label";

export type AddressFormValues = {
  firstName: string;
  lastName: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  province?: string;
  postalCode: string;
  countryCode: string;
  phoneNumber?: string;
  saveForLater?: boolean;
  makeDefault?: boolean;
};

type AddressFormProps = {
  initialValues?: Partial<AddressFormValues>;
  onSubmit: (values: AddressFormValues) => void;
  submitLabel?: string;
};

export function AddressForm({
  initialValues,
  onSubmit,
  submitLabel = "Save Address",
}: AddressFormProps) {
  const [values, setValues] = useState<AddressFormValues>({
    firstName: initialValues?.firstName ?? "",
    lastName: initialValues?.lastName ?? "",
    streetLine1: initialValues?.streetLine1 ?? "",
    streetLine2: initialValues?.streetLine2 ?? "",
    city: initialValues?.city ?? "",
    province: initialValues?.province ?? "",
    postalCode: initialValues?.postalCode ?? "",
    countryCode: initialValues?.countryCode ?? "US",
    phoneNumber: initialValues?.phoneNumber ?? "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 p-4 rounded-lg border bg-card"
    >
      <div className="grid grid-cols-2 gap-4">
        <FloatingInput
          id="firstName"
          name="firstName"
          label="First Name"
          value={values.firstName}
          onChange={handleChange}
          required
        />
        <FloatingInput
          id="lastName"
          name="lastName"
          label="Last Name"
          value={values.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <FloatingInput
        id="streetLine1"
        name="streetLine1"
        label="Street Address"
        value={values.streetLine1}
        onChange={handleChange}
        required
      />

      <FloatingInput
        id="streetLine2"
        name="streetLine2"
        label="Address Line 2"
        value={values.streetLine2}
        onChange={handleChange}
      />

      <div className="grid grid-cols-2 gap-4">
        <FloatingInput
          id="city"
          name="city"
          label="City"
          value={values.city}
          onChange={handleChange}
          required
        />
        <FloatingInput
          id="province"
          name="province"
          label="State / Province"
          value={values.province}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FloatingInput
          id="postalCode"
          name="postalCode"
          label="Postal Code"
          value={values.postalCode}
          onChange={handleChange}
          required
        />
        <FloatingInput
          id="countryCode"
          name="countryCode"
          label="Country"
          value={values.countryCode}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <PhoneInput
          id="phoneNumber"
          name="phoneNumber"
          value={values.phoneNumber}
          onChange={(val: string) =>
            setValues((prev) => ({ ...prev, phoneNumber: val }))
          }
          placeholder="Phone Number"
        />
      </div>

      <Button type="submit" className="w-full mt-2">
        {submitLabel}
      </Button>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="saveForLater"
            checked={values.saveForLater ?? false}
            onCheckedChange={(checked: boolean) =>
              setValues((prev) => ({ ...prev, saveForLater: !!checked }))
            }
          />
          <Label htmlFor="saveForLater">Save address for later</Label>

          <Checkbox
            id="makeDefault"
            checked={values.makeDefault ?? false}
            onCheckedChange={(checked: boolean) =>
              setValues((prev) => ({ ...prev, makeDefault: !!checked }))
            }
          />
          <Label htmlFor="makeDefault">Set as default shipping address</Label>
        </div>
      </div>
    </form>
  );
}
