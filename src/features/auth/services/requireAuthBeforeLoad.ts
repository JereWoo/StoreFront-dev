import { redirect } from "@tanstack/react-router";
import { vendureFetcher } from "@/api/vendure/fetcher";
import {
  ActiveCustomerDocument,
  ActiveCustomerQuery,
} from "@/generated/graphql";

/**
 * Route guard for TanStack Router.
 * Always hits Vendure to verify authentication,
 * since hooks/context aren't available in beforeLoad.
 */
export async function requireAuthBeforeLoad() {
  try {
    const res = await vendureFetcher<ActiveCustomerQuery>(
      ActiveCustomerDocument,
    )();
    const customer = res?.activeCustomer;

    if (!customer) {
      const currentPath =
        typeof window !== "undefined"
          ? location.pathname + location.search
          : "/";
      throw redirect({
        to: "/auth/sign-in",
        search: { redirect: currentPath },
      });
    }
  } catch (err) {
    console.error("[Auth] Guard check failed", err);
    const currentPath =
      typeof window !== "undefined" ? location.pathname + location.search : "/";
    throw redirect({
      to: "/auth/sign-in",
      search: { redirect: currentPath },
    });
  }
}
