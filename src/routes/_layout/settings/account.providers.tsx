import { createFileRoute } from "@tanstack/react-router";
import { RemoveAuthButton } from "@/features/auth/components/RemoveAuthButton.tsx";
import { GoogleLoginButton } from "@/features/auth/components/GoogleLoginButton.tsx";
import { FBLoginButton } from "@/features/auth/components/FacebookLoginButton.tsx";

export const Route = createFileRoute("/_layout/settings/account/providers")({
  component: () => (
    <div>
      <h3 className="text-lg font-medium mb-2">Identity Providers</h3>
      <p>Link or unlink external login providers (Google, Facebook, etc.).</p>

      <div className="flex gap-2">
        <RemoveAuthButton provider="facebook" />
        <RemoveAuthButton provider="google" />
      </div>

      <GoogleLoginButton />
      <FBLoginButton />
    </div>
  ),
});
