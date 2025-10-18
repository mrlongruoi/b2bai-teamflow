import { ThemeToggle } from "@/components/ui/theme-toggle";

/**
 * Renders the channel header containing the channel title and a theme toggle control.
 *
 * Displays the channel name "# super-cool-channel" on the left and a ThemeToggle aligned to the right.
 *
 * @returns A JSX element representing the channel header bar.
 */
export function ChannelHeader() {

    return (
        <div className="flex items-center justify-between h-14 px-4 border-b">
            <h1 className="text-lg font-semibold"># super-cool-channel</h1>

            <div className="flex items-center space-x-2">
                <ThemeToggle />
            </div>
        </div>
    )
}