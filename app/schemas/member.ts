import z from "zod";

export const inviteMemberSchema = z.object({
  name: z.string().min(3, "Tối thiểu 3 ký tự").max(50, "Tối đa 50 ký tự"),
  email: z.string().email(),
});

export type InviteMemberSchemaType = z.infer<typeof inviteMemberSchema>;