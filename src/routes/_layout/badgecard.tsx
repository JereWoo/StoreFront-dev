import { createFileRoute } from "@tanstack/react-router";
import { BadgeCard } from "@/components/mantine/badgecard";

function BadgeCardGridPage() {
  // mock data – imagine this comes from an API
  const items = [1, 2, 3, 4, 5, 6];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Badge Cards</h1>

      {/* Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <BadgeCard key={item} />
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_layout/badgecard")({
  component: BadgeCardGridPage,
});
