import { ChannelHeader } from "./_components/ChannelHeader"
import { MessageList } from "./_components/MessageList"

const ChannelPageMain = () => {
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
                <div></div>
            </div>
        </div>
    )
}

export default ChannelPageMain
