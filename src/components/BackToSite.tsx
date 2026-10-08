import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

// Pages that already show their own back control, or where the navbar is enough.
const HIDDEN_ON = ["/", "/go"];

export function BackToSite() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    <Link
      to="/"
      aria-label="Go back to MrsANONymous home"
      className="fixed left-3 bottom-5 z-30 hidden items-center gap-2 rounded-full border border-rose-200 bg-white/95 px-4 py-2 text-sm font-semibold text-ink-900 shadow-lg backdrop-blur transition hover:bg-rose-50 md:flex"
    >
      <ArrowLeft className="h-4 w-4 text-rose-500" />
      <span>Back to MrsANONymous</span>
    </Link>
  );
}
