import { ThemeToggle } from "@/components/ui/theme-toggle";
import InviteMember from "./member/InviteMember";
import { MemberOverview } from "./member/MemberOverview";

interface ChannelHeaderProps {
    channelName: string | undefined;
}

/**
 * Render a channel header that displays the channel name and action controls.
 *
 * @param channelName - The channel name to display; may be `undefined` to render only the leading `#`.
 * @returns A header element containing the channel title and the action controls (member overview, invite, theme toggle).
 */
export function ChannelHeader({ channelName }: ChannelHeaderProps) {

    return (
        <div className="flex items-center justify-between h-14 px-4 border-b">
            <h1 className="text-lg font-semibold"># {channelName}</h1>

            <div className="flex items-center space-x-3">
                <MemberOverview />
                <InviteMember />
                <ThemeToggle />
            </div>
        </div>
    )
}