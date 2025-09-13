// routes/_layout/_settings.tsx
import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { requireAuthBeforeLoad } from "@/features/auth/services/requireAuthBeforeLoad.ts";

export const Route = createFileRoute("/_layout/settings")({
  beforeLoad: requireAuthBeforeLoad,
  component: SettingsLayout,
});

function SettingsLayout() {
  const navItems = [
    { label: "Overview", to: "/settings" },
    { label: "Addresses", to: "/settings/addresses" },
    { label: "Profile - Faked", to: "/settings/profile" },
    { label: "Orders - Faked", to: "/settings/orders" },
    { label: "Security - Faked", to: "/settings/security" },
  ];

  return (
    <div className="container mx-auto p-6 grid md:grid-cols-[220px_1fr] gap-6">
      {/* Side Navigation */}
      <aside className="bg-card border rounded-lg p-4 h-fit">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="px-3 py-2 rounded text-sm hover:bg-muted"
              activeProps={{
                className: "bg-muted font-medium",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Right-hand Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
