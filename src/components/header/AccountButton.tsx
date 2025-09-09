import { useEffect, useRef, useState } from "react";
import { Group } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { User } from "lucide-react";

type AccountUser = { id: string; email: string } | null;

//TODO: Remove tokens from local storage
// LocalStorage is mainly risky because of XSS.
// HttpOnly cookies mitigate theft but require CSRF defenses.
// Best of both: access token in memory, refresh token in HttpOnly cookie,
// strict CORS/Origin checks. Perfect for your subdomains now, and mobile later.

export function AccountButton({
  user,
  onLogout,
}: {
  user: AccountUser;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click / ESC
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Logged OUT
  if (!user) {
    const currentPath =
      typeof window !== "undefined" ? location.pathname + location.search : "/";
    return (
      <Group visibleFrom="sm">
        <Link
          to="/auth/sign-in"
          search={{ redirect: currentPath }}
          className="flex items-center gap-2 rounded-full px-4 py-2 ..."
        >
          <User className="h-5 w-5" />
          <span>Login / Sign Up</span>
        </Link>
      </Group>
    );
  }

  // Logged IN
  return (
    <Group visibleFrom="sm" className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full px-4 py-2 text-gray-700 hover:text-emerald-700 transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <User className="h-5 w-5" />
        <span className="hidden sm:inline truncate max-w-40">{user.email}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border overflow-hidden z-50"
        >
          <Link
            to="/account"
            className="block px-4 py-2 text-sm hover:bg-gray-50"
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            My Account
          </Link>
          <Link
            to="/orders"
            className="block px-4 py-2 text-sm hover:bg-gray-50"
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            My Orders
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              onLogout(); // ← ACTUAL LOGOUT CALL
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
            role="menuitem"
          >
            Log Out
          </button>
        </div>
      )}
    </Group>
  );
}
