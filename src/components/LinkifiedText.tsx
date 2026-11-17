import { splitTextLinks } from "@/lib/linkify";
import { SafeExternalButton } from "@/components/SafeExternalButton";

/**
 * Render message text with any web addresses as clickable links. Links use
 * the same safe external-opening confirmation as the Resources page, so the
 * resource opens in a new tab and this tab switches away for protection.
 */
export function LinkifiedText({
  text,
  linkClassName,
}: {
  text: string;
  linkClassName?: string;
}) {
  const parts = splitTextLinks(text);
  return (
    <>
      {parts.map((part, index) =>
        part.type === "link" ? (
          <SafeExternalButton
            key={index}
            url={part.href!}
            label={part.value}
            className={
              linkClassName ?? "inline break-all font-semibold text-rose-700 underline"
            }
          >
            {part.value}
          </SafeExternalButton>
        ) : (
          <span key={index}>{part.value}</span>
        ),
      )}
    </>
  );
}
