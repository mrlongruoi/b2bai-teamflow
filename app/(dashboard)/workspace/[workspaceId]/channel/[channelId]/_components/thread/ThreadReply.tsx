import { SafeContent } from "@/components/rich-text-editor/SafeContent";
import { Message } from "@/lib/generated/prisma";
import Image from "next/image";

interface ThreadReplyProps {
    message: Message;
}

/**
 * Render a single thread reply UI for a given message.
 *
 * Displays the author's avatar and name, a localized timestamp (Vietnamese 'vi-VN' with hour:minute in 12-hour format and short month/day), and the message content rendered as safe rich text.
 *
 * @param message - The message to display in the reply (author avatar, author name, createdAt, and content are used).
 * @returns A JSX element containing the formatted thread reply.
 */
export function ThreadReply({ message }: ThreadReplyProps) {

    return (
        <div className="flex space-x-3 p-3 hover:bg-muted/30 rounded-lg">
            <Image
                alt="Author avatar"
                src={message.authorAvatar}
                width={32}
                height={32}
                className="size-8 rounded-full shrink-0"
            />

            <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">
                        {message.authorName}
                    </span>

                    <span className="text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat('vi-VN', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                            month: "short",
                            day: 'numeric'
                        }).format(message.createdAt)}
                    </span>
                </div>

                <SafeContent className="text-sm break-words prose dark:prose-invert max-w-none marker:text-primary" content={message.content} />
            </div>
        </div>
    )
}