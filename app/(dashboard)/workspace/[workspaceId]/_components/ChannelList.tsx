import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Hash } from "lucide-react"
import Link from "next/link"

const channelList = [
    {
        id: "1",
        name: "hello",
    },
    {
        id: "2",
        name: "how",
    },
    {
        id: "3",
        name: "are",
    },
    {
        id: "4",
        name: "you",
    },
]

/**
 * Render a vertical list of channel links styled as ghost buttons.
 *
 * @returns A React element containing a vertical list of channel items; each item is a full-width ghost-styled link showing a hash icon and the channel name (truncated when necessary).
 */
export function ChannelList() {

    return (
        <div className="space-y-0.5 py-1">
            {channelList.map((channel) => (
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