import { createLazyFileRoute } from "@tanstack/react-router";
import { Calendar } from "@/components/ui/calendar";

export const Route = createLazyFileRoute("/_layout/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex items-center justify-center h-[90vh]">
      <div className="text-center">
        <h1 className="text-3xl font-bold">React Project Starter</h1>
        <p>with Tanstack Router + SWR</p>
      </div>
      <div>
        <Calendar showOutsideDays />
      </div>
    </div>
  );
}
