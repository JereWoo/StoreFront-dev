// src/routes/chat.tsx
import { createFileRoute } from "@tanstack/react-router";
import { ChatPage } from "@/features/stream-chat";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
});
