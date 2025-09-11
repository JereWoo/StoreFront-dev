// src/routes/_root.tsx
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/api/vendure/AuthState";

import { queryClient } from "@/lib/utils";

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <MantineProvider defaultColorScheme="dark">
        <QueryClientProvider client={queryClient}>
          <main className="root flex-1">
            <Outlet />
          </main>

          <TanStackRouterDevtools />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </MantineProvider>
    </AuthProvider>
  ),
});
