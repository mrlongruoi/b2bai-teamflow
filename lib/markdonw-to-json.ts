import DOMPurify from "dompurify";
import MarkdownIt from "markdown-it";
import { generateJSON } from "@tiptap/react";
import { editorExtensions } from "@/components/rich-text-editor/extensions";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
});

export function markdownToJson(markdown: string) {
  const html = md.render(markdown);

  const cleandHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });

  return generateJSON(cleandHtml, editorExtensions);
}
