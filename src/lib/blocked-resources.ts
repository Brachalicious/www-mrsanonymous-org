/**
 * Some crisis organizations (thehotline.org, rainn.org, ...) refuse to be
 * displayed inside another app or site — their servers send framing blocks
 * we cannot override. When that happens the user must never hit a dead end:
 * for known hotlines we show their direct call / text / chat actions inside
 * MrsANONymous instead, so help stays one tap away.
 */

export interface BlockedResourceAction {
  label: string;
  href: string;
  /** "call" | "text" render as direct device actions; "chat" opens a new tab. */
  kind: "call" | "text" | "chat";
}

export interface BlockedResource {
  title: string;
  note: string;
  actions: BlockedResourceAction[];
}

const KNOWN: { hosts: string[]; resource: BlockedResource }[] = [
  {
    hosts: ["thehotline.org", "www.thehotline.org"],
    resource: {
      title: "National Domestic Violence Hotline",
      note: "Their website cannot open inside any app — but every way to reach them works right here, 24/7, free and confidential.",
      actions: [
        { label: "Call 1-800-799-7233", href: "tel:18007997233", kind: "call" },
        { label: "Text START to 88788", href: "sms:88788?body=START", kind: "text" },
        { label: "Open their live chat", href: "https://www.thehotline.org/", kind: "chat" },
      ],
    },
  },
  {
    hosts: ["rainn.org", "www.rainn.org"],
    resource: {
      title: "National Sexual Assault Hotline (RAINN)",
      note: "Their website cannot open inside any app — but you can still reach them directly, 24/7, free and anonymous.",
      actions: [
        { label: "Call 1-800-656-4673", href: "tel:18006564673", kind: "call" },
        { label: "Open their live chat", href: "https://www.rainn.org/", kind: "chat" },
      ],
    },
  },
  {
    hosts: ["loveisrespect.org", "www.loveisrespect.org"],
    resource: {
      title: "Love Is Respect (dating abuse)",
      note: "Their website cannot open inside any app — but you can still reach them directly, 24/7.",
      actions: [
        { label: "Call 1-866-331-9474", href: "tel:18663319474", kind: "call" },
        { label: "Text LOVEIS to 22522", href: "sms:22522?body=LOVEIS", kind: "text" },
        { label: "Open their live chat", href: "https://www.loveisrespect.org/", kind: "chat" },
      ],
    },
  },
  {
    hosts: ["chat.trvr.org", "thetrevorproject.org", "www.thetrevorproject.org"],
    resource: {
      title: "The Trevor Project (LGBTQ+ youth crisis)",
      note: "Their website cannot open inside any app — but you can still reach them directly, 24/7.",
      actions: [
        { label: "Call 866-488-7386", href: "tel:8664887386", kind: "call" },
        { label: "Text START to 678678", href: "sms:678678?body=START", kind: "text" },
        { label: "Open TrevorChat", href: "https://chat.trvr.org/", kind: "chat" },
      ],
    },
  },
];

/** Look up direct contact actions for a blocked site, by host. */
export function blockedResourceFor(url: string): BlockedResource | null {
  let host: string;
  try {
    host = new URL(url).host.toLowerCase();
  } catch {
    return null;
  }
  for (const entry of KNOWN) {
    if (entry.hosts.includes(host)) return entry.resource;
  }
  return null;
}
