import { useEffect } from "react";

const QUICK_EXIT_URL = "https://www.google.com";
const EXIT_FLAG = "mrsanon:exited";
// The exit lock is PERMANENT for the browser: once a quick exit happens,
// any attempt to return to the app (back button, forward button, cache
// restore, new visit) bounces straight back out. It is stored in
// localStorage so it survives tab closes and browser restarts. The only
// way back in is unlocking the calculator disguise with the passcode,
// which calls clearExitLock() — something only the real user can do.
export function clearExitLock() {
  try {
    window.localStorage.removeItem(EXIT_FLAG);
  } catch {
    // ignore
  }
}

function setExitFlag() {
  try {
    window.localStorage.setItem(EXIT_FLAG, "1");
  } catch {
    // ignore
  }
}

export function performQuickExit() {
  // Mark the exit so any attempt to return (back button, bfcache restore)
  // bounces straight back out — permanently, until the calculator unlock.
  setExitFlag();
  // Replace the current history entry with the safe URL so this app
  // does NOT remain in the browser's back/forward history. The exit must
  // always stay in the current tab and never create a new tab or entry.
  window.location.replace(QUICK_EXIT_URL);
}

export function performQuickExitFallback() {
  // If Google is blocked by the network, fall back to a blank page so the
  // back button still cannot return to MrsANONymous.
  setExitFlag();
  window.location.replace("about:blank");
}

function exitLockActive(): boolean {
  try {
    return window.localStorage.getItem(EXIT_FLAG) === "1";
  } catch {
    return false;
  }
}

export function QuickExit() {
  useEffect(() => {
    // If we land here while an exit lock is active (back button, forward
    // button, cache restore, or a fresh visit), leave again immediately.
    // Exception: when the calculator disguise is enabled, the app opens as
    // an innocent-looking calculator instead — the real user clears the
    // lock by entering their passcode, while anyone snooping sees only a
    // calculator.
    const disguiseOn = (() => {
      try {
        return window.localStorage.getItem("calc_disguise_enabled") === "1";
      } catch {
        return false;
      }
    })();
    if (exitLockActive() && !disguiseOn) {
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
      if (e.key === "Escape" || e.key === "Esc" || e.code === "Escape") {
        e.preventDefault();
        e.stopImmediatePropagation();
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
