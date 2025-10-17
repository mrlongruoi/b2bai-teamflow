import { os } from "@orpc/server";

export const base = os.$context<{ request: Request }>().errors({
  RATE_LIMITED: {
    message: "Bạn đã đạt tới giới hạn.",
  },
  BAD_REQUEST: {
    message: "Yêu cầu không hợp lệ.",
  },
  NOT_FOUND: {
    message: "Không tìm thấy.",
  },
  FORBIDDEN: {
    message: "Bạn không có quyền truy cập.",
  },
  UNAUTHORIZED: {
    message: "Bạn không được phép.",
  },
  INTERNAL_SERVER_ERROR: {
    message: "Lỗi máy chủ nội bộ.",
  },
});
