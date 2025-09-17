import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/9ui/tabs";
import { useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/settings/account")({
  component: AccountLayout,
});

function AccountLayout() {
  const router = useRouter();

  // Map each tab to a route
  const tabs = [
    { value: "profile", label: "Profile", to: "/settings/account/profile" },
    { value: "password", label: "Password", to: "/settings/account/password" },
    {
      value: "providers",
      label: "Identity Providers",
      to: "/settings/account/providers",
    },
  ];

  // detect which tab should be active
  const currentPath = router.state.location.pathname;
  const activeTab =
    tabs.find((t) => currentPath.startsWith(t.to))?.value ?? "profile";

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Account</h2>

      <Tabs value={activeTab}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => router.navigate({ to: tab.to })}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Tab content renders here */}
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
}
