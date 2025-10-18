"use client";

import { useParams } from "next/navigation"
import { ChannelHeader } from "./_components/ChannelHeader"
import { MessageInputForm } from "./_components/message/MessageInputForm"
import { MessageList } from "./_components/MessageList"

const ChannelPageMain = () => {
    const { channelId } = useParams<{ channelId: string }>();

    return (
        <div className="flex h-screen w-full">
            {/* main channel area */}
            <div className="flex flex-col flex-1 min-w-0">
                {/* fixed header */}
                <ChannelHeader />
                {/* scrollable messages area */}
                <div className="flex-1 overflow-hidden mb-4">
                    <MessageList />
                </div>

                {/* fixed input */}
                <div className="border-t bg-background p-4">
                    <MessageInputForm channelId={channelId} />
                </div>
            </div>
        </div>
    )
}

export default ChannelPageMain
