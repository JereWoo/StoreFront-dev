// src/routes/verify.tsx
import { useEffect } from "react";
import { useSearch, createFileRoute } from "@tanstack/react-router";
import { Loader, Text } from "@mantine/core";
import { useVerifyCustomerAccountMutation } from "@/generated/hooks";

export const Route = createFileRoute("/auth/verify")({
  component: VerifyPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: String(search.token ?? ""),
    };
  },
});

export default function VerifyPage() {
  const { token } = useSearch({ from: Route.id });

  const verifyMutation = useVerifyCustomerAccountMutation();

  useEffect(() => {
    if (token) {
      verifyMutation.mutate({ token });
    }
  }, [token, verifyMutation]);

  if (verifyMutation.isPending) return <Loader />;

  if (verifyMutation.isError) {
    return (
      <Text c="red">
        Something went wrong: {(verifyMutation.error as Error).message}
      </Text>
    );
  }

  if (verifyMutation.isSuccess) {
    const result = verifyMutation.data.verifyCustomerAccount;
    if (result.__typename === "CurrentUser") {
      return <Text c="green">✅ Account verified! You can now log in.</Text>;
    }
    return (
      <Text c="red">⚠️ {result.message ?? "Invalid or expired token."}</Text>
    );
  }

  return <Text>Verifying your account…</Text>;
}
