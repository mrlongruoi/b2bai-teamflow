// 'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, MessageSquare, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { orpc } from "@/lib/orpc";
import { useThread } from "@/providers/ThreadProvider";
import { SafeContent } from "@/components/rich-text-editor/SafeContent";
import { ThreadReply } from "./ThreadReply";
import { ThreadReplyForm } from "./ThreadReplyForm";
import { Button } from "@/components/ui/button";
import { ThreadSidebarSkeleton } from "./ThreadSidebarSkeleton";

interface ThreadSidebarProps {
    user: KindeUser<Record<string, unknown>>;
}

/**
 * Renders a thread sidebar showing the original post, its replies, and a reply form.
 *
 * Displays the original message header and content, a scrollable list of replies, a button to close the sidebar, and a form to submit new replies. Keeps the reply list pinned to the bottom when the user is at the end and auto-scrolls on new or late-loading content.
 *
 * @param user - The current authenticated user (used when rendering the reply form)
 * @returns The thread sidebar React element
 */
export function ThreadSidebar({ user }: ThreadSidebarProps) {
    const { selectedThreadId, closeThread } = useThread();

    const scrollRef = useRef<HTMLDivElement | null>(null);

    const bottomRef = useRef<HTMLDivElement | null>(null);

    const [isAtBottom, setIsAtBottom] = useState(false);

    const lastMessageCountRef = useRef(0);

    const { data, isLoading } = useQuery(
        orpc.message.thread.list.queryOptions({
            input: {
                messageId: selectedThreadId!,
            },
            enabled: Boolean(selectedThreadId),
        })
    );

    const messageCount = data?.messages.length ?? 0;

    const isNearBottom = (el: HTMLDivElement) => el.scrollHeight - el.scrollTop - el.clientHeight <= 80;

    const handleScroll = () => {
        const el = scrollRef.current;

        if (!el) return;

        setIsAtBottom(isNearBottom(el));
    };

    useEffect(() => {
        if (messageCount === 0) return;

        const prevMessageCount = lastMessageCountRef.current;

        const el = scrollRef.current;

        if (prevMessageCount > 0 && messageCount !== prevMessageCount) {
            if (el && isNearBottom(el)) {
                requestAnimationFrame(() => {
                    bottomRef.current?.scrollIntoView({
                        block: "end",
                        behavior: "smooth",
                    })
                })

                setIsAtBottom(true);
            }
        }

        lastMessageCountRef.current = messageCount;
    }, [messageCount]);

    // keep view pinned to bottom on late content growth (e.g images...)
    useEffect(() => {
        const el = scrollRef.current;

        if (!el) return;

        const scrollToBottomIfNeeded = () => {
            if (isAtBottom) {
                requestAnimationFrame(() => {
                    bottomRef.current?.scrollIntoView({
                        block: "end",
                    });
                });
            }
        };

        const onImageLoad = (e: Event) => {
            if (e.target instanceof HTMLImageElement) {
                scrollToBottomIfNeeded();
            }
        };

        el.addEventListener("load", onImageLoad, true);
        // resizeobserver watches for size in the container
        const resizeObserver = new ResizeObserver(() => {
            scrollToBottomIfNeeded();
        });

        resizeObserver.observe(el);
        // mutationobserver watches for DOM changes (e.g., images loading, content updates...)
        const mutationObserver = new MutationObserver(() => {
            scrollToBottomIfNeeded();
        });

        mutationObserver.observe(el, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true,
        });

        return () => {
            resizeObserver.disconnect();
            el.removeEventListener("load", onImageLoad, true);
            mutationObserver.disconnect();
        }
    }, [isAtBottom]);

    const scrollToBottom = () => {
        const el = scrollRef.current;

        if (!el) return;

        bottomRef.current?.scrollIntoView({
            block: "end",
            behavior: "smooth",
        });

        el.scrollTop = el.scrollHeight;

        setIsAtBottom(true);
    };

    if (isLoading) {
        return <ThreadSidebarSkeleton />
    }

    return (
        <div className="w-[30rem] border-l flex flex-col h-full">

            {/* header */}
            <div className="border-b h-14 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageSquare className="size-4" />
                    <span>Thread</span>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={closeThread}
                        variant="outline"
                    >
                        <X className="size-4" />
                    </Button>
                </div>
            </div>

            {/* main content */}
            <div className="flex-1 overflow-y-auto relative">
                <div className="h-full overflow-y-auto" ref={scrollRef} onScroll={handleScroll}>
                    {data && (
                        <>
                            <div className="p-4 border-b bg-muted/20">
                                <div className="flex space-x-3">
                                    <Image
                                        src={data.parent.authorAvatar}
                                        alt="author image"
                                        width={32}
                                        height={32}
                                        className="size-8 rounded-full shrink-0"
                                    />

                                    <div className="flex-1 space-y-1 min-w-0">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium text-sm">
                                                {data.parent.authorName}
                                            </span>

                                            <span className="text-xs text-muted-foreground">
                                                {new Intl.DateTimeFormat('vi-VN', {
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    hour12: true,
                                                    month: "short",
                                                    day: 'numeric'
                                                }).format(data.parent.createdAt)}
                                            </span>
                                        </div>

                                        <SafeContent
                                            className="text-sm break-words prose dark:prose-invert max-w-none"
                                            content={data.parent.content}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* thread replies */}
                            <div className="p-2">
                                <p className="text-xs text-muted-foreground mb-3 px-2">
                                    {data.messages.length} câu trả lời
                                </p>

                                <div className="space-y-1">
                                    {data.messages.map((reply) => (
                                        <ThreadReply
                                            key={reply.id}
                                            message={reply}
                                            selectedThreadId={selectedThreadId!}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div ref={bottomRef}></div>
                        </>
                    )}
                </div>

                {/* scroll to bottom button */}
                {!isAtBottom && (
                    <Button
                        type="button"
                        size="sm"
                        onClick={scrollToBottom}
                        className="absolute bottom-4 right-5 z-20 size-10 rounded-full hover:shadow-xl transition-all duration-200">
                        <ChevronDown className="size-4" />
                    </Button>
                )}
            </div>

            {/* thread reply form */}
            <div className="border-t p-4">
                <ThreadReplyForm
                    threadId={selectedThreadId!}
                    user={user}
                />
            </div>
        </div>
    )
};