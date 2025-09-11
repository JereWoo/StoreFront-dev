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
} from "@/generated/graphql.ts";
import { vendureFetcher } from "@/api/vendure/fetcher.ts";

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

const Ctx = createContext<CtxType>({
  status: "checking",
  user: null,
  customer: null,
  refresh: async () => {
    // TODO: idk do it later
    throw new Error("refresh() called before AuthProvider mounted");
  },
  logout: async () => {
    // TODO: idk do it later
    throw new Error("logout() called before AuthProvider mounted");
  },
});

const AUTH_TOKEN_KEY = "auth_token";

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
      console.error("[Auth] refresh() failed; setting anonymous", err);
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
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (err) {
      console.error(
        "[Auth] failed to remove auth token from localStorage",
        err,
      );
    }
    setState({ status: "anonymous", user: null, customer: null });
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const onInvalid = () => {
      console.warn("[Auth] received neb-auth-invalid event; setting anonymous");
      setState({ status: "anonymous", user: null, customer: null });
    };
    if (typeof window !== "undefined") {
      window.addEventListener("neb-auth-invalid", onInvalid);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("neb-auth-invalid", onInvalid);
      }
    };
  }, []);

  return (
    <Ctx.Provider value={{ ...state, refresh, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
