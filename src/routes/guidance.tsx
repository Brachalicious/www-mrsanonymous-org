import { createFileRoute, Outlet } from "@tanstack/react-router";
export const Route = createFileRoute("/guidance")({
  head: () => ({ meta: [
    { title: "App Guidance — MrsANONymous.org" },
    { name: "description", content: "Ask the built-in MrsANONymous guide how to use the app. Free, no AI, no cost." },
    { property: "og:title", content: "App Guidance — MrsANONymous.org" },
    { property: "og:description", content: "A free built-in guide to using MrsANONymous." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Outlet,
});
