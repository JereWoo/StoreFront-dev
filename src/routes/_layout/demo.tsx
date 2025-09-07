import { createFileRoute } from "@tanstack/react-router";
import { DemoForm } from "@/components/mantine/demoform";

export const Route = createFileRoute("/_layout/demo")({
  component: DemoForm,
});
