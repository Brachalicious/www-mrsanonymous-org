import { z } from "zod";

export const TRIGGER_OPTIONS = ["Sexual abuse / assault", "Physical violence", "Emotional abuse", "Child abuse", "Self-harm", "Suicide", "Stalking", "Threats", "Substance use", "Grief / loss"] as const;
export const triggerWarningsSchema = z.array(z.enum(TRIGGER_OPTIONS)).transform((items) => [...new Set(items)]).default([]);
export const pinPageSchema = z.object({ id: z.string().uuid(), pinned: z.boolean() });

export function orderPages<T extends { pinned_at: string | null; created_at: string; id: string }>(pages: T[]): T[] {
  return [...pages].sort((a, b) => {
    if (a.pinned_at && !b.pinned_at) return -1;
    if (!a.pinned_at && b.pinned_at) return 1;
    return (b.pinned_at ?? b.created_at).localeCompare(a.pinned_at ?? a.created_at) || a.id.localeCompare(b.id);
  });
}

export function requirePageOwner(actualOwner: string, caller: string) {
  if (actualOwner !== caller) throw new Error("Forbidden");
}

export function requireDeletableAccount(caller: string, target: string, targetIsAdmin: boolean) {
  if (caller === target) throw new Error("Use account settings to delete your own account.");
  if (targetIsAdmin) throw new Error("Admin accounts are protected from this deletion control.");
}