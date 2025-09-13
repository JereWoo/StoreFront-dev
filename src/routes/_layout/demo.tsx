import { createFileRoute } from "@tanstack/react-router";
import { AuthProvider } from "@/features/auth/services/AuthProvider";
import { AuthButton } from "@/features/auth/components/AuthButton.tsx";

export const Route = createFileRoute("/_layout/demo")({
  component: DemoPage,
});

function DemoPage() {
  return (
    <AuthProvider>
      <div className="flex h-screen items-center justify-center">
        <AuthButton />
      </div>
    </AuthProvider>
  );
}
