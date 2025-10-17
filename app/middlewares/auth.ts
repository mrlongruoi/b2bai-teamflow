import { redirect } from "next/navigation";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { base } from "./base";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const requiredAuthMiddleware = base
  .$context<{ session?: { user?: KindeUser<Record<string, unknown>> } }>()
  .middleware(async ({ context, next }) => {
    const session = context.session ?? (await getSession());

    if (!session.user) {
      return redirect("/api/auth/login");
    }

    return next({
      context: { user: session.user },
    });
  });

const getSession = async () => {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  return {
    user,
  };
};
