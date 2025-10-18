import { createChannel } from "./channel";
import { createWorkspaces, listWorkspaces } from "./workspace";

export const router = {
  workspace: {
    list: listWorkspaces,
    create: createWorkspaces,
  },

  channel: {
    create: createChannel,
  },
};
