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