import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { eventIteratorToStream } from "@orpc/server";
import { client } from "@/lib/orpc";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Response } from "../ai-elements/response";
import { Skeleton } from "../ui/skeleton";

interface ComposeAssistantProps {
    content: string;
    onAccept?: (markdown: string) => void;
}

export function ComposeAssistant({ content, onAccept }: Readonly<ComposeAssistantProps>) {
    const [open, setOpen] = useState(false);

    const contentRef = useRef(content);

    useEffect(() => {
        contentRef.current = content;
    }, [content]);

    const {
        messages,
        status,
        error,
        sendMessage,
        setMessages,
        stop,
        clearError,
    } = useChat({
        id: `compose-assistant`,
        transport: {
            async sendMessages(options) {
                return eventIteratorToStream(
                    await client.ai.compose.generate(
                        { content: contentRef.current },
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

    const composeText = lastAssistan?.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("\n\n") ?? "";

    let popoverBodyContent: React.ReactNode;
    if (error) {
      popoverBodyContent = (
        <div className="">
          <p className="text-red-500">{error.message}</p>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              clearError();
              setMessages([]);
              sendMessage({ text: "Tóm tắt Thread" });
            }}
          >
            Thử lại
          </Button>
        </div>
      );
    } else if (composeText) {
      popoverBodyContent = (
        <Response parseIncompleteMarkdown={status !== "ready"}>
          {composeText}
        </Response>
      );
    } else if (status === "submitted" || status === "streaming") {
      popoverBodyContent = (
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      );
    } else {
      popoverBodyContent = (
        <div className="text-sm text-muted-foreground">
          Nhấp vào soạn thảo để tạo
        </div>
      );
    }

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);

        if (nextOpen) {
            const hasAssistantMessage = messages.some((m) => m.role === 'assistant');

            if (status !== 'ready' || hasAssistantMessage) {
                return;
            }

            sendMessage({ text: 'Viết lại' })
        } else {
            stop();

            clearError();

            setMessages([]);
        }
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    size="sm"
                    className="relative overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <span className="flex items-center gap-1.5">
                        <Sparkles className="size-3.5" />
                        <span className="text-xs font-medium">Soạn</span>
                    </span>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-[25rem] p-0"
            >
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                        <span className="relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-1.5 px-4 gap-1.5">
                            <Sparkles className="size-3.5 text-white" />
                            <span className="text-sm font-medium text-white">Trợ lý soạn thảo (Xem trước)</span>
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
                    {popoverBodyContent}
                </div>

                <div className="flex items-center justify-end gap-3 border-t px-3 py-2 bg-muted/30">
                    <Button
                        type="submit"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            stop()
                            clearError()
                            setMessages([])
                            setOpen(false)
                        }}
                    >
                        Từ chối
                    </Button>

                    <Button
                        onClick={() => {
                            if (!composeText) return;
                            onAccept?.(composeText);
                            stop()
                            clearError()
                            setMessages([])
                            setOpen(false)
                        }}
                        disabled={!composeText}
                        type="submit"
                        size="sm"
                    >
                        Chấp nhận
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}