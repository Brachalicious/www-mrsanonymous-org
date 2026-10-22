import { createFileRoute } from "@tanstack/react-router";
import { GuidanceClosed } from "@/components/GuidanceClosed";
export const Route = createFileRoute("/guidance/$threadId")({
  head: () => ({
    meta: [
      { title: "App Guidance — MrsANONymous" },
      {
        name: "description",
        content: "App guidance is currently turned off. Support and safety tools remain available.",
      },
      { property: "og:title", content: "App Guidance — MrsANONymous" },
      {
        property: "og:description",
        content: "App guidance is currently turned off. Support and safety tools remain available.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: GuidanceClosed,
});
