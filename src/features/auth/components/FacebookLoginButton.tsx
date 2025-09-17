/**
 * Renders a Facebook login button.
 */

import { useCallback, useEffect, useState } from "react";
import { FacebookSDK } from "@/lib/FacebookSDK";
import { useAuthenticateFacebookMutation } from "@/generated/hooks";

type FBLoginButtonProps = {
  onSuccess?: () => Promise<void> | void;
};

type FBLoginStatusResponse = {
  status: "connected" | "not_authorized" | "unknown";
  authResponse?: {
    accessToken: string;
    userID: string;
  };
};

declare global {
  interface Window {
    FB?: {
      getLoginStatus: (cb: (response: FBLoginStatusResponse) => void) => void;
      login: (
        cb: (response: FBLoginStatusResponse) => void,
        options?: Record<string, unknown>,
      ) => void;
      logout: (cb: () => void) => void;
      XFBML: { parse: () => void };
    };
    [key: string]: unknown;
  }
}

export const FBLoginButton = ({ onSuccess }: FBLoginButtonProps) => {
  const fnName = `onFbLoginButtonSuccess`;
  const [error, setError] = useState("");
  const authenticate = useAuthenticateFacebookMutation();

  useEffect(() => {
    window?.FB?.XFBML.parse();
  }, []);

  const login = useCallback(
    async (response: FBLoginStatusResponse) => {
      const { status, authResponse } = response;
      if (status === "connected" && authResponse) {
        try {
          const result = await authenticate.mutateAsync({
            token: authResponse.accessToken,
            provider: "facebook",
          });

          if (result.authenticate?.__typename === "CurrentUser") {
            await onSuccess?.();
            return;
          }

          // Handle Vendure ErrorResult / NotVerifiedError etc
          if (
            result.authenticate &&
            result.authenticate.__typename !== "CurrentUser"
          ) {
            const err = result.authenticate as {
              message?: string;
              errorCode?: string;
            };
            setError(
              err.message ?? `Error: ${err.errorCode ?? "UNKNOWN_ERROR"}`,
            );
            return;
          }
        } catch (e: unknown) {
          // Network or GraphQL-level error
          setError(e.message ?? "Unexpected error");
          return;
        }
      }
      setError("Facebook login failed. Please try again.");
    },
    [authenticate, onSuccess],
  );

  useEffect(() => {
    window[fnName] = () => {
      window.FB?.getLoginStatus(login);
    };
    return () => {
      delete window[fnName];
    };
  }, [login]);

  return (
    <div className="text-center" style={{ width: 188, height: 28 }}>
      <FacebookSDK />
      <div
        className="fb-login-button"
        data-width=""
        data-size="medium"
        data-button-type="login_with"
        data-layout="default"
        data-auto-logout-link="false"
        data-use-continue-as="false"
        data-scope="public_profile,email"
        data-onlogin={`${fnName}();`}
      />
      {error && <div className="text-sm text-red-500">{error}</div>}
    </div>
  );
};
