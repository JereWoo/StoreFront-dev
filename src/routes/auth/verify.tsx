// src/routes/verify.tsx
import { useEffect } from "react";
import { useSearch, createFileRoute } from "@tanstack/react-router"; // if using TanStack Router
import { useMutation } from "@tanstack/react-query";
import { query } from "@/lib/vendure/client";
import { VERIFY_CUSTOMER_ACCOUNT } from "@/lib/vendure/mutations";
import { Loader, Text } from "@mantine/core";

export const Route = createFileRoute("/auth/verify")({
  component: VerifyPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: String(search.token ?? ""),
    };
  },
});

export default function VerifyPage() {
  const { token } = useSearch({ from: Route.id }); // grabs ?token=... from URL

  const verifyMutation = useMutation({
    mutationFn: async (token: string) => {
      const res = await query(VERIFY_CUSTOMER_ACCOUNT, { token });
      return res.data.verifyCustomerAccount;
    },
  });

  useEffect(() => {
    if (token) {
      verifyMutation.mutate(token);
    }
  }, [token, verifyMutation.mutate]);

  if (verifyMutation.isPending) return <Loader />;
  if (verifyMutation.isError)
    return (
      <Text c="red">
        Something went wrong: {(verifyMutation.error as Error).message}
      </Text>
    );

  if (verifyMutation.isSuccess) {
    const result = verifyMutation.data;
    if ("id" in result) {
      return <Text c="green">✅ Account verified! You can now log in.</Text>;
    }
    return (
      <Text c="red">⚠️ {result.message ?? "Invalid or expired token."}</Text>
    );
  }

  return <Text>Verifying your account…</Text>;
}
