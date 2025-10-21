"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { createMessageSchema, CreateMessageSchemaType } from "@/app/schemas/message";
import { MessageComposer } from "./MessageComposer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { useAttachmentUpload } from "@/hooks/use-attachment-upload";

interface iAppProps {
    channelId: string;
}

/**
 * Renders a controlled message input form for a specific channel.
 *
 * The form validates input, includes any staged attachment when submitting, and sends messages via a mutation. On successful send the message list cache is invalidated, the form and staged upload are cleared, the composer is reset, and a success toast is shown; on error an error toast is shown.
 *
 * @param channelId - The ID of the channel where submitted messages will be posted
 * @returns The JSX element for the message input form wired to validation, attachment upload, and submit handling
 */
export function MessageInputForm({ channelId }: iAppProps) {
    const queryClient = useQueryClient();

    const [editorKey, setEditorKey] = useState(0);

    const upload = useAttachmentUpload();

    const form = useForm({
        resolver: zodResolver(createMessageSchema),
        defaultValues: {
            channelId: channelId,
            content: "",
        },
    })

    const createMessageMutation = useMutation(
        orpc.message.create.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: orpc.message.list.key()
                })

                form.reset({
                    channelId,
                    content: "",
                });

                upload.clear();

                setEditorKey((k) => k + 1);

                return toast.success("Tin nhắn được gửi")
            },
            onError: () => {
                return toast.error("Đã có lỗi xảy ra")
            }
        })
    )

    function onSubmit(data: CreateMessageSchemaType) {
        createMessageMutation.mutate({
            ...data,
            imageUrl: upload.stagedUrl ?? undefined,
        })
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
                                <MessageComposer
                                    key={editorKey}
                                    value={field.value}
                                    onChange={field.onChange}
                                    onSubmit={() => onSubmit(form.getValues())}
                                    isSubmitting={createMessageMutation.isPending}
                                    upload={upload}
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