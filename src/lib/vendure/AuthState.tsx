import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { query } from "@/lib/vendure/client";
import { ME_QUERY, ACTIVE_CUSTOMER_QUERY } from "@/lib/vendure/queries";
import { LOGOUT_MUTATION } from "@/lib/vendure/mutations";

type MeUser = { id: string; identifier: string } | null;
type Customer = {
  id: string;
  emailAddress: string;
  firstName?: string | null;
  lastName?: string | null;
} | null;

export type AuthState =
  | { status: "checking"; user: null; customer: null }
  | { status: "authenticated"; user: Exclude<MeUser, null>; customer: Customer }
  | { status: "anonymous"; user: null; customer: null };

type CtxType = AuthState & {
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<CtxType>({
  status: "checking",
  user: null,
  customer: null,
  // Not mounted yet – noop to satisfy types & linter
  refresh: async () => {
    /* noop until AuthProvider mounts */
  },
  logout: async () => {
    /* noop until AuthProvider mounts */
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
      const meRes = await query(ME_QUERY);
      const me: MeUser = meRes?.data?.me ?? null;

      if (!me) {
        setState({ status: "anonymous", user: null, customer: null });
        return;
      }

      const custRes = await query(ACTIVE_CUSTOMER_QUERY);
      const activeCustomer: Customer = custRes?.data?.activeCustomer ?? null;

      setState({
        status: "authenticated",
        user: me,
        customer: activeCustomer,
      });
    } catch (err) {
      // Treat as anonymous on any failure
      console.error("[Auth] refresh() failed; setting anonymous", err);
      setState({ status: "anonymous", user: null, customer: null });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await query(LOGOUT_MUTATION);
    } catch (err) {
      /* best-effort logout; ignore network errors */
      console.error("[Auth] logout mutation failed (continuing)", err);
    }
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (err) {
      /* ignore storage errors */
      console.error(
        "[Auth] failed to remove auth token from localStorage",
        err,
      );
    }
    setState({ status: "anonymous", user: null, customer: null });
  }, []);

  // Initial hydrate
  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Flip to anonymous if the API wrapper emits an auth-invalid event
  useEffect(() => {
    const onInvalid = () =>
      console.warn("[Auth] received neb-auth-invalid event; setting anonymous");
    setState({ status: "anonymous", user: null, customer: null });
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
