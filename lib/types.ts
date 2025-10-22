import { Message } from "./generated/prisma";

export type MessageListItem = Message & {
  repliesCount: number;
}