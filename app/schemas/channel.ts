import z from "zod";

export function transformChannelName(name: string): string {
  return name
    .toLowerCase()
    .replaceAll(/\s+/g, "-")
    .replaceAll(/[^a-z0-9-]/g, "")
    .replaceAll(/-+/g, "-")
    .replaceAll(/(^-)|(-$)/g, "");
}

export const ChannelNameSchema = z.object({
  name: z
    .string()
    .min(2, "Tên ít nhất 2 kí tự")
    .max(50, "Tên tối đa 50 kí tự")
    .transform((name, ctx) => {
      const transformed = transformChannelName(name);

      if (transformed.length < 2) {
        ctx.addIssue({
          code: "custom",
          message: "Tên kênh phải chứa ít nhất 2 ký tự sau khi chuyển đổi",
        });

        return z.NEVER;
      }

      return transformed;
    }),
});

export type ChannelSchemaNameType = z.infer<typeof ChannelNameSchema>;