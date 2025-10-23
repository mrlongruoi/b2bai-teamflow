import Image from "next/image";
import { SafeContent } from "@/components/rich-text-editor/SafeContent";
import { ReactionsBar } from "../reaction/ReactionsBar";
import { MessageListItem } from "@/lib/types";

interface ThreadReplyProps {
    message: MessageListItem;
    selectedThreadId: string;
}

/**
 * Render a thread reply item showing the author's avatar, name, timestamp, content, optional attachment image, and a reactions bar.
 *
 * @param message - Message data to display (author, content, timestamps, optional image, reactions).
 * @param selectedThreadId - ID of the parent thread used as the reactions context.
 * @returns The JSX element representing the rendered thread reply.
 */
export function ThreadReply({ message, selectedThreadId }: Readonly<ThreadReplyProps>) {

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
                    className="text-sm wrap-break-word prose dark:prose-invert max-w-none marker:text-primary"
                    content={message.content}
                />

                {message.imageUrl && (
                    <div className="mt-2">
                        <Image
                            src={message.imageUrl}
                            alt="Message Attachment"
                            width={512}
                            height={512}
                            className="rounded-md max-h-80 w-auto object-contain"
                        />
                    </div>
                )}

                <ReactionsBar
                    context={{
                        type: 'thread',
                        threadId: selectedThreadId,
                    }}
                    messageId={message.id}
                    reactions={message.reactions}
                />
            </div>
        </div>
    )
}