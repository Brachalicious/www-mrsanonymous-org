import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/ContactForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "App Support — MrsANONymous.org" },
      { name: "description", content: "MrsANONymous.org app support: technical issues, site guidance, account support, and feedback. Not therapy or crisis counseling." },
      { property: "og:title", content: "App Support — MrsANONymous.org" },
      { property: "og:description", content: "We help with technical issues, site guidance, account support, and feedback. We do not provide therapy or emergency response." },

      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:px-10">
      <div className="mb-8 text-center">
        <h1 className="mt-2 font-serif text-4xl text-ink-900">App support</h1>
        <p className="mx-auto mt-4 max-w-2xl text-ink-600">
          Questions about MrsANONymous.org or trouble using the app? We can help with technical issues, site
          guidance, account support, and feedback. Contact us below. For personal support, contact a qualified
          professional or a crisis hotline directly.
        </p>

      </div>
      <ContactForm audience="women" />
    </div>
  );
}
