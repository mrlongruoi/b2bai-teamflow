import { baseExtensions } from "@/components/rich-text-editor/extensions";
import { generateHTML, type JSONContent } from "@tiptap/react";

type SerializableContent = JSONContent | string | null | undefined;

export function convertJsonToHtml(jsonContent: SerializableContent): string {
  if (!jsonContent) return "";

  let content: JSONContent | null = null;

  if (typeof jsonContent === "string") {
    const trimmed = jsonContent.trim();
    if (!trimmed) return "";
    try {
      content = JSON.parse(trimmed) as JSONContent;
    } catch (error) {
      console.error("Failed to parse message content JSON:", error);
      return "";
    }
  } else {
    content = jsonContent;
  }

  if (typeof content !== "object" || content === null || !("type" in content)) {
    return "";
  }

  try {
    return generateHTML(content, baseExtensions);
  } catch (error) {
    console.error("Lỗi chuyển đổi JSON sang HTML:", error);
    return "";
  }
}
