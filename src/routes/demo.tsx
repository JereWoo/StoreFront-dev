import { createFileRoute } from "@tanstack/react-router";
import { DemoForm } from "../components/mantine/demoform";

export const Route = createFileRoute("/demo")({
  component: DemoForm,
});
