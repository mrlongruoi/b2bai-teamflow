import { renderToMarkdown } from "@tiptap/static-renderer/pm/markdown";
import { baseExtensions } from "@/components/rich-text-editor/extensions";

/**
 * Normalize whitespace in a Markdown string.
 *
 * Removes trailing spaces from each line, collapses sequences of three or more consecutive
 * newlines to exactly two newlines, and trims leading and trailing whitespace.
 *
 * @param markdown - The Markdown content to normalize
 * @returns The normalized Markdown string
 */
function normalizewhiteSpace(markdown: string) {
  return markdown
    .replace(/\s+$/gm, "") // trim trailing spaces per line
    .replace(/\n{3,}/g, "\n\n") // collapse >2 blank lines
    .trim();
}



/**
 * Convert a TipTap JSON string to normalized Markdown.
 *
 * @param json - A JSON string representing TipTap editor content
 * @returns The Markdown representation of the input with normalized whitespace; an empty string if the input cannot be parsed
 */
export async function tipTapJsonToMarkdown(json: string) {
  // Parse json
  let content;

  try {
    content = JSON.parse(json);
  } catch {
    return "";
  }

  const markdown = renderToMarkdown({
    extensions: baseExtensions,
    content: content,
  });

  return normalizewhiteSpace(markdown);
}