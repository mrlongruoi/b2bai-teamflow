"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { createMessageSchema, CreateMessageSchemaType } from "@/app/schemas/message";
import { MessageComposer } from "./MessageComposer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";

interface iAppProps {
    channelId: string;
}

/**
 * Renders a message composition form bound to the given channel and handles creating messages.
 *
 * The form uses Zod validation and a mutation to create messages; on success it invalidates the message list cache and shows a success toast, and on error shows an error toast.
 *
 * @param channelId - ID of the channel to associate new messages with; used as the form's default `channelId`
 * @returns The JSX form for composing and submitting a message for the specified channel
 */
export function MessageInputForm({ channelId }: iAppProps) {
    const queryClient = useQueryClient();

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

                return toast.success("Tin nhắn được tạo thành công")
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