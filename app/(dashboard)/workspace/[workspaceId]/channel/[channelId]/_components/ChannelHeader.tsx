import { ThemeToggle } from "@/components/ui/theme-toggle";

interface ChannelHeaderProps {
    channelName: string | undefined;
}

/**
 * Renders a channel header displaying the channel name with a theme toggle control.
 *
 * @param channelName - The channel name to display; when `undefined` the literal `undefined` will be rendered.
 * @returns A header element containing the channel title prefixed with `#` and a ThemeToggle control.
 */
export function ChannelHeader({ channelName }: ChannelHeaderProps) {

    return (
        <div className="flex items-center justify-between h-14 px-4 border-b">
            <h1 className="text-lg font-semibold"># {channelName}</h1>

            <div className="flex items-center space-x-2">
                <ThemeToggle />
            </div>
        </div>
    )
}