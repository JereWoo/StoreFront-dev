import { createFileRoute } from "@tanstack/react-router";
import { AuthenticationForm } from "@/features/auth/components/AuthenticationForm.tsx";

export const Route = createFileRoute("/auth/sign-in")({
  component: AuthenticationPage,
});

export function AuthenticationPage() {
  return (
    <AuthenticationForm className="w-full max-w-md shadow-md flex items-center justify-center" />
  );
}
