import { createChannel, listChannels } from "./channel";
import { createMessage } from "./message";
import { createWorkspaces, listWorkspaces } from "./workspace";

export const router = {
  workspace: {
    list: listWorkspaces,
    create: createWorkspaces,
  },

  channel: {
    create: createChannel,
    list: listChannels,
  },

  message: {
    create: createMessage,
  }
};
