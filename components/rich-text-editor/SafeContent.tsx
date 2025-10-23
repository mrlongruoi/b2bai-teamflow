import DOMPurify from "dompurify";
import { type JSONContent } from "@tiptap/react";
import parse from "html-react-parser";
import { convertJsonToHtml } from "@/lib/json-to-html";

interface SafeContentProps {
    content: JSONContent | string | null | undefined;
    className?: string;
}

/**
 * Render sanitized, parsed React elements from TipTap JSON or an HTML string.
 *
 * @param content - TipTap `JSONContent`, an HTML string, or `null`/`undefined`; converted to HTML and sanitized before rendering.
 * @param className - Optional CSS class applied to the wrapper `<div>`.
 * @returns A `<div>` React element containing the sanitized and parsed content nodes (empty if `content` is `null`/`undefined`).
 */
export function SafeContent({ content, className }: Readonly<SafeContentProps>) {
    const html = convertJsonToHtml(content);

    const clean = DOMPurify.sanitize(html);

    return (
        <div className={className}>
            {parse(clean)}
        </div>
    )
}