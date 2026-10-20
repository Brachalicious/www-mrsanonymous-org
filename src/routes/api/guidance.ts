import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/guidance")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handleGuidanceRequest } = await import("@/lib/guidance/chat.server");
        return handleGuidanceRequest(request);
      },
    },
  },
});
