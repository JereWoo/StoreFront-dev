import { createFileRoute } from "@tanstack/react-router";
import { AuthenticationForm } from "@/components/ui/composites/AuthenticationForm.tsx";

export const Route = createFileRoute("/auth/sign-in")({
  component: AuthenticationPage,
});

export function AuthenticationPage() {
  return (
    <AuthenticationForm className="w-full max-w-md shadow-md flex items-center justify-center" />
  );
}
