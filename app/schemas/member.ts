import z from "zod";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const inviteMemberSchema = z.object({
  name: z.string().min(3, "Tối thiểu 3 ký tự").max(50, "Tối đa 50 ký tự"),
  email: z.string().regex(EMAIL_REGEX, { message: "Please provide a valid email." }),
});

export type InviteMemberSchemaType = z.infer<typeof inviteMemberSchema>;