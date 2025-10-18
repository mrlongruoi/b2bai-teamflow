import { MessageItem } from "./message/MessageItem"

const messages = [
    {
        id: 1,
        message: "Chào mừng bạn đến với kênh này!",
        date: new Date(),
        avatar: "https://avatars.githubusercontent.com/u/59387761?v=4",
        userName: "mrlongruoi"
    }
]

/**
 * Render a vertically scrollable list of message items.
 *
 * Renders a full-height container with a vertically scrollable area that maps the local `messages` array
 * to a sequence of `MessageItem` components (each keyed by its `id`).
 *
 * @returns A JSX.Element containing the scrollable list of `MessageItem` components
 */
export function MessageList() {

    return (
        <div className="relative h-full">
            <div className="h-full overflow-y-auto px-4">
                {messages.map((message) => (
                    <MessageItem key={message.id} {...message} />
                ))}
            </div>
        </div>
    )
}