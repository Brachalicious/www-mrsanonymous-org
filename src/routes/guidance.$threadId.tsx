import { createFileRoute } from "@tanstack/react-router";
import { GuidanceWorkspace } from "@/components/GuidanceWorkspace";
export const Route = createFileRoute("/guidance/$threadId")({
  head: () => ({
    meta: [
      { title: "App Guidance — MrsANONymous" },
      {
        name: "description",
        content:
          "Your saved conversation with the built-in MrsANONymous guide. No AI, no cost.",
      },
      { property: "og:title", content: "App Guidance — MrsANONymous" },
      {
        property: "og:description",
        content: "A free built-in guide to using MrsANONymous.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: GuidancePage,
});

function GuidancePage() {
  const { threadId } = Route.useParams();
  return <GuidanceWorkspace threadId={threadId} />;
}
