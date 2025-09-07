import { createFileRoute } from "@tanstack/react-router";
import { AuthenticationForm } from "@/components/mantine/auth/AuthenticationForm.tsx";

export const Route = createFileRoute("/auth/sign-in")({
  component: AuthenticationPage,
});

export function AuthenticationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <AuthenticationForm className="w-full max-w-md shadow-md" />
    </div>
  );
}
