import aj, {
  detectBot,
  sensitiveInfo,
  shield,
  slidingWindow,
} from "@/lib/arcjet";
import { base } from "../base";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const buildAiAj = () =>
  aj
    .withRule(
      shield({
        mode: "LIVE",
      })
    )
    .withRule(
      slidingWindow({
        mode: "LIVE",
        interval: "1m",
        max: 3,
      })
    )
    .withRule(
      detectBot({
        mode: "LIVE",
        allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
      })
    )
    .withRule(
      sensitiveInfo({
        mode: "LIVE",
        deny: ["PHONE_NUMBER", "CREDIT_CARD_NUMBER"],
      })
    );

export const aiSecurityMiddleware = base
  .$context<{
    request: Request;
    user: KindeUser<Record<string, unknown>>;
  }>()
  .middleware(async ({ context, next, errors }) => {
    const decision = await buildAiAj().protect(context.request, {
      userId: context.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        throw errors.BAD_REQUEST({
          message:
            "Đã phát hiện thấy thông tin Senstivie. Vui lòng xóa PII (e.g., số điện thoại, số thẻ tín dụng).",
        });
      }

      if (decision.reason.isRateLimit()) {
        throw errors.RATE_LIMITED({
          message: "Quá nhiều yêu cầu. Vui lòng thử lại sau.",
        });
      }

      if (decision.reason.isBot()) {
        throw errors.FORBIDDEN({
          message: "Lưu lượng truy cập tự động bị chặn",
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
