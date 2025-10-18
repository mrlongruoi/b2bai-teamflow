import { ThemeToggle } from "@/components/ui/theme-toggle";

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