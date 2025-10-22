"use client";

import { useParams } from "next/navigation"
import { ChannelHeader } from "./_components/ChannelHeader"
import { MessageInputForm } from "./_components/message/MessageInputForm"
import { MessageList } from "./_components/MessageList"
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { ThreadSidebar } from "./_components/thread/ThreadSidebar";
import { ThreadProvider, useThread } from "@/providers/ThreadProvider";

const ChannelPageMain = () => {
    const { channelId } = useParams<{ channelId: string }>();

    const { isThreadOpen } = useThread();

    const { data, error, isLoading } = useQuery(
        orpc.channel.get.queryOptions({
            input: {
                channelId: channelId,
            }
        })
    )

    if (error) {
        return (
            <p>lỗi</p>
        )
    }

    return (
        <div className="flex h-screen w-full">
            {/* main channel area */}
            <div className="flex flex-col flex-1 min-w-0">

                {/* fixed header */}
                {isLoading ? (
                    <div className="flex items-center justify-beetwen h-14 px-4 border-b">
                        <Skeleton className="h-6 w-40" />
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-8 w-28" />
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="size-8" />
                        </div>
                    </div>
                ) : (
                    <ChannelHeader channelName={data?.channelName} />
                )}

                {/* scrollable messages area */}
                <div className="flex-1 overflow-hidden mb-4">
                    <MessageList />
                </div>

                {/* fixed input */}
                <div className="border-t bg-background p-4">
                    <MessageInputForm
                        channelId={channelId}
                        user={data?.currentUser as KindeUser<Record<string, unknown>>}
                    />
                </div>
            </div>

            {isThreadOpen && (
                <ThreadSidebar />
            )}
        </div>
    )
}

const ThisIsChannelPage = () => {

    return (
        <ThreadProvider>
            <ChannelPageMain />
        </ThreadProvider>
    )
}

export default ThisIsChannelPage;

