import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/settings/account/profile")({
  component: () => (
    <div>
      <h3 className="text-lg font-medium mb-2">Profile</h3>
      <p>Edit your name, email, and basic details here.</p>
    </div>
  ),
});
