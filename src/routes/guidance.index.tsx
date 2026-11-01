import { createFileRoute } from "@tanstack/react-router";
import { GuidanceWorkspace } from "@/components/GuidanceWorkspace";
export const Route = createFileRoute("/guidance/")({
  head: () => ({
    meta: [
      { title: "App Guidance — MrsANONymous" },
      {
        name: "description",
        content:
          "Ask the built-in MrsANONymous guide where things are: your saved notes, your safety plan, texting 911, THE BOARD, and more.",
      },
      { property: "og:title", content: "App Guidance — MrsANONymous" },
      {
        property: "og:description",
        content: "A free built-in guide to using MrsANONymous. No AI, no cost, no account needed to look.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: GuidanceWorkspace,
});
