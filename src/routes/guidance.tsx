import { createFileRoute, Outlet } from "@tanstack/react-router";
export const Route = createFileRoute("/guidance")({
  head: () => ({ meta: [
    { title: "App guidance unavailable — MrsANONymous.org" },
    { name: "description", content: "AI app guidance is currently switched off. Contact app support for help." },
    { property: "og:title", content: "App guidance unavailable — MrsANONymous.org" },
    { property: "og:description", content: "AI guidance is switched off; app support remains available." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Outlet,
});
