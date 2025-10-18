import DOMPurify from "dompurify";
import { type JSONContent } from "@tiptap/react";
import parse from "html-react-parser";
import { convertJsonToHtml } from "@/lib/json-to-html";

interface iAppProps {
    content: JSONContent;
    className?: string;
}

/**
 * Renders JSONContent as sanitized HTML inside a container element.
 *
 * @param content - Rich text content in TipTap's `JSONContent` format to render.
 * @param className - Optional CSS class(es) applied to the outer container `div`.
 * @returns A React element containing the sanitized markup produced from `content`.
 */
export function SafeContent({ content, className }: iAppProps) {
    const html = convertJsonToHtml(content);

    const clean = DOMPurify.sanitize(html);

    return (
        <div className={className}>
            {parse(clean)}
        </div>
    )
}