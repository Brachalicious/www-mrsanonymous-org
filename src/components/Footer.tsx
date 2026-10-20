import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRegion } from "@/hooks/use-region";
import { getEmergency } from "@/lib/emergency-numbers";
import mysticMindedLogo from "@/assets/mysticminded-logo-rbw-exact.png";
import mascotAsset from "@/assets/app-guidance-mascot.jpeg.asset.json";
import { Button } from "@/components/ui/button";

export function Footer() {
  const { lang } = useLanguage();
  const { country } = useRegion();
  const emergency = getEmergency(lang, country);
  return (
    <footer className="border-t border-ink-300 bg-white">
      <div className="mx-auto max-w-7xl px-5 pb-[184px] pt-10 lg:px-10 md:pb-28">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link to="/" className="group flex flex-col items-center leading-none md:items-start">
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-2xl tracking-tight text-ink-900">Mrs</span>
              <span className="font-serif text-2xl italic text-rose-500">ANONymous</span>
              <span className="font-serif text-xl text-ink-300">.org</span>
            </div>
          </Link>

          <nav className="flex flex-wrap justify-center gap-6 text-sm text-ink-500">
            <Link to="/about" className="hover:text-rose-500">About us</Link>
            <Link to="/women" className="hover:text-rose-500">Women</Link>
            <Link to="/girls" className="hover:text-rose-500">Girls</Link>
            <Link to="/resources" className="hover:text-rose-500">Resources</Link>
            <Link to="/safety-plan" className="hover:text-rose-500">My Safety Plan</Link>
            <Link to="/contact" className="hover:text-rose-500">Contact</Link>
            <Link to="/privacy" className="hover:text-rose-500">Privacy</Link>
            <Link to="/terms" className="hover:text-rose-500">Terms</Link>
            <Link to="/delete-account" className="hover:text-rose-500">Delete account</Link>
            <Link to="/settings" className="hover:text-rose-500">Settings</Link>
          </nav>

          <div className="text-xs text-ink-400">
            © {new Date().getFullYear()} MrsANONymous.org
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-ink-400">
          This site is not a substitute for professional help or emergency services. If you are in danger,
          please call {emergency.policeLabel} or a trusted crisis line. All shared stories are anonymous and no identifying
          information is stored.
        </p>
        <div className="mt-3 text-center">
          <a
            href={`tel:${emergency.police}`}
            className="btn-rose !px-4 !py-2 !text-xs"
          >
            Call {emergency.policeLabel}
          </a>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-ink-300 pt-6">
          <Button asChild variant="ghost" className="mb-6 h-auto flex-col gap-2 p-3 hover:bg-secondary" title="Ask for app guidance">
            <Link to="/guidance" aria-label="Ask the mascot for app guidance">
              <img src={mascotAsset.url} alt="MrsANONymous guidance mascot with a red bow" className="h-64 w-48 object-contain" loading="lazy" />
              <span className="font-serif text-xl text-primary">Ask for app guidance</span>
            </Link>
          </Button>
          <a
            href="https://www.mysticminded33.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-2 flex flex-col items-center gap-4"
            aria-label="Visit MysticMinded33"
          >
            <img
              src={mysticMindedLogo}
              alt="MysticMinded³³ logo"
              className="h-44 w-auto transition-transform group-hover:scale-[1.03] md:h-72"
              loading="lazy"
            />

            <p className="pb-1 text-center font-serif text-4xl font-black leading-[1.15] tracking-tight text-ink-900 md:text-6xl">
              Brought to you by
              <br className="md:hidden" />{" "}
              <span className="text-rose-500">
                MysticMinded
                <sup className="text-2xl font-black md:text-4xl">33</sup>
              </span>
            </p>
            <span className="font-serif text-lg font-bold tracking-wide text-rose-500 underline decoration-rose-500/40 decoration-2 underline-offset-8 group-hover:decoration-rose-500 md:text-xl">
              mysticminded33.com
            </span>


          </a>

        </div>
      </div>
    </footer>
  );
}
