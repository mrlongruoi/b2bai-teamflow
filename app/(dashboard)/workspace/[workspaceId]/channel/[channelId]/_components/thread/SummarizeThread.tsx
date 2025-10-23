import { JSX, useState } from "react";
import { Sparkles } from "lucide-react";
import { useChat } from "@ai-sdk/react"
import { eventIteratorToStream } from "@orpc/client";
import { client } from "@/lib/orpc";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Response } from "@/components/ai-elements/response";

interface SummarizeThreadProps {
    messageId: string;
}

export function SummarizeThread({ messageId }: Readonly<SummarizeThreadProps>) {
    const [open, setOpen] = useState(false);

    const {
        messages,
        status,
        error,
        sendMessage,
        setMessages,
        stop,
        clearError,
    } = useChat({
        id: `thread-summary:${messageId}`,
        transport: {
            async sendMessages(options) {
                return eventIteratorToStream(
                    await client.ai.thread.summary.generate(
                        { messageId: messageId },
                        { signal: options.abortSignal }
                    )
                )
            },
            reconnectToStream() {
                throw new Error('Unsupported');
            },
        },
    })

    const lastAssistan = messages.findLast((m) => m.role === 'assistant');

    const summaryText = lastAssistan?.parts.filter((p) => p.type === 'text').map((p) => p.text).join("\n\n") ?? "";

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);

        if (nextOpen) {
            const hasAssistantMessage = messages.some((m) => m.role === 'assistant');

            if (status !== 'ready' || hasAssistantMessage) {
                return;
            }

            sendMessage({ text: 'Tóm tắt Thread' })
        } else {
            stop();

            clearError();

            setMessages([]);
        }
    }

    let summaryContent: JSX.Element

    if (error) {
        summaryContent = (
            <div className="">
                <p className="text-red-500">
                    {error.message}
                </p>

                <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                        clearError()
                        setMessages([])
                        sendMessage({ text: 'Tóm tắt Thread' })
                    }}
                >
                    Thử lại
                </Button>
            </div>
        )
    } else if (summaryText) {
        summaryContent = (
            <Response
                parseIncompleteMarkdown={status !== 'ready'}
            >
                {summaryText}
            </Response>
        )
    } else if (status === 'submitted' || status === 'streaming') {
        summaryContent = (
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        )
    } else {
        summaryContent = (
            <div className="text-sm text-muted-foreground">
                Bấm vào tóm tắt để tạo
            </div>
        )
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    size="sm"
                    className="relative overflow-hidden rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <span className="flex items-center gap-1.5">
                        <Sparkles className="size-3.5" />
                        <span className="text-xs font-medium">Tóm tắt</span>
                    </span>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-100 p-0"
                align="end"
            >
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                        <span className="relative inline-flex items-center justify-center rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 py-1.5 px-4 gap-1.5">
                            <Sparkles className="size-3.5 text-white" />
                            <span className="text-sm font-medium text-white">AI Tóm tắt(Xem trước)</span>
                        </span>
                    </div>

                    {status === 'streaming' && (
                        <Button
                            onClick={() => stop()}
                            type="button"
                            size="sm"
                            variant="outline"
                        >
                            Dừng
                        </Button>
                    )}
                </div>

                <div className="px-4 py-3 max-h-80 overflow-y-auto">
                    {summaryContent}
                </div>
            </PopoverContent>
        </Popover>
    )
}