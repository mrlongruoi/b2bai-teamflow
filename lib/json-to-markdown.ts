import { renderToMarkdown } from "@tiptap/static-renderer/pm/markdown";
import { baseExtensions } from "@/components/rich-text-editor/extensions";

/**
 * Normalize whitespace in a Markdown string.
 *
 * Removes trailing whitespace at the end of each line, collapses three or more consecutive
 * blank lines into exactly two, and trims leading and trailing whitespace from the whole string.
 *
 * @param markdown - The Markdown text to normalize.
 * @returns The normalized Markdown with trailing line spaces removed, long blank-line runs collapsed to two, and outer whitespace trimmed.
 */
function normalizewhiteSpace(markdown: string) {
  return markdown
    .replaceAll(/\s+$/gm, "") // trim trailing spaces per line
    .replaceAll(/\n{3,}/g, "\n\n") // collapse >2 blank lines
    .trim();
}



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