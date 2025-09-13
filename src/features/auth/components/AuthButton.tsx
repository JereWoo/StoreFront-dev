import { Link } from "@tanstack/react-router";
import { IconUser } from "@tabler/icons-react";
import { useAuth } from "@/features/auth";
import { AccountButton } from "@/features/account";

export function AuthButton() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    const currentPath =
      typeof window !== "undefined" ? location.pathname + location.search : "/";

    return (
      <Link
        to="/auth/sign-in"
        search={{ redirect: currentPath }}
        className="flex items-center gap-2 rounded-full px-4 py-2 text-gray-700 hover:text-emerald-700 transition-colors"
      >
        <IconUser size={18} />
        <span>Login / Sign Up</span>
      </Link>
    );
  }

  return <AccountButton user={user} onLogout={logout} />;
}
