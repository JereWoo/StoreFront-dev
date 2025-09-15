import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  MeDocument,
  MeQuery,
  ActiveCustomerDocument,
  ActiveCustomerQuery,
  LogoutDocument,
  LogoutMutation,
} from "@/generated/graphql";
import { vendureFetcher } from "@/api/vendure/fetcher";

type AuthState =
  | { status: "checking"; user: null; customer: null }
  | {
      status: "authenticated";
      user: NonNullable<MeQuery["me"]>;
      customer: ActiveCustomerQuery["activeCustomer"];
    }
  | { status: "anonymous"; user: null; customer: null };

type CtxType = AuthState & {
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<CtxType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    status: "checking",
    user: null,
    customer: null,
  });

  const refresh = useCallback(async () => {
    try {
      const meRes = await vendureFetcher<MeQuery>(MeDocument)();
      const me = meRes?.me ?? null;

      if (!me) {
        setState({ status: "anonymous", user: null, customer: null });
        return;
      }

      const custRes = await vendureFetcher<ActiveCustomerQuery>(
        ActiveCustomerDocument,
      )();
      const activeCustomer = custRes?.activeCustomer ?? null;

      setState({
        status: "authenticated",
        user: me,
        customer: activeCustomer,
      });
    } catch (err) {
      console.error("[Auth] refresh() failed", err);
      setState({ status: "anonymous", user: null, customer: null });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await vendureFetcher<LogoutMutation>(LogoutDocument)();
    } catch (err) {
      console.error("[Auth] logout mutation failed (continuing)", err);
    }
    try {
      localStorage.removeItem("auth_token");
    } catch (err) {
      console.error(
        "[Auth] failed to remove auth token from localStorage",
        err,
      );
    }

    // After logging out, mark user as anonymous
    setState({ status: "anonymous", user: null, customer: null });
  }, []);

  // Hydrate auth on mount
  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (state.status === "checking") {
    // This is the "blocking hydration" piece: don’t render children until we know auth state
    return null;
  }

  return (
    <AuthContext.Provider value={{ ...state, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return {
    ...ctx,
    isAuthenticated: ctx.status === "authenticated",
    isLoading: ctx.status === "checking",
  };
}
