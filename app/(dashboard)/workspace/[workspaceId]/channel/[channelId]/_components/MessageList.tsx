"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query"
import { orpc } from "@/lib/orpc"
import { MessageItem } from "./message/MessageItem"
import { Button } from "@/components/ui/button";

/**
 * Render an infinite-scroll message list for the current channel with automatic scrolling and a new-message notifier.
 *
 * Renders messages for the channel from route params, loads older pages when scrolling near the top, scrolls to the bottom on first load or when new messages arrive while the view is near the bottom, and displays a button to jump to the bottom when unseen messages arrive.
 *
 * @returns A React element that displays the channel's messages, manages pagination and scroll position, and shows a "new message" notification button when there are unseen messages.
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

    useEffect(() => {
        if (!hasInitialScrolled && data?.pages.length) {
            const el = scrollRef.current;

            if (el) {
                el.scrollTop = el.scrollHeight;

                setHasInitialScrolled(true);

                setIsAtBottom(true);
            }
        }
    }, [hasInitialScrolled, data?.pages.length])

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
    }

    const items = useMemo(() => {
        return data?.pages.flatMap((p) => p.items) ?? []
    }, [data])

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

        el.scrollTop = el.scrollHeight;

        setNewMessage(false);

        setIsAtBottom(true);
    }

    return (
        <div className="relative h-full">
            <div
                className="h-full overflow-y-auto px-4 flex flex-col space-y-1"
                ref={scrollRef}
                onScroll={handleScroll}
            >
                {items?.map((message) => (
                    <MessageItem key={message.id} message={message} />
                ))}

                <div ref={bottomRef}></div>
            </div>

            {newMessage && !isAtBottom ? (
                <Button
                    type="button"
                    className="absolute bottom-4 right-8 rounded-full"
                    onClick={scrollToBottom}
                >
                    Thông báo tin nhắn mới
                </Button>
            ) : null}
        </div>
    )
}