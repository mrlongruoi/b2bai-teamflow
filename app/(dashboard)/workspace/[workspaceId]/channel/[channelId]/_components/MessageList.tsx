"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query"
import { orpc } from "@/lib/orpc"
import { MessageItem } from "./message/MessageItem"
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/general/EmtyState";
import { ChevronDown, Loader2 } from "lucide-react";

/**
 * Render an infinite, scrollable message list for the current channel with automatic bottom pinning, pagination, and a new-message indicator.
 *
 * The component loads messages for the channel from route params, fetches earlier pages when scrolled to the top, keeps the view pinned to the bottom when appropriate (including when late-loading content appears), and exposes a control to jump to the latest message when the view is not at the bottom.
 *
 * @returns The React element representing the channel message list UI.
 */
export function MessageList() {
    const { channelId } = useParams<{ channelId: string }>();
    const [hasInitialScrolled, setHasInitialScrolled] = useState(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [newMessage, setNewMessage] = useState(false);
    const lastItemIdRef = useRef<string | undefined>(undefined);

    const infiniteOptions = orpc.message.list.infiniteOptions({
        input: (pageParam: string | undefined) => ({
            channelId: channelId,
            cursor: pageParam,
            limit: 10,
        }),
        queryKey: ['message.list', channelId],
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        select: (data) => ({
            pages: [...data.pages].map((p) => ({
                ...p,
                items: [...p.items].reverse(),
            })).reverse(),
            pageParams: [...data.pageParams].reverse(),
        })
    })

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error, isFetching } = useInfiniteQuery({
        ...infiniteOptions,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    })


    // scroll to the bottom when messages first load
    useEffect(() => {
        if (!hasInitialScrolled && data?.pages.length) {
            const el = scrollRef.current;

            if (el) {
                bottomRef.current?.scrollIntoView({
                    block: "end",
                })

                setHasInitialScrolled(true);

                setIsAtBottom(true);
            }
        }
    }, [hasInitialScrolled, data?.pages.length]);

    // keep view pinned to bottom on late content growth (e.g images...)
    useEffect(() => {
        const el = scrollRef.current;

        if (!el) return;

        const scrollToBottomIfNeeded = () => {
            if (isAtBottom || !hasInitialScrolled) {
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
    }, [isAtBottom, hasInitialScrolled]);

    const isNearBottom = (el: HTMLDivElement) => el.scrollHeight - el.scrollTop - el.clientHeight <= 80;

    const handleScroll = () => {
        const el = scrollRef.current;

        if (!el) return;

        if (el.scrollTop <= 80 && hasNextPage && !isFetching) {
            const preScrollHeight = el.scrollHeight;

            const preScrollTop = el.scrollTop;

            fetchNextPage().then(() => {
                const newScrollHeight = el.scrollHeight;

                el.scrollTop = newScrollHeight - preScrollHeight + preScrollTop;
            })
        }

        setIsAtBottom(isNearBottom(el));
    };

    const items = useMemo(() => {
        return data?.pages.flatMap((p) => p.items) ?? []
    }, [data]);

    const isEmpty = !isLoading && !error && items.length === 0;

    useEffect(() => {
        if (!items.length) return;

        const lastId = items[items.length - 1].id;

        const preLastId = lastItemIdRef.current;

        const el = scrollRef.current;

        if (preLastId && lastId !== preLastId) {
            if (el && isNearBottom(el)) {
                requestAnimationFrame(() => {
                    el.scrollTop = el.scrollHeight;
                })

                setNewMessage(false);

                setIsAtBottom(true);
            } else {

                setNewMessage(true);
            }
        }

        lastItemIdRef.current = lastId;
    }, [items]);

    const scrollToBottom = () => {
        const el = scrollRef.current;

        if (!el) return;

        bottomRef.current?.scrollIntoView({
            block: "end",
        });

        el.scrollTop = el.scrollHeight;

        setNewMessage(false);

        setIsAtBottom(true);
    };

    return (
        <div className="relative h-full">
            <div
                className="h-full overflow-y-auto px-4 flex flex-col space-y-1"
                ref={scrollRef}
                onScroll={handleScroll}
            >
                {isEmpty ? (
                    <div className="flex h-full p-4">
                        <EmptyState
                            title="Không có tin nhắn nào"
                            description="Bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn đầu tiên."
                            buttonText="Gửi tin nhắn"
                            href="#"
                        />
                    </div>
                ) : (
                    items?.map((message) => (
                        <MessageItem key={message.id} message={message} />
                    ))
                )}

                <div ref={bottomRef}></div>
            </div>

            {isFetchingNextPage && (
                <div className="pointer-events-none absolute top-0 left-0 right-0 z-20 flex items-center justify-center py-2">
                    <div className="flex items-center gap-2 rounded-md bg-gradient-to-b from-white/80 to-transparent dark:from-neutral-900/80 backdrop-blur px-3 py-1">
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                        <span>Tải tin nhắn trước...</span>
                    </div>
                </div>
            )}

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
    )
}