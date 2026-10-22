import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRegion } from "@/hooks/use-region";
import { getEmergency } from "@/lib/emergency-numbers";
import mysticMindedLogo from "@/assets/mysticminded-logo-rbw-exact.png";

export function Footer() {
  const [brandOpen, setBrandOpen] = useState(false);
  const { lang } = useLanguage();
  const { country } = useRegion();
  const emergency = getEmergency(lang, country);
  return (
    <footer className="border-t border-ink-300 bg-white">
      <div className="mx-auto max-w-7xl px-5 pb-[max(180px,25vh)] pt-10 lg:px-10">
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

          <div className="group mt-2 flex flex-col items-center gap-1 md:gap-3">
            <button
              type="button"
              onClick={() => setBrandOpen(true)}
              className="border-0 bg-transparent p-0"
              aria-label="About MysticMinded33"
            >
              <img
                src={mysticMindedLogo}
                alt="MysticMinded³³ logo"
                className="h-[35vh] max-h-[420px] w-auto cursor-pointer transition-transform hover:scale-[1.03]"
                loading="lazy"
              />
            </button>

            <a
              href="https://www.mysticminded33.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group/a block"
              aria-label="Visit MysticMinded33"
            >
              <p className="text-center font-serif text-4xl font-black leading-[1.05] tracking-tight text-ink-900 md:text-5xl lg:text-6xl">
                Brought to you by
                <br className="md:hidden" />{" "}
                <span className="text-rose-500">
                  MysticMinded
                  <sup className="text-2xl font-black md:text-4xl">33</sup>
                </span>
              </p>
              <span className="font-serif text-sm font-bold leading-none tracking-wide text-rose-500 underline decoration-rose-500/40 decoration-2 underline-offset-8 group-hover/a:decoration-rose-500 md:text-lg">
                mysticminded33.com
              </span>
            </a>
          </div>

        </div>
      </div>

      {brandOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink-900/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="About MysticMinded33"
          onClick={() => setBrandOpen(false)}
        >
          <div
            className="relative max-h-[80dvh] w-full max-w-md overflow-y-auto rounded-2xl border-2 border-rose-500 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setBrandOpen(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-ink-300 bg-white text-lg font-bold text-ink-900 hover:border-rose-500 hover:text-rose-500"
              aria-label="Close"
            >
              ×
            </button>
            <img
              src={mysticMindedLogo}
              alt="MysticMinded³³ logo"
              className="mx-auto h-24 w-24 rounded-full object-contain"
            />
            <h2 className="mt-3 text-center font-serif text-2xl font-black text-ink-900">
              What is MysticMinded³³?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              MysticMinded³³ is the independent creator brand behind MrsANONymous.org.
              It builds free, anonymous safety tools for women and girls — designed to
              protect privacy first: the app hides behind a calculator, there are no
              names or emails required, and every feature is made so help is one tap
              away when it matters most.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              Visit <span className="font-bold text-rose-500">mysticminded33.com</span> to
              learn more about the mission and what's next.
            </p>
            <a
              href="https://www.mysticminded33.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-rose mt-5 block text-center"
            >
              Visit mysticminded33.com ↗
            </a>
          </div>
        </div>
      )}
    </footer>
  );
}
