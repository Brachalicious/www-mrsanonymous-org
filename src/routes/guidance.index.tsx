import { createFileRoute } from "@tanstack/react-router";
import { GuidanceWorkspace } from "@/components/GuidanceWorkspace";
export const Route = createFileRoute("/guidance/")({
  head: () => ({
    meta: [
      { title: "Mascot App Guidance — MrsANONymous" },
      {
        name: "description",
        content: "Ask the MrsANONymous mascot for help finding your way around the app.",
      },
      { property: "og:title", content: "Mascot App Guidance — MrsANONymous" },
      { property: "og:description", content: "Private, account-saved app guidance conversations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GuidanceWorkspace,
});
