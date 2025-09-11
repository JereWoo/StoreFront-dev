import { createFileRoute } from "@tanstack/react-router";
import { DemoForm } from "@/components/ui/mantine/demoform";

export const Route = createFileRoute("/_layout/demo")({
  component: DemoForm,
});
