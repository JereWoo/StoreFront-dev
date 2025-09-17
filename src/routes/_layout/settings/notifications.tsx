import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/settings/notifications")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_layout/settings/notifications"!</div>;
}
