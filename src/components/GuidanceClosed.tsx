import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function GuidanceClosed() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 px-5 text-center">
      <h1 className="font-serif text-2xl text-ink-900">App guidance is turned off</h1>
      <p className="text-sm text-ink-700">
        The mascot assistant is currently unavailable. Your notebooks, safety plan, stories and
        support inbox all still work as normal.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/contact">Contact support</Link>
        </Button>
      </div>
    </div>
  );
}
