"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"
import { useAttachmentUpload } from "@/hooks/use-attachment-upload";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { MessageComposer } from "../message/MessageComposer";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { createMessageSchema, CreateMessageSchemaType } from "@/app/schemas/message"
import { toast } from "sonner";

interface ThreadReplyFormProps {
    threadId: string;
}

/**
 * Render a form for composing and submitting a reply to a specific thread.
 *
 * The component binds a controlled message editor to a form, associates the message with
 * the provided `threadId` (kept in sync when the prop changes), and reads `channelId`
 * from the route. On successful submission the form is reset, staged attachments are cleared,
 * the editor is remounted, and a success toast is shown; on failure an error toast is shown.
 *
 * @param threadId - Identifier of the thread to which the submitted message will be posted
 * @returns The thread reply form React element
 */
export function ThreadReplyForm({ threadId }: ThreadReplyFormProps) {
    const { channelId } = useParams<{ channelId: string }>()

    const upload = useAttachmentUpload();

    const [editorKey, setEditorKey] = useState(0);

    const form = useForm({
        resolver: zodResolver(createMessageSchema),
        defaultValues: {
            content: "",
            channelId: channelId,
            threadId: threadId,
        }
    })

    useEffect(() => {
        form.setValue("threadId", threadId);
    }, [threadId, form])

    const createMessageMutation = useMutation(
        orpc.message.create.mutationOptions({
            onSuccess: () => {
                form.reset({
                    channelId,
                    content: "",
                    threadId,
                });

                upload.clear();

                setEditorKey((k) => k + 1);

                return toast.success("Mọi thứ đều ổn!")
            },
            onError: () => {
                return toast.error("Đã có lỗi xảy ra.")
            },
        })
    )

    function onSubmit(data: CreateMessageSchemaType) {
        createMessageMutation.mutate({
            ...data,
            imageUrl: upload.stagedUrl ?? undefined,
        });
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
                                    value={field.value}
                                    onChange={field.onChange}
                                    upload={upload}
                                    key={editorKey}
                                    onSubmit={() => onSubmit(form.getValues())}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}