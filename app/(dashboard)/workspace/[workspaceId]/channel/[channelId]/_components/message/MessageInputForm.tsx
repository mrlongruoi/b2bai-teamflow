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

interface iAppProps {
    channelId: string;
}

export function MessageInputForm({ channelId }: iAppProps) {
    const queryClient = useQueryClient();

    const [editorKey, setEditorKey] = useState(0);

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

                setEditorKey((k) => k + 1);

                return toast.success("Tin nhắn được gửi")
            },
            onError: () => {
                return toast.error("Đã có lỗi xảy ra")
            }
        })
    )

    function onSubmit(data: CreateMessageSchemaType) {
        createMessageMutation.mutate(data)
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