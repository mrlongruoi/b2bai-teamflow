import DOMPurify from "dompurify";
import { type JSONContent } from "@tiptap/react";
import parse from "html-react-parser";
import { convertJsonToHtml } from "@/lib/json-to-html";

interface SafeContentProps {
    content: JSONContent | string | null | undefined;
    className?: string;
}

export function SafeContent({ content, className }: Readonly<SafeContentProps>) {
    const html = convertJsonToHtml(content);

    const clean = DOMPurify.sanitize(html);

    return (
        <div className={className}>
            {parse(clean)}
        </div>
    )
}