import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/guidance")({
  server: {
    handlers: {
      POST: async () =>
        Response.json(
          { error: "App guidance is turned off. Please contact support if you need help." },
          { status: 410 },
        ),
    },
  },
});
