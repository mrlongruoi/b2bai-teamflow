import DOMPurify from "dompurify";
import MarkdownIt from "markdown-it";
import { generateJSON } from "@tiptap/react";
import { editorExtensions } from "@/components/rich-text-editor/extensions";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
});

/**
 * Converts Markdown source into a TipTap-compatible JSON document.
 *
 * Renders the provided Markdown to HTML, sanitizes the HTML with DOMPurify, and converts the sanitized HTML into a JSON structure using the configured editor extensions.
 *
 * @param markdown - The Markdown source to convert.
 * @returns The JSON document representation suitable for the TipTap editor.
 */
export function markdownToJson(markdown: string) {
  const html = md.render(markdown);

  const cleandHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });

  return generateJSON(cleandHtml, editorExtensions);
}