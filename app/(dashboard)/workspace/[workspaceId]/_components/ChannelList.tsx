"use client";

import { buttonVariants } from "@/components/ui/button"
import { orpc } from "@/lib/orpc";
import { cn } from "@/lib/utils"
import { useSuspenseQuery } from "@tanstack/react-query";
import { Hash } from "lucide-react"
import Link from "next/link"

/**
 * Render a vertical list of channel links populated from the channel API.
 *
 * @returns A React element containing a stacked list of links, one per channel.
 */
export function ChannelList() {
    const { data: { channels } } = useSuspenseQuery(orpc.channel.list.queryOptions())

    return (
        <div className="space-y-0.5 py-1">
            {channels.map((channel) => (
                <Link
                    className={buttonVariants({
                        variant: "ghost",
                        className: cn("w-full justify-start px-2 py-1 h-7 text-muted-foreground hover:text-accent-foreground hover:bg-accent")
                    })}
                    key={channel.id}
                    href="#"
                >
                    <Hash className="size-4" />
                    <span className="truncate">{channel.name}</span>
                </Link>
            ))}
        </div>
    )
};