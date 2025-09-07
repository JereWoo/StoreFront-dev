import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: () => (
    <div className="relative flex flex-col items-center justify-center h-screen">
      {/* Logo + Title pinned near top */}
      <div className="absolute top-12 flex flex-col items-center space-y-2">
        <Link to="/" className="flex flex-col items-center">
          <img
            src="/NEB-Logo.png"
            alt="My Logo"
            className="h-20 w-auto cursor-pointer"
          />
          <Text fw={700} size="xl">
            Not Enough Books
          </Text>
        </Link>
      </div>
      <Outlet />
    </div>
  ),
});
