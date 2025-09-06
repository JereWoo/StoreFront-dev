import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { HeaderMegaMenu } from "@/components/mantine/header.tsx";

function RootLayout() {
  return (
    <MantineProvider>
      {/* Root wrapper for styling isolation & theme */}
      <HeaderMegaMenu />
      <div className="root min-h-screen flex flex-col">
        {/* Devtools */}
        <TanStackRouterDevtools />
      </div>
    </MantineProvider>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
