import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { isDisguiseEnabled, setDisguiseEnabled } from "@/components/CalcGate";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRegion } from "@/hooks/use-region";
import { getEmergency } from "@/lib/emergency-numbers";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { clearDeviceData } from "@/lib/device-reset";

export const Route = createFileRoute("/download")({
  component: DownloadPage,
  head: () => ({
    meta: [
      { title: "Install Calculator — MrsANONymous.org" },
      { name: "description", content: "Add the discreet Calculator app to your home screen without an account. Installation options depend on your browser and device." },
      { property: "og:title", content: "Download the MrsANONymous App" },
      { property: "og:description", content: "Install Calculator on iPhone or Android, understand browser shortcuts, and reset saved device information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/download" },
    ],
    links: [{ rel: "canonical", href: "/download" }],
  }),
});

type Platform = "ios" | "android" | "desktop";
interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

function DownloadPage() {
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [installEvent, setInstallEvent] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(false);
  const [installStatus, setInstallStatus] = useState("");
  const [resetConfirmation, setResetConfirmation] = useState("");
  const [resetBusy, setResetBusy] = useState(false);
  const [resetError, setResetError] = useState("");
  const queryClient = useQueryClient();
  const disguise = true;
  const [gateOn, setGateOn] = useState(false);
  const { lang } = useLanguage();
  const { country } = useRegion();
  const emergency = getEmergency(lang, country);

  useEffect(() => {
    setGateOn(isDisguiseEnabled());
  }, []);

  function toggleGate(on: boolean) {
    if (on) {
      const confirmed = confirm(
        "Turn on Calculator lock?\n\nThe app will look and open like a calculator. To open the real app you'll type a math calculation you choose, then press = .\n\nOn the very next launch you'll set your passcode: type the calculation you want (e.g. 7+3), then press = . That exact sequence becomes your passcode."
      );
      if (!confirmed) return;
      setDisguiseEnabled(true);
      setGateOn(true);
    } else {
      setDisguiseEnabled(false);
      setGateOn(false);
    }
  }

  function resetPasscode() {
    if (!confirm("Reset your calculator passcode? You'll set a new one on next open.")) return;
    localStorage.removeItem("calc_disguise_passcode");
    sessionStorage.removeItem("calc_disguise_unlocked");
    alert("Passcode cleared. Next time the calculator opens, the first calculation you type + = becomes your new passcode.");
  }

  useEffect(() => {
    setPlatform(detectPlatform());
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as InstallPrompt);
    };
    const onInstalled = () => { setInstalled(true); setInstallStatus(""); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    if (window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!installEvent) return;
    try {
      await installEvent.prompt();
      const result = await installEvent.userChoice;
      setInstallStatus(result.outcome === "accepted" ? "Installation requested. Wait for your phone to finish, then check the Calculator icon." : "Installation cancelled. Nothing was added by this request.");
      setInstallEvent(null);
    } catch {
      setInstallStatus("Your browser could not start installation. Open this page directly in Chrome on Android or Safari on iPhone.");
    }
  }

  async function resetDevice() {
    if (resetConfirmation !== "RESET" || resetBusy) return;
    setResetBusy(true);
    setResetError("");
    try {
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error) throw error;
      clearDeviceData(window.localStorage, window.sessionStorage);
      queryClient.clear();
      window.location.replace("/");
    } catch {
      setResetError("Reset could not finish. Try again. Do not assume your saved information has been erased.");
      setResetBusy(false);
    }
  }

  return (
    <div className="paper-bg min-h-screen px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <img
            src={disguise ? "/calc-icon-512.png" : "/app-icon-512.png"}
            alt={disguise ? "Calculator app icon" : "MrsANONymous app icon"}
            width={128}
            height={128}
            className="mx-auto rounded-3xl shadow-lg"
          />
          <h1 className="mt-6 font-serif text-4xl font-bold text-ink-900 sm:text-5xl">
            {disguise ? "Install as “Calculator” (disguised)" : "Download the MrsANONymous App"}
          </h1>
          <p className="mt-3 text-lg text-ink-700">
            Free. No account needed to install. Keep the name Calculator and the red calculator icon.
          </p>
        </div>

        <section className="mt-6 border-y border-border py-6 text-foreground" aria-label="Quick installation">
          <h2 className="text-xl font-bold">Add Calculator to your home screen</h2>
          {installed ? <p className="mt-3">Calculator is running separately from the browser, or this browser reported installation complete.</p> : installEvent ? <Button className="mt-4" onClick={handleInstall} data-testid="quick-install-calculator">Install Calculator</Button> : <p className="mt-3">{platform === "ios" ? "In Safari: Share → Add to Home Screen → keep Calculator → Add." : platform === "android" ? "Open this page directly in Chrome. Choose ⋮ → Install app, or Add to Home screen → Install if offered. Create shortcut is a different option." : "Use your browser’s install icon or menu. If installation is unavailable, use a bookmark; mobile instructions are below."}</p>}
          {installStatus && <p role="status" className="mt-3 text-sm">{installStatus}</p>}
          <p className="mt-3 text-sm text-muted-foreground">On Android, a small Chrome badge on the Calculator icon means a browser shortcut. The three-dot menu belongs to Chrome. Neither can be removed by this website. If Chrome only offers Create shortcut, a badge-free installation is not available through that option; installing the Android app through Google Play is a separate process.</p>
          <p className="mt-3 text-sm text-muted-foreground">Your browser controls installation and may require several taps. There is no account or waiting period imposed by this app. The icon is a disguise, not a guarantee of secrecy; device settings and browsing records may still identify the site. Existing installations may need reinstalling to refresh the name and icon.</p>
        </section>

        <section className="mt-6 border-y border-border py-6 text-foreground" aria-label="Reset this device">
          <h2 className="text-xl font-bold">Start fresh on this device</h2>
          <p className="mt-3 text-sm">Removing Calculator from your home screen does not erase this website’s saved information. Your browser and the installed website can share the same calculator lock and sign-in. An installed Calculator still opens as a calculator by design.</p>
          <p className="mt-3 text-sm">This reset signs you out here and removes this site’s saved addresses, emergency messages, safety plan, temporary note drafts, calculator passcode, and device preferences. After reset, open mrsanonymous.org directly to start without the old calculator lock; the agreement still applies. Other open tabs may retain information—close them before resetting.</p>
          <p className="mt-3 text-sm font-semibold">It does not delete your account, saved online notebooks or messages, downloaded files, browser history, or browser-held credentials. To delete online account data, use <a href="/settings" className="text-primary underline">Account Settings</a> before resetting. Browser site-data controls may be needed to remove remaining browser-held information.</p>
          <label htmlFor="device-reset-confirmation" className="mt-4 block text-sm font-medium">Type RESET to erase this site’s saved device information</label>
          <input id="device-reset-confirmation" value={resetConfirmation} onChange={e => setResetConfirmation(e.target.value)} autoComplete="off" className="mt-2 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2" disabled={resetBusy} />
          <div className="mt-3"><Button variant="destructive" disabled={resetConfirmation !== "RESET" || resetBusy} onClick={resetDevice}>{resetBusy ? "Resetting…" : "Reset this device"}</Button></div>
          {resetError && <p role="alert" className="mt-3 text-sm text-destructive">{resetError}</p>}
        </section>

        <div className="mt-6 rounded-xl border-2 border-ink-300 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-semibold text-ink-900">🕶️ Disguise Mode</h3>
              <p className="mt-1 text-sm text-ink-700">
                Install the app so it shows up on your home screen as a plain
                <strong> Calculator</strong> — calculator icon, calculator name.
                Calculator is the default name and icon when you install.
              </p>
            </div>
          </div>
          {disguise && (
            <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-ink-700">
              When your phone asks for a name during install, keep it as
              <strong> “Calculator”</strong>. On iPhone you can also type
              <strong> Calculator</strong> in the “Add to Home Screen” name field.
            </p>
          )}
        </div>

        <div className="mt-4 rounded-xl border-2 border-red-600 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-semibold text-ink-900">🔢 Calculator Passcode Lock</h3>
              <p className="mt-1 text-sm text-ink-700">
                When on, the app opens as a working calculator. To reveal the real
                app, type your chosen calculation (e.g. <code>7+3</code>) and press
                <strong> =</strong>. Wrong entries just show a normal calculator
                result — no error, no hint.
              </p>
              <ul className="mt-2 ml-5 list-disc text-xs text-ink-500">
                <li>First launch after turning it on: your first <code>calc =</code> becomes the passcode.</li>
                <li>To turn it off from inside the calculator, <strong>double-tap the display</strong>.</li>
                <li>You can always turn it back on here.</li>
              </ul>
              {gateOn && (
                <button
                  type="button"
                  onClick={resetPasscode}
                  className="mt-3 text-xs font-semibold text-red-700 underline"
                >
                  Reset passcode
                </button>
              )}
            </div>
            <label className="flex shrink-0 cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={gateOn}
                onChange={(e) => toggleGate(e.target.checked)}
                className="h-5 w-5 accent-red-600"
                data-testid="toggle-calc-lock"
              />
              <span className="text-sm font-semibold text-ink-900">
                {gateOn ? "On" : "Off"}
              </span>
            </label>
          </div>
        </div>

        {installed && (
          <div className="mt-8 rounded-xl border-2 border-green-600 bg-green-50 p-6 text-center">
            <p className="text-xl font-semibold text-green-900">✓ Installed on this device</p>
            <p className="mt-1 text-sm text-green-800">Look for the Calculator icon on your home screen.</p>
          </div>
        )}

        {!installed && installEvent && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={handleInstall}
              className="btn-rose text-lg"
              data-testid="btn-install-app"
            >
              {disguise ? "🧮 Install as Calculator" : "📥 Install Now"}
            </button>
          </div>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Card active={platform === "ios"} title="📱 iPhone / iPad (iOS)">
            <ol className="ml-5 list-decimal space-y-2 text-sm text-ink-700">
              <li>Open <strong>mrsanonymous.org</strong> in <strong>Safari</strong> (not Chrome).</li>
              <li>Tap the <strong>Share</strong> button <span aria-label="share icon">⬆️</span> at the bottom.</li>
              <li>Scroll and tap <strong>“Add to Home Screen”</strong>.</li>
              <li>Keep the name <strong>Calculator</strong>, then tap <strong>Add</strong>.</li>
            </ol>
          </Card>

          <Card active={platform === "android"} title="🤖 Android">
            <ol className="ml-5 list-decimal space-y-2 text-sm text-ink-700">
              <li>Open <strong>mrsanonymous.org</strong> in <strong>Chrome</strong>.</li>
              <li>Tap the <strong>⋮</strong> menu (top-right).</li>
              <li>Choose <strong>“Install app”</strong>, or <strong>“Add to Home screen” → “Install”</strong> if offered.</li>
              <li>Keep <strong>Calculator</strong> and confirm. If the choice says <strong>“Create shortcut”</strong>, expect a small Chrome badge; this is not the same installation.</li>
            </ol>
          </Card>
        </div>

        <div className="mt-10 rounded-xl border border-ink-300 bg-white p-6">
          <h2 className="font-serif text-2xl font-semibold text-ink-900">Why install?</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-700">
            <li>🚨 One-tap emergency access for your selected country, hotlines, and the Signal for Help.</li>
            <li>🌐 Multiple languages with translation for supported emergency texts.</li>
            <li>🔒 Quick Exit and history-clearing safety features built in.</li>
            <li>📓 Your private notebooks — always with you, always anonymous.</li>
            <li>Opens from your home screen; loading depends on your device and connection. Offline access is not included.</li>
          </ul>
        </div>

        <div className="mt-8 rounded-xl border border-amber-300 bg-amber-50 p-6">
          <h3 className="font-serif text-lg font-semibold text-ink-900">Safety tip</h3>
          <p className="mt-2 text-sm text-ink-700">
            You can rename the app icon on your home screen to something innocuous like “Notes” or
            “Weather” after installing, if you need extra discretion.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-ink-300 bg-white p-6">
          <h2 className="font-serif text-2xl font-semibold text-ink-900">App store information</h2>
          <p className="mt-2 text-sm text-ink-700">
            Required disclosures for Apple App Store and Google Play distribution:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink-700">
            <li>
              <strong>Not an emergency service.</strong> In danger, call your local emergency number.
            </li>
            <li>
              <a
                href={`tel:${emergency.police}`}
                className="btn-rose inline-flex !px-3 !py-1.5 !text-xs"
              >
                Call {emergency.policeLabel}
              </a>
            </li>
            <li><strong>Age rating:</strong> 12+ / Teen — includes sensitive discussion of abuse.</li>
            <li><strong>Accounts:</strong> nickname only, no email or phone number required.</li>
            <li><strong>Delete your account and all data</strong> at any time from <a href="/settings" className="text-rose-600 underline">Settings</a> — see <a href="/delete-account" className="text-rose-600 underline">how to delete your data</a>.</li>
            <li><strong>User-generated content:</strong> every shared story can be reported or its author blocked; reports are reviewed within 24 hours.</li>
            <li>
              <a href="/privacy" className="text-rose-600 underline">Privacy Policy</a> ·{" "}
              <a href="/terms" className="text-rose-600 underline">Terms of Use</a> ·{" "}
              <a href="/contact" className="text-rose-600 underline">Support</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Card({ title, active, children }: { title: string; active: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`rounded-xl border-2 bg-white p-6 ${
        active ? "border-rose-500 shadow-lg" : "border-ink-300"
      }`}
    >
      <h3 className="font-serif text-xl font-semibold text-ink-900">
        {title} {active && <span className="ml-1 text-xs text-rose-600"><span className="rtl-flip inline-block">←</span> your device</span>}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}