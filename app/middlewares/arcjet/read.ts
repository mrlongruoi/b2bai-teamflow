import arcjet, { slidingWindow } from "@/lib/arcjet";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { base } from "../base";

const buildStandardAj = () =>
  arcjet.withRule(
    slidingWindow({
        mode: "LIVE",
        interval: "1m",
        max: 180,
    })
  )

export const readSecurityMiddleware = base
  .$context<{
    request: Request;
    user: KindeUser<Record<string, unknown>>;
  }>()
  .middleware(async ({ context, next, errors }) => {
    const decision = await buildStandardAj().protect(context.request, {
      userId: context.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        throw errors.RATE_LIMITED({
          message: "Quá nhiều thay đổi tác động. Xin hãy chậm lại",
        });
      }

      throw errors.FORBIDDEN({
        message: "Yêu cầu bị chặn!",
      });
    }

    return next();
  });
