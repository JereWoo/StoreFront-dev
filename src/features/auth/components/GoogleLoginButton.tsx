import { useAuthenticateGoogleMutation } from "@/generated/hooks";
import { useAuth } from "@/features/auth";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
  clientId?: string;
}

interface GoogleAccounts {
  id: {
    initialize: (config: {
      client_id: string;
      callback: (response: GoogleCredentialResponse) => void;
    }) => void;
    renderButton: (
      parent: HTMLElement | null,
      options: { theme: string; size: string },
    ) => void;
    prompt: () => void;
  };
}

declare global {
  interface Window {
    google?: { accounts: GoogleAccounts };
  }
}

export function GoogleLoginButton() {
  const authenticate = useAuthenticateGoogleMutation();
  const { refresh } = useAuth();
  const navigate = useNavigate();

  const redirectTo =
    (typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("redirect")) ||
    "/";

  const handleCredentialResponse = useCallback(
    async (response: GoogleCredentialResponse) => {
      const idToken = response.credential;
      if (!idToken) return;

      const result = await authenticate.mutateAsync({ token: idToken });
      if (result.authenticate?.__typename === "CurrentUser") {
        await refresh();
        navigate({ to: redirectTo });
      } else {
        console.error("Google login failed:", result);
      }
    },
    [authenticate, refresh, navigate, redirectTo],
  );

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-login-btn"),
      { theme: "outline", size: "large" },
    );
  }, [handleCredentialResponse]);

  return (
    <div
      id="google-login-btn"
      style={{ display: "flex", justifyContent: "center" }}
    />
  );
}
