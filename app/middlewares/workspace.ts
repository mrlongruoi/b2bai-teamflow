import { KindeOrganization } from "@kinde-oss/kinde-auth-nextjs";
import { base } from "./base";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

type WorkspaceOrganization = KindeOrganization<Record<string, unknown> | null>;

export const requiredWorkspaceMiddleware = base
  .$context<{ workspace?: WorkspaceOrganization }>()
  .middleware(async ({ context, next, errors }) => {
    const workspace = context.workspace ?? (await getWorkspace());

    if (!workspace) {
      throw errors.FORBIDDEN();
    }

    return next({
      context: { workspace },
    });
  });

const getWorkspace = async (): Promise<WorkspaceOrganization | null> => {
  const { getOrganization } = getKindeServerSession();
  const organization = await getOrganization();
  return organization as WorkspaceOrganization | null;
};
