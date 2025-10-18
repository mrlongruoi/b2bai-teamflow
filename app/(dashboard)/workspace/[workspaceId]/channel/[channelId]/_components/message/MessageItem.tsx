import { SafeContent } from "@/components/rich-text-editor/SafeContent";
import { Message } from "@/lib/generated/prisma";
import { getAvatar } from "@/lib/get-avatar";
import Image from "next/image";

interface iAppProps {
    message: Message
}

/**
 * Render a chat message item with avatar, author name, localized timestamp, and parsed content.
 *
 * The component derives the avatar from `message.authorAvatar` and `message.authorEmail`, formats
 * `message.createdAt` using the Vietnamese locale, and parses `message.content` as JSON for rendering.
 *
 * @param message - The Message object to render; expected to include `authorAvatar`, `authorEmail`, `authorName`, `createdAt`, and `content` (JSON string).
 * @returns The JSX element representing the message item.
 */
export function MessageItem({ message }: iAppProps) {

    return (
        <div className="flex space-x-3 relative p-3 rounded-lg group hover:bg-muted/50">
            <Image
                src={getAvatar(message.authorAvatar, message.authorEmail)}
                alt="Hình đại diện của người dùng"
                width={32}
                height={32}
                className="size-8 rounded-lg"
            />

            <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center gap-x-2">
                    <p className="font-medium leading-none">{message.authorName}</p>
                    <p className="text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat('vi-VN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        }).format(message.createdAt)}
                        {' '}
                        {new Intl.DateTimeFormat('vi-VN', {
                            hour12: false,
                            hour: '2-digit',
                            minute: '2-digit',
                        }).format(message.createdAt)}
                    </p>
                </div>

                <SafeContent
                    className="text-sm break-words prose dark:prose-invert max-w-none mark:text-primary"
                    content={JSON.parse(message.content)}
                />
            </div>
        </div>
    )
}