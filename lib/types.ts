import { Message } from "./generated/prisma";
import { GroupedReactionSchemaType } from "@/app/schemas/message";

export type MessageListItem = Message & {
  replyCount: number;
  reactions: GroupedReactionSchemaType[];
}