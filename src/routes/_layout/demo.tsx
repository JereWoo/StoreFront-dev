import { createFileRoute } from "@tanstack/react-router";
import { AuthProvider } from "@/features/auth/services/AuthProvider";
import { AuthButton } from "@/features/auth/components/AuthButton.tsx";
import { useEffect } from "react";
import { vendureFetcher } from "@/api/vendure/fetcher.ts";
import {
  CreateCustomerAddressMutation,
  CreateCustomerAddressMutationVariables,
} from "@/generated/graphql.ts";
import { CreateCustomerAddressDocument } from "@/generated/hooks.ts";

export const Route = createFileRoute("/_layout/demo")({
  component: DemoPage,
});

function DemoPage() {
  useEffect(() => {
    vendureFetcher<
      CreateCustomerAddressMutation,
      CreateCustomerAddressMutationVariables
    >(CreateCustomerAddressDocument, {
      input: {
        fullName: "Test User",
        streetLine1: "123 Example St",
        city: "Testville",
        postalCode: "12345",
        countryCode: "US",
      },
    })()
      .then(console.log)
      .catch(console.error);
  }, []);

  return (
    <AuthProvider>
      <div className="flex h-screen items-center justify-center">
        <AuthButton />
      </div>
    </AuthProvider>
  );
}
