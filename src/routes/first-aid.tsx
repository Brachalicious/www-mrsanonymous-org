import { createFileRoute } from "@tanstack/react-router";
import { HeartPulse, Bandage, Flame, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegion } from "@/hooks/use-region";
import { useLanguage } from "@/contexts/LanguageContext";
import { getEmergency } from "@/lib/emergency-numbers";

export const Route = createFileRoute("/first-aid")({
  head: () => ({ meta: [
    { title: "First Aid & CPR — MrsANONymous.org" },
    { name: "description", content: "Emergency first-aid references for adult CPR, bleeding, burns and choking, with age-specific cautions and authoritative sources." },
    { property: "og:title", content: "First Aid & CPR — MrsANONymous.org" },
    { property: "og:description", content: "Basic emergency guidance and links to American Heart Association and Red Cross training." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: FirstAid,
});

function FirstAid() {
  const { country } = useRegion();
  const { lang } = useLanguage();
  const emergency = getEmergency(lang, country);
  return <div className="mx-auto max-w-3xl px-5 py-12 text-foreground">
    <HeartPulse className="h-12 w-12 text-destructive" aria-hidden />
    <h1 className="mt-4 font-serif text-4xl font-bold">First aid & CPR</h1>
    <p className="mt-4 text-lg font-semibold">Make sure the scene is safe. Call your local emergency number and follow the dispatcher’s instructions.</p>
    <Button asChild variant="destructive" className="mt-4"><a href={`tel:${emergency.police}`}>Call {emergency.policeLabel}</a></Button>
    <p className="mt-4 text-sm text-muted-foreground">General educational guidance, not medical advice or a substitute for training. This app does not contact responders for you. Use gloves or a barrier if available. Do not put yourself in danger.</p>

    <section className="mt-8 border-t border-border py-6">
      <h2 className="flex items-center gap-3 text-2xl font-bold"><HeartPulse />Adult hands-only CPR</h2>
      <p className="mt-3 font-semibold">For a teen or adult who suddenly collapses, is unresponsive, and is not breathing normally or is only gasping.</p>
      <ol className="mt-4 list-decimal space-y-3 pl-6">
        <li>Call emergency services on speakerphone. Ask someone to get an AED.</li>
        <li>Place the person on their back on a firm, flat surface. Put the heel of one hand in the center of the chest, with the other hand on top.</li>
        <li>Push hard and fast: 100–120 compressions each minute, at least 2 inches (5 cm) deep in an average adult, avoiding more than 2.4 inches (6 cm). Keep arms straight and let the chest fully recoil.</li>
        <li>Continue until trained help takes over, the person shows signs of life, you cannot continue, or the scene becomes unsafe. Turn on the AED and follow its prompts; do not touch the person when it analyzes or shocks.</li>
      </ol>
      <p className="mt-4 font-semibold">Children, infants, drowning and breathing-related arrests need age-appropriate CPR with breaths. Follow the dispatcher and your training; do not assume these adult instructions apply.</p>
      <Source href="https://www.redcross.org/take-a-class/cpr/performing-cpr/hands-only-cpr">Red Cross: hands-only CPR</Source>
      <Source href="https://cpr.heart.org/en/resources/what-is-cpr">American Heart Association: CPR basics</Source>
    </section>

    <section className="border-t border-border py-6">
      <h2 className="flex items-center gap-3 text-2xl font-bold"><Bandage />Severe bleeding</h2>
      <p className="mt-3">Call for emergency help for spurting or continuous bleeding, a large amount of blood, or signs of shock. Apply firm, steady direct pressure with gauze or a clean cloth. If an object is embedded, do not remove it; press around it.</p>
      <p className="mt-3">For life-threatening arm or leg bleeding, use a commercial tourniquet if available and you know how; follow its directions and do not loosen it. Wound packing requires training. Keep the person warm and monitor breathing.</p>
      <Source href="https://www.redcross.org/take-a-class/resources/learn-first-aid/bleeding-life-threatening-external">Red Cross: life-threatening bleeding</Source>
    </section>

    <section className="border-t border-border py-6">
      <h2 className="flex items-center gap-3 text-2xl font-bold"><Flame />Burns</h2>
      <p className="mt-3">Move away from the heat source if safe. Cool the burn with cool, clean running water. Do not use ice, butter or grease. Do not pull away material stuck to the skin. Cover loosely with a clean, nonstick dressing.</p>
      <p className="mt-3">Get urgent care for deep or extensive burns, or burns to the face, mouth, hands, feet, joints or genitals. Call emergency services for serious burns, chemical or electrical injury, or breathing difficulty. Keep the rest of the body warm, especially in children.</p>
      <Source href="https://www.redcross.org/take-a-class/resources/learn-first-aid/burns">Red Cross: burns</Source>
    </section>

    <section className="border-t border-border py-6">
      <h2 className="flex items-center gap-3 text-2xl font-bold"><Wind />Choking</h2>
      <p className="mt-3">If the person can cough forcefully, speak or breathe, encourage coughing and monitor them. Do not perform thrusts while the cough is effective.</p>
      <p className="mt-3">For a conscious adult or child who cannot speak, breathe or cough effectively: have someone call emergency services. Alternate 5 back blows with 5 abdominal thrusts until the object comes out or the person becomes unresponsive. Use chest thrusts instead for pregnancy or when you cannot reach around the abdomen.</p>
      <p className="mt-3 font-semibold">Infants under 1 year: alternate 5 back blows and 5 chest thrusts. Never use abdominal thrusts. Follow the dispatcher’s age-specific instructions.</p>
      <p className="mt-3">If the person becomes unresponsive, lower them safely and begin age-appropriate CPR as directed. Remove an object only if you can see it; never sweep blindly with a finger.</p>
      <Source href="https://www.redcross.org/take-a-class/resources/learn-first-aid/adult-child-choking">Red Cross: adult and child choking</Source>
      <Source href="https://www.redcross.org/take-a-class/resources/learn-first-aid/infant-choking">Red Cross: infant choking</Source>
    </section>
    <p className="text-sm text-muted-foreground">References checked October 23, 2026. Take an accredited first-aid and CPR course for hands-on practice.</p>
  </div>;
}

function Source({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} className="mt-3 block text-sm font-semibold text-primary underline underline-offset-4">{children} ↗</a>;
}