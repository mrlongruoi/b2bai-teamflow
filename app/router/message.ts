import z from "zod";
import prisma from "@/lib/db";
import { base } from "../middlewares/base";
import { getAvatar } from "@/lib/get-avatar";
import { Message } from "@/lib/generated/prisma";
import { createMessageSchema, updateMessageSchema } from "../schemas/message";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { writeSecurityMiddleware } from "../middlewares/arcjet/write";
import { requiredWorkspaceMiddleware } from "../middlewares/workspace";
import { standardSecurityMiddleware } from "../middlewares/arcjet/standard";
import { readSecurityMiddleware } from "../middlewares/arcjet/read";

export const createMessage = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .route({
    method: "POST",
    path: "/messages",
    summary: "Tạo tin nhắn mới trong kênh",
    tags: ["Messages"],
  })
  .input(createMessageSchema)
  .output(z.custom<Message>())
  .handler(async ({ input, context, errors }) => {
    // verify the channel belongs to the user's organization
    const channel = await prisma.channel.findFirst({
      where: {
        id: input.channelId,
        workspaceId: context.workspace.orgCode,
      },
    });

    if (!channel) {
      throw errors.FORBIDDEN();
    }

    const created = await prisma.message.create({
      data: {
        content: input.content,
        imageUrl: input.imageUrl,
        channelId: input.channelId,
        authorId: context.user.id,
        authorEmail: context.user.email!,
        authorName: context.user.given_name ?? "John Doe",
        authorAvatar: getAvatar(context.user.picture, context.user.email!),
      },
    });

    return {
      ...created,
    };
  });

export const listMessages = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(readSecurityMiddleware)
  .route({
    method: "GET",
    path: "/messages",
    summary: "Danh sách tất cả tin nhắn trong kênh",
    tags: ["Messages"],
  })
  .input(
    z.object({
      channelId: z.string(),
      limit: z
        .number()
        .min(1, "Giới hạn tối thiểu 1")
        .max(100, "Giới hạn tối đa 100")
        .optional(),
      cursor: z.string().optional(),
    })
  )
  .output(
    z.object({
      items: z.array(z.custom<Message>()),
      nextCursor: z.string().optional(),
    })
  )
  .handler(async ({ input, context, errors }) => {
    const channel = await prisma.channel.findFirst({
      where: {
        id: input.channelId,
        workspaceId: context.workspace.orgCode,
      },
    });

    if (!channel) {
      throw errors.FORBIDDEN();
    }

    const limit = input.limit ?? 30;

    const messages = await prisma.message.findMany({
      where: {
        channelId: input.channelId,
      },
      ...(input.cursor
        ? {
            cursor: { id: input.cursor },
            skip: 1,
          }
        : {}),
      take: limit,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    const nextCursor =
      messages.length === limit ? messages[messages.length - 1].id : undefined;

    return {
      items: messages,
      nextCursor,
    };
  });

export const updateMessage = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .route({
    method: "PUT",
    path: "/messages/:messageId",
    summary: "Cập nhật tin nhắn",
    tags: ["Messages"],
  })
  .input(updateMessageSchema)
  .output(
    z.object({
      message: z.custom<Message>(),
      canEdit: z.boolean(),
    })
  )
  .handler(async ({ input, context, errors }) => {
    const message = await prisma.message.findFirst({
      where: {
        id: input.messageId,
        Channel: {
          workspaceId: context.workspace.orgCode,
        },
      },
      select: {
        id: true,
        authorId: true,
      },
    });

    if (!message) {
      throw errors.NOT_FOUND();
    }

    if (message.authorId !== context.user.id) {
      throw errors.FORBIDDEN();
    }

    const updated = await prisma.message.update({
      where: {
        id: input.messageId,
      },
      data: {
        content: input.content,
      },
    });

    return {
      message: updated,
      canEdit: updated.authorId === context.user.id,
    };
  });
