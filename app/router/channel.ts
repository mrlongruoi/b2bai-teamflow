import z from "zod";
import { base } from "../middlewares/base";
import { ChannelNameSchema } from "../schemas/channel";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { requiredWorkspaceMiddleware } from "../middlewares/workspace";
import { standardSecurityMiddleware } from "../middlewares/arcjet/standard";
import { heavyWriteSecurityMiddleware } from "../middlewares/arcjet/heavy-write";
import prisma from "@/lib/db";
import { Channel } from "@/lib/generated/prisma";
import {
  init,
  organization_user,
  Organizations,
} from "@kinde/management-api-js";
import { KindeOrganization, KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { readSecurityMiddleware } from "../middlewares/arcjet/read";

export const createChannel = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(heavyWriteSecurityMiddleware)
  .route({
    method: "POST",
    path: "/channels",
    summary: "Tạo kênh mới trong không gian làm việc",
    tags: ["channels"],
  })
  .input(ChannelNameSchema)
  .output(z.custom<Channel>())
  .handler(async ({ input, context }) => {
    const channel = await prisma.channel.create({
      data: {
        name: input.name,
        workspaceId: context.workspace.orgCode,
        createdById: context.user.id,
      },
    });

    return channel;
  });

export const listChannels = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .route({
    method: "GET",
    path: "/channels",
    summary: "Danh sách tất cả các kênh",
    tags: ["channels"],
  })
  .input(z.void())
  .output(
    z.object({
      channels: z.array(z.custom<Channel>()),
      currentWorkspace: z.custom<KindeOrganization<unknown>>(),
      members: z.array(z.custom<organization_user>()),
    })
  )
  .handler(async ({ context }) => {
    const [channels, members] = await Promise.all([
      prisma.channel.findMany({
        where: {
          workspaceId: context.workspace.orgCode,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      (async () => {
        init();

        const usersInOrg = await Organizations.getOrganizationUsers({
          orgCode: context.workspace.orgCode,
          sort: "name_desc",
        });

        return usersInOrg.organization_users ?? [];
      })(),
    ]);

    return {
      channels,
      members,
      currentWorkspace: context.workspace,
    };
  });

export const getChannel = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(readSecurityMiddleware)
  .route({
    method: "GET",
    path: "/channels/:channelId",
    summary: "Nhận kênh theo ID",
    tags: ["channels"],
  })
  .input(z.object({ channelId: z.string() }))
  .output(
    z.object({
      channelName: z.string(),
      currentUser: z.custom<KindeUser<Record<string, unknown>>>(),
    })
  )
  .handler(async ({ context, input, errors }) => {
    const channel = await prisma.channel.findUnique({
      where: {
        id: input.channelId,
        workspaceId: context.workspace.orgCode,
      },
      select: {
        name: true,
      },
    });

    if (!channel) {
      throw errors.NOT_FOUND();
    }

    return {
      channelName: channel.name,
      currentUser: context.user,
    };
  });
