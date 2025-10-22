import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { updateMessageSchema, UpdateMessageSchemaType } from "@/app/schemas/message"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { RichTextEditor } from "@/components/rich-text-editor/Editor"
import { Button } from "@/components/ui/button"
import { Message } from "@/lib/generated/prisma"
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
import { orpc } from "@/lib/orpc"
import { toast } from "sonner"

interface EditMessageProps {
    message: Message;
    onCancel: () => void;
    onSave: () => void;
}

export function EditMessage({ message, onCancel, onSave }: EditMessageProps) {
    const queryClient = useQueryClient();

    const form = useForm({
        resolver: zodResolver(updateMessageSchema),
        defaultValues: {
            messageId: message.id,
            content: message.content,
        }
    })

    const updateMutation = useMutation(
        orpc.message.update.mutationOptions({
            onSuccess: (updated) => {
                type MessagePage = { items: Message[], nextCursor?: string }

                type InfiniteMessages = InfiniteData<MessagePage>

                queryClient.setQueryData<InfiniteMessages>(
                    ['message.list', message.channelId],

                    (old) => {
                        if (!old) return old;

                        const updatedMessage = updated.message

                        const pages = old.pages.map((page) => ({
                            ...page,
                            items: page.items.map((m) => m.id === updatedMessage.id ? { ...m, ...updatedMessage } : m),
                        }));

                        return {
                            ...old,
                            pages,
                        }
                    }
                )
                toast.success("Cập nhật tin nhắn thành công!");
                onSave();
            },
            onError: (error) => {
                toast.error(error.message);
            }
        })
    )

    function onSubmit(data: UpdateMessageSchemaType) {
        updateMutation.mutate(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RichTextEditor
                                    field={field}
                                    sendButton={
                                        <div className="flex items-center gap-x-4">
                                            <Button
                                                disabled={updateMutation.isPending}
                                                onClick={onCancel}
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                            >
                                                Hủy bỏ
                                            </Button>
                                            <Button
                                                disabled={updateMutation.isPending}
                                                type="submit"
                                                size="sm"
                                            >
                                                {updateMutation.isPending ? "Đang lưu..." : "Lưu tin nhắn"}
                                            </Button>
                                        </div>
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}