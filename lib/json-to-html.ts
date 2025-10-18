import { baseExtensions } from "@/components/rich-text-editor/extensions";
import { generateHTML, type JSONContent } from "@tiptap/react";

/**
 * Convert a TipTap `JSONContent` (or its JSON string) into an HTML string.
 *
 * @param jsonContent - A `JSONContent` object or a string containing serialized `JSONContent`.
 * @returns The generated HTML string, or an empty string if parsing or conversion fails.
 */
export function convertJsonToHtml(jsonContent: JSONContent): string {
  try {
    const content =
      typeof jsonContent === "string" ? JSON.parse(jsonContent) : jsonContent;

    return generateHTML(content, baseExtensions);
  } catch {
    console.log("Error converting json to html");
    
    return "";
  }
}