import { useEffect } from "react";

const QUICK_EXIT_URL = "https://www.google.com";
const EXIT_FLAG = "mrsanon:exited-at";
// How long after a quick exit the app refuses to be re-entered via
// back/forward or cache restore — long enough that an abuser grabbing the
// device right after cannot just press Back to see the app.
const EXIT_LOCK_MS = 2 * 60 * 1000;

export function performQuickExit() {
  // Mark the exit so any attempt to return (back button, bfcache restore)
  // within the lock window bounces straight back out.
  try {
    sessionStorage.setItem(EXIT_FLAG, String(Date.now()));
  } catch {
    // ignore
  }
  // Replace the current history entry with the safe URL so this app
  // does NOT remain in the browser's back/forward history. The exit must
  // always stay in the current tab and never create a new tab or entry.
  window.location.replace(QUICK_EXIT_URL);
}

export function performQuickExitFallback() {
  // If Google is blocked by the network, fall back to a blank page so the
  // back button still cannot return to MrsANONymous.
  try {
    sessionStorage.setItem(EXIT_FLAG, String(Date.now()));
  } catch {
    // ignore
  }
  window.location.replace("about:blank");
}

function exitLockActive(): boolean {
  try {
    const at = Number(sessionStorage.getItem(EXIT_FLAG) || 0);
    if (!at) return false;
    if (Date.now() - at < EXIT_LOCK_MS) return true;
    // Lock expired — clear it so normal use resumes.
    sessionStorage.removeItem(EXIT_FLAG);
  } catch {
    // ignore
  }
  return false;
}

export function QuickExit() {
  useEffect(() => {
    // If we land here while an exit lock is active (back button, forward
    // button, or a restored cached page), leave again immediately.
    if (exitLockActive()) {
      performQuickExit();
      return;
    }

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

    // If the page is restored from the back/forward cache, exit instead of
    // showing content.
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
