import { splitTextLinks } from "@/lib/linkify";
import { SafeExternalButton } from "@/components/SafeExternalButton";

/**
 * Render message text with web addresses and phone numbers clickable. Web
 * links use the same safe external-opening confirmation as the Resources
 * page; phone numbers open the dialer directly via tel: links, since calling
 * is the intended action and must not trigger the tab-switch protection.
 */
export function LinkifiedText({
  text,
  linkClassName,
}: {
  text: string;
  linkClassName?: string;
}) {
  const parts = splitTextLinks(text);
  const linkClass = linkClassName ?? "inline break-all font-semibold text-rose-700 underline";
  return (
    <>
      {parts.map((part, index) =>
        part.type === "link" ? (
          <SafeExternalButton key={index} url={part.href!} label={part.value} className={linkClass}>
            {part.value}
          </SafeExternalButton>
        ) : part.type === "tel" ? (
          <a key={index} href={part.href} className={linkClass}>
            {part.value}
          </a>
        ) : (
          <span key={index}>{part.value}</span>
        ),
      )}
    </>
  );
}
