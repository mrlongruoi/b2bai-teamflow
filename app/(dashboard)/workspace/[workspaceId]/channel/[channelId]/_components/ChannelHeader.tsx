import { ThemeToggle } from "@/components/ui/theme-toggle";
import InviteMember from "./member/InviteMember";
import { MemberOverview } from "./member/MemberOverview";

interface ChannelHeaderProps {
    channelName: string | undefined;
}

export function ChannelHeader({ channelName }: Readonly<ChannelHeaderProps>) {

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