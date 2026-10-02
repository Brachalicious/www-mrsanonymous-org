import { useEffect } from "react";

const QUICK_EXIT_URL = "https://www.google.com";

export function performQuickExit() {
  // Replace the current history entry with the safe URL so this app
  // does NOT remain in the browser's back/forward history. The exit must
  // always stay in the current tab and never create a new tab or entry.
  try {
    // Wipe this page from the session history entry before leaving.
    window.history.replaceState(null, "", QUICK_EXIT_URL);
  } catch {
    // Cross-origin replaceState can throw; location.replace below still
    // removes the entry.
  }
  window.location.replace(QUICK_EXIT_URL);
}

export function performQuickExitFallback() {
  // If Google is blocked by the network, fall back to a blank page so the
  // back button still cannot return to MrsANONymous.
  window.location.replace("about:blank");
}

export function QuickExit() {
  useEffect(() => {
    function isTyping(target: EventTarget | null) {
      const el = target as HTMLElement | null;
      if (!el) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable === true
      );
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        performQuickExit();
        return;
      }
      // "X" key also triggers quick exit (unless the user is typing)
      if (
        (e.key === "x" || e.key === "X") &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !isTyping(e.target)
      ) {
        e.preventDefault();
        performQuickExit();
      }
    }

    // History trap: keep a guard entry on top of the stack so pressing the
    // browser Back button fires popstate instead of leaving — and when it
    // does, we quick-exit rather than letting the user navigate back into
    // or around the app.
    const guard = { mrsanonGuard: true };
    try {
      window.history.pushState(guard, "");
    } catch {
      // ignore
    }

    function handlePopState() {
      // Re-arm the trap, then exit — back must never expose the app.
      try {
        window.history.pushState(guard, "");
      } catch {
        // ignore
      }
      performQuickExit();
    }

    // If the tab becomes hidden (user switching away), arm a flag so that
    // returning via back/forward cache also exits instead of showing content.
    function handlePageShow(e: PageTransitionEvent) {
      if (e.persisted) {
        performQuickExit();
      }
    }

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return null;
}
