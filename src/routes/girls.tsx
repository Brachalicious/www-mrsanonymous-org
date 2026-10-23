import { createFileRoute } from "@tanstack/react-router";
import { AudiencePage } from "@/components/AudiencePage";

export const Route = createFileRoute("/girls")({
  head: () => ({
    meta: [
      { title: "For Girls & Teens — MrsAnonymous" },
      { name: "description", content: "A safe, anonymous space for girls and teens. We see you, we hear you, we believe you." },
      { property: "og:title", content: "For Girls & Teens — MrsAnonymous" },
      { property: "og:description", content: "A safe, anonymous space for girls and teens." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GirlsPage,
});

function GirlsPage() {
  return <AudiencePage audience="girls" />;
}
