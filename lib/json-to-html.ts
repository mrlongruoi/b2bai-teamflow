import { baseExtensions } from "@/components/rich-text-editor/extensions";
import { generateHTML, type JSONContent } from "@tiptap/react";

type SerializableContent = JSONContent | string | null | undefined;

/**
 * Convert rich-text JSON content (or its JSON string representation) into an HTML string.
 *
 * @param jsonContent - The content to convert. If falsy, empty, invalid JSON, missing a top-level `type`, or conversion fails, the function returns an empty string. If a string is provided it will be trimmed and parsed as JSON before conversion.
 * @returns `""` when input is empty, invalid, or conversion fails; otherwise the generated HTML string
 */
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