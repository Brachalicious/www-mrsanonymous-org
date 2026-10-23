import { z } from "zod";

export function nicknameKey(nickname: string) {
  return `${nickname.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")}@mrsanonymous.local`;
}

export const accountBlockSchema = z.object({
  userId: z.string().uuid(),
  blocked: z.boolean(),
  confirmation: z.enum(["BLOCK", "UNBLOCK"]),
}).refine((data) => data.confirmation === (data.blocked ? "BLOCK" : "UNBLOCK"), "Confirmation does not match action");

export const SUPPORT_ACKNOWLEDGMENT = "Automatic reply: Message received. MrsANONymous is not an emergency service. This inbox is not continuously monitored and is not monitored for emergencies. We do not provide therapy, counseling, medical advice, or crisis response. If you are in danger or need urgent help, contact your local emergency number or a crisis hotline directly. We can help with technical issues, site guidance, account support, and feedback.";