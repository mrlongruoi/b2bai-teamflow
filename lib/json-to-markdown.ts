import { renderToMarkdown } from "@tiptap/static-renderer/pm/markdown";
import { baseExtensions } from "@/components/rich-text-editor/extensions";

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
