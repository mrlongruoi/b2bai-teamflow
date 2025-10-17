import z from "zod";

export const workspaceSchema = z.object({
  name: z
    .string()
    .min(2, "Tên ít nhất 2 ký tự.")
    .max(50, "Tên tối đa 50 ký tự."),
});

export type WorkspaceSchemaType = z.infer<typeof workspaceSchema>;
