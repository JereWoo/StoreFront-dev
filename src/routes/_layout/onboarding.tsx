import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  loadConnectAndInitialize,
  StripeConnectInstance,
} from "@stripe/connect-js";
import {
  ConnectComponentsProvider,
  ConnectAccountOnboarding,
  ConnectPayments,
  ConnectNotificationBanner,
  ConnectBalances,
  ConnectPayouts,
  ConnectDocuments,
} from "@stripe/react-connect-js";
import { useCreateStripeAccountSessionMutation } from "@/generated/hooks";

export const Route = createFileRoute("/_layout/onboarding")({
  component: RouteComponent,
});

function RouteComponent() {
  const [errorMessage, setErrorMessage] = useState("");
  const createSession = useCreateStripeAccountSessionMutation();

  // ✅ useState initializer runs once → gives Stripe a function to fetch secrets
  const [stripeConnectInstance] = useState<StripeConnectInstance>(() =>
    loadConnectAndInitialize({
      publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!,
      fetchClientSecret: async () => {
        try {
          // Call your generated GraphQL mutation
          const result = await createSession.mutateAsync({});
          if (!result?.createStripeAccountSession) {
            throw new Error("No client_secret returned from backend");
          }
          return result.createStripeAccountSession;
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error("Stripe fetchClientSecret error:", err);
            setErrorMessage(err.message);
          } else {
            console.error("Stripe fetchClientSecret error:", err);
            setErrorMessage("Unknown error");
          }
          return undefined;
        }
      },
    }),
  );

  if (errorMessage) {
    return <div className="p-4 text-red-600">Error: {errorMessage}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold mb-4">
        Stripe Connect Component Testing
      </h1>

      <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Onboarding */}
          <div className="rounded-lg border shadow bg-white p-4 overflow-auto max-h-[600px]">
            <h2 className="text-lg font-semibold mb-2">Onboarding</h2>
            <ConnectAccountOnboarding
              onExit={() => console.log("Seller exited onboarding")}
              onStepChange={(step) => console.log("Onboarding step:", step)}
            />
          </div>

          {/* Notification Banner */}
          <div className="rounded-lg border shadow bg-white p-4">
            <h2 className="text-lg font-semibold mb-2">Notification Banner</h2>
            <ConnectNotificationBanner />
          </div>

          {/* Balances */}
          <div className="rounded-lg border shadow bg-white p-4 overflow-auto max-h-[400px]">
            <h2 className="text-lg font-semibold mb-2">Balances</h2>
            <ConnectBalances />
          </div>

          {/* Payouts */}
          <div className="rounded-lg border shadow bg-white p-4 overflow-auto max-h-[400px]">
            <h2 className="text-lg font-semibold mb-2">Payouts</h2>
            <ConnectPayouts />
          </div>

          {/* Payments */}
          <div className="rounded-lg border shadow bg-white p-4 overflow-auto max-h-[400px]">
            <h2 className="text-lg font-semibold mb-2">Payments</h2>
            <ConnectPayments />
          </div>

          {/* Documents */}
          <div className="rounded-lg border shadow bg-white p-4 overflow-auto max-h-[400px]">
            <h2 className="text-lg font-semibold mb-2">Documents</h2>
            <ConnectDocuments />
          </div>
        </div>
      </ConnectComponentsProvider>
    </div>
  );
}
