import { createFileRoute } from "@tanstack/react-router";
import { GuidanceWorkspace } from "@/components/GuidanceWorkspace";
export const Route = createFileRoute("/guidance/$threadId")({
  head: () => ({
    meta: [
      { title: "Your Guidance Conversation — MrsANONymous" },
      {
        name: "description",
        content: "Continue your private MrsANONymous app guidance conversation.",
      },
      { property: "og:title", content: "Your Guidance Conversation — MrsANONymous" },
      {
        property: "og:description",
        content: "Get help navigating MrsANONymous from the app mascot.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ThreadPage,
});
function ThreadPage() {
  const { threadId } = Route.useParams();
  return <GuidanceWorkspace threadId={threadId} />;
}
