import { SafeContent } from "@/components/rich-text-editor/SafeContent";
import { Message } from "@/lib/generated/prisma";
import Image from "next/image";

interface ThreadReplyProps {
    message: Message;
}

/**
 * Render a single thread reply with author avatar, metadata, rich text content, and an optional image attachment.
 *
 * @param message - Message object containing authorName, authorAvatar, content, createdAt, and optional imageUrl
 * @returns A JSX element representing the rendered reply
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

                <SafeContent 
                    className="text-sm break-words prose dark:prose-invert max-w-none marker:text-primary" 
                    content={message.content} 
                />

                {message.imageUrl && (
                    <div className="mt-2">
                        <Image
                            src={message.imageUrl}
                            alt="Message Attachment"
                            width={512}
                            height={512}
                            className="rounded-md max-h-[320px] w-auto object-contain"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}