import z from "zod";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import prisma from "@/lib/db";
import { base } from "../middlewares/base";
import { tipTapJsonToMarkdown } from "@/lib/json-to-markdown";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { requiredWorkspaceMiddleware } from "../middlewares/workspace";
import { streamToEventIterator } from "@orpc/server";
import { aiSecurityMiddleware } from "../middlewares/arcjet/ai";

const openrouter = createOpenRouter({
  apiKey: process.env.LLM_KEY,
});

const MODEL_ID = "z-ai/glm-4.5-air:free";

const model = openrouter.chat(MODEL_ID);

export const generateThreadSummary = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(aiSecurityMiddleware)
  .route({
    method: "GET",
    path: "/ai/thread/summary",
    summary: "Tạo summary cho thread",
    tags: ["Ai"],
  })
  .input(
    z.object({
      messageId: z.string(),
    })
  )
  .handler(async ({ context, input, errors }) => {
    const baseMessage = await prisma.message.findFirst({
      where: {
        id: input.messageId,
        Channel: {
          workspaceId: context.workspace.orgCode,
        },
      },
      select: {
        id: true,
        threadId: true,
        channelId: true,
      },
    });

    if (!baseMessage) {
      throw errors.NOT_FOUND();
    }

    const parentId = baseMessage.threadId ?? baseMessage.id;

    const parent = await prisma.message.findFirst({
      where: {
        id: parentId,
        Channel: {
          workspaceId: context.workspace.orgCode,
        },
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        authorName: true,
        replies: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
            authorName: true,
          },
        },
      },
    });

    if (!parent) {
      throw errors.NOT_FOUND();
    }

    const replies = parent.replies.slice().reverse();

    const parentText = await tipTapJsonToMarkdown(parent.content);

    const replyLines = await Promise.all(
      replies.map(async (r) => {
        const t = await tipTapJsonToMarkdown(r.content);
        return `- ${r.authorName} - ${r.createdAt.toISOString()}: ${t}`;
      })
    );

    const compiled = [
      `Thread Root - ${parent.authorName} - ${parent.createdAt.toISOString()}`,
      parentText,
      ...(replyLines.length > 0 ? ["\nReplies", ...replyLines] : []),
    ].join("\n");

    const system = [
      "Bạn là trợ lý chuyên môn tóm tắt các chủ đề thảo luận giống Slack cho nhóm sản phẩm.",

      "Chỉ sử dụng nội dung chủ đề được cung cấp; không bịa ra sự thật, tên hoặc dòng thời gian.",

      "Định dạng đầu ra (Markdown):",

      "- Đầu tiên, hãy viết một đoạn ngắn gọn (2-4 câu) nắm bắt mục đích của chủ đề, các quyết định quan trọng, bối cảnh và mọi yếu tố cản trở hoặc các bước tiếp theo. Không có tiêu đề, không có danh sách, không có văn bản giới thiệu.",

      "- Sau đó, thêm một dòng trống, theo sau là chính xác 2-3 dấu đầu dòng (sử dụng '-') với những ý quan trọng nhất. Mỗi dấu đầu dòng là một câu.",

      "Phong cách: trung tính, cụ thể và ngắn gọn. Giữ nguyên thuật ngữ trong chuỗi (tên, từ viết tắt). Tránh bổ sung hoặc bình luận meta. Không thêm câu kết.",

      "Nếu ngữ cảnh không đầy đủ, hãy trả lại bản tóm tắt bằng một câu và bỏ qua danh sách dấu đầu dòng.",
    ].join("\n");

    const result = streamText({
      model,
      system,
      messages: [
        {
          role: "user",
          content: compiled,
        },
      ],
      temperature: 0.2,
    });

    return streamToEventIterator(result.toUIMessageStream());
  });

export const generateCompose = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(aiSecurityMiddleware)
  .route({
    method: "POST",
    path: "/ai/compose/generate",
    summary: "Soạn tin nhắn",
    tags: ["AI"],
  })
  .input(
    z.object({
      content: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const markdown = await tipTapJsonToMarkdown(input.content);

    const system = [
      "Bạn là trợ lý viết lại chuyên nghiệp. Bạn không phải là chatbot.",

      "Nhiệm vụ: Viết lại nội dung được cung cấp để có cấu trúc rõ ràng hơn và tốt hơn trong khi vẫn giữ được ý nghĩa, sự kiện, thuật ngữ và tên.",

      "Không xưng hô với người dùng, đặt câu hỏi, thêm lời chào hoặc đưa ra bình luận.",

      "Giữ nguyên các liên kết/đề cập hiện có. Không thay đổi khối mã hoặc nội dung mã nội tuyến.",

      "Xuất hoàn toàn trong Markdown (đoạn văn và danh sách dấu đầu dòng tùy chọn). Không xuất bất kỳ HTML hoặc hình ảnh nào.",

      "CHỈ trả lại nội dung đã viết lại. Không có lời mở đầu, tiêu đề hoặc lời kết.",
    ].join("\n");

    const result = streamText({
      model,
      system,
      messages: [
        {
          role: "user",
          content: "Vui lòng viết lại và cải thiện nội dung sau.",
        },
        {
          role: "user",
          content: markdown,
        },
      ],
      temperature: 0,
    });

    return streamToEventIterator(result.toUIMessageStream());
  });
