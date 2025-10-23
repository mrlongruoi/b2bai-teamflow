// "use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { MessageSquare } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { MessageListItem } from "@/lib/types";
import { useThread } from "@/providers/ThreadProvider";
import { getAvatar } from "@/lib/get-avatar";
import { MessageHoverToolbar } from "../toolbar";
import { EditMessage } from "../toolbar/EditMessage";
import { SafeContent } from "@/components/rich-text-editor/SafeContent";
import { ReactionsBar } from "../reaction/ReactionsBar";

interface MessageItemProps {
    message: MessageListItem;
    currentUserId: string;
}

/**
 * Render a chat message item showing author info, timestamp, content, optional attachment, reactions, and thread controls.
 *
 * The component supports inline editing, opens the thread view when requested, and prefetches thread data on hover.
 *
 * @returns The rendered message list item element
 */
export function MessageItem({ message, currentUserId }: Readonly<MessageItemProps>) {
    const [isEditing, setIsEditing] = useState(false);

    const { openThread } = useThread();

    const queryClient = useQueryClient();

    const prefetchThread = useCallback(() => {
        const options = orpc.message.thread.list.queryOptions({
            input: {
                messageId: message.id,
            }
        })

        queryClient.prefetchQuery({ ...options, staleTime: 60_000 })
            .catch(() => { });
    }, [message.id, queryClient]);

    return (
        <div className="flex space-x-3 relative p-3 rounded-lg group hover:bg-muted/50">
            <Image
                src={getAvatar(message.authorAvatar, message.authorEmail)}
                alt="Hình đại diện của người dùng"
                width={32}
                height={32}
                className="size-8 rounded-lg"
            />

            <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center gap-x-2">
                    <p className="font-medium leading-none">{message.authorName}</p>
                    <p className="text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat('vi-VN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        }).format(message.createdAt)}
                        {' '}
                        {new Intl.DateTimeFormat('vi-VN', {
                            hour12: false,
                            hour: '2-digit',
                            minute: '2-digit',
                        }).format(message.createdAt)}
                    </p>
                </div>

                {isEditing ? (
                    <EditMessage
                        message={message}
                        onCancel={() => setIsEditing(false)}
                        onSave={() => setIsEditing(false)}
                    />
                ) : (
                    <>
                        <SafeContent
                            className="text-sm wrap-break-word prose dark:prose-invert max-w-none mark:text-primary"
                            content={message.content}
                        />

                        {message.imageUrl && (
                            <div className="mt-3">
                                <Image
                                    src={message.imageUrl}
                                    alt="Message Attachment"
                                    width={512}
                                    height={512}
                                    className="rounded-md max-h-80 w-auto object-contain"
                                />
                            </div>
                        )}

                        {/* reactions */}
                        <ReactionsBar 
                            messageId={message.id}
                            reactions={message.reactions}
                            context={{type: 'list', channelId: message.channelId!}}
                        />

                        {message.replyCount > 0 && (
                            <button
                                type="button"
                                className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border cursor-pointer"
                                onClick={() => openThread(message.id)}
                                onMouseEnter={prefetchThread}
                            >
                                <MessageSquare className="size-3.5" />
                                <span>
                                    {message.replyCount}{" "}
                                    {message.replyCount === 1 ? 'hồi đáp' : 'câu trả lời'}
                                </span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    Xem Thread
                                </span>
                            </button>
                        )}
                    </>
                )}
            </div>

            <MessageHoverToolbar
                messageId={message.id}
                canEdit={message.authorId === currentUserId}
                onEdit={() => setIsEditing(true)}
            />
        </div>
    )
}