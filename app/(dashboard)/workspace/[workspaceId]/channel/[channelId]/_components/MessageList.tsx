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