import arcjet, { detectBot, shield } from "@/lib/arcjet";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { base } from "../base";

const buildStandardAj = () =>
  arcjet
    .withRule(
      shield({
        mode: "LIVE",
      })
    )
    .withRule(
      detectBot({
        mode: "LIVE",
        allow: [
          "CATEGORY:SEARCH_ENGINE",
          "CATEGORY:PREVIEW",
          "CATEGORY:MONITOR",
        ],
      })
    );

export const standardSecurityMiddleware = base
  .$context<{
    request: Request;
    user: KindeUser<Record<string, unknown>>;
  }>()
  .middleware(async ({ context, next, errors }) => {
    const decision = await buildStandardAj().protect(context.request, {
      userId: context.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isBot()) {
        throw errors.FORBIDDEN({
          message: "Lưu lượng truy cập tự động bị chặn.",
        });
      }

      if (decision.reason.isShield()) {
        throw errors.FORBIDDEN({
          message: "Yêu cầu bị chặn bởi chính sách bảo mật (WAF).",
        });
      }

      throw errors.FORBIDDEN({
        message: "Yêu cầu bị chặn!",
      });
    }

    return next();
  });
