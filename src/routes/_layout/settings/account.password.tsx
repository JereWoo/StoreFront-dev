import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/settings/account/password")({
  component: () => (
    <div>
      <h3 className="text-lg font-medium mb-2">Password</h3>
      <p>Change, reset, or set your password here.</p>
    </div>
  ),
});
