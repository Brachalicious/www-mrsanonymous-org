import { z } from "zod";

export const boardModerationSchema = z.object({
  notebookId: z.string().uuid(),
  remove: z.boolean(),
  notice: z.string().trim().min(1).max(4000).optional(),
}).refine((data) => data.remove || Boolean(data.notice), {
  message: "Write a policy notice or select removal.",
});

export function requireAdminRole(isAdmin: boolean | null, error?: unknown) {
  if (error || isAdmin !== true) throw new Error("Forbidden");
}