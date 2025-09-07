import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { HeaderMegaMenu } from "@/components/mantine/header";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { FooterLinks } from "@/components/mantine/footer.tsx";

// Create a single query client for the whole app
const queryClient = new QueryClient();

function RootLayout() {
  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <div className="root min-h-screen flex flex-col">
          {/* Header at the top */}
          <HeaderMegaMenu />

          {/* Page content */}
          <main className="flex-1">
            <Outlet />
          </main>

          <FooterLinks />

          {/* Devtools */}
          <TanStackRouterDevtools />
          <ReactQueryDevtools initialIsOpen={false} />
        </div>
      </QueryClientProvider>
    </MantineProvider>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
