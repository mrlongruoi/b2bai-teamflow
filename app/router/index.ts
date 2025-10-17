import { createWorkspaces, listWorkspaces } from "./workspace";

export const router = {
  workspace: {
    list: listWorkspaces,
    create: createWorkspaces,
  },
};
