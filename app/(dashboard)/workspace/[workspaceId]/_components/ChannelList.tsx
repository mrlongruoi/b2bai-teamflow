"use client";

import { buttonVariants } from "@/components/ui/button"
import { orpc } from "@/lib/orpc";
import { cn } from "@/lib/utils"
import { useSuspenseQuery } from "@tanstack/react-query";
import { Hash } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation";

/**
 * Render a vertical list of workspace channels as navigation links, highlighting the active channel.
 *
 * Each channel is rendered as a link to /workspace/{workspaceId}/channel/{channel.id} and receives
 * active styling when its id matches the current route's channelId.
 *
 * @returns A React element containing the channel link list; active channel links include accent styling.
 */
export function ChannelList() {
    const { data: { channels } } = useSuspenseQuery(orpc.channel.list.queryOptions());

    const { workspaceId, channelId } = useParams<{ workspaceId: string, channelId: string }>();

    return (
        <div className="space-y-0.5 py-1">
            {channels.map((channel) => {
                const isActive = channel.id === channelId;

                return (
                    <Link
                        className={buttonVariants({
                            variant: "ghost",
                            className: cn("w-full justify-start px-2 py-1 h-7 text-muted-foreground hover:text-accent-foreground hover:bg-accent",
                                isActive && 'text-accent-foreground bg-accent'
                            )
                        })}
                        key={channel.id}
                        href={`/workspace/${workspaceId}/channel/${channel.id}`}
                    >
                        <Hash className="size-4" />
                        <span className="truncate">{channel.name}</span>
                    </Link>
                )
            })}
        </div>
    )
};