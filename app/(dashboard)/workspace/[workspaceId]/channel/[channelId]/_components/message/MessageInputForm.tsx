"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { createMessageSchema, CreateMessageSchemaType } from "@/app/schemas/message";
import { MessageComposer } from "./MessageComposer";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { useAttachmentUpload } from "@/hooks/use-attachment-upload";
import { Message } from "@/lib/generated/prisma";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { getAvatar } from "@/lib/get-avatar";

interface iAppProps {
    channelId: string;
    user: KindeUser<Record<string, unknown>>;
}

type MessagePage = { items: Message[]; nextCursor?: string; };

type InfiniteMessages = InfiniteData<MessagePage>;

/**
 * Render a message composition form that supports optimistic message creation, attachment uploads, and validation.
 *
 * This component wires form state, attachment upload handling, and a create-message mutation to provide an inline composer with optimistic UI updates and error handling for a specific channel.
 *
 * @param channelId - Identifier of the channel where the message will be posted.
 * @param user - The current authenticated user; used as author metadata for optimistic messages.
 * @returns A React element containing the message input form bound to validation, upload, and the create-message mutation.
 */
export function MessageInputForm({ channelId, user }: iAppProps) {
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
            onMutate: async (data) => {
                await queryClient.cancelQueries({
                    queryKey: ['message.list', channelId],
                });

                const previousData = queryClient.getQueryData<InfiniteMessages>([
                    'message.list',
                    channelId,
                ]);

                const tempId = `optimistic-${crypto.randomUUID()}`;

                const optimisticMessage = {
                    id: tempId,
                    content: data.content,
                    imageUrl: data.imageUrl ?? null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    authorId: user.id,
                    authorEmail: user.email!,
                    authorName: user.given_name ?? 'John Doe',
                    authorAvatar: getAvatar(user.picture, user.email!),
                    channelId: channelId,
                };

                queryClient.setQueryData<InfiniteMessages>(['message.list', channelId], (old) => {
                    if (!old) {
                        return {
                            pages: [
                                {
                                    items: [optimisticMessage],
                                    nextCursor: undefined,
                                },
                            ],
                            pageParams: [undefined],
                        } satisfies InfiniteMessages;
                    }

                    const firstPage = old.pages[0] ?? {
                        items: [],
                        nextCursor: undefined,
                    }

                    const updatedFirstPage: MessagePage = {
                        ...firstPage,
                        items: [optimisticMessage, ...firstPage.items],
                    }

                    return {
                        ...old,
                        pages: [updatedFirstPage, ...old.pages.slice(1)],
                    }
                })

                return {
                    previousData,
                    tempId,
                }
            },
            onSuccess: (data, _variables, context) => {
                queryClient.setQueryData<InfiniteMessages>(
                    ['message.list', channelId],

                    (old) => {
                        if (!old) return old;

                        const updatedPages = old.pages.map((page) => ({
                            ...page,
                            items: page.items.map((m) => m.id === context.tempId ? {
                                ...data,
                            } : m),
                        }))

                        return {
                            ...old,
                            pages: updatedPages,
                        };
                    }
                );

                form.reset({ channelId, content: "" });

                upload.clear();

                setEditorKey((k) => k + 1);

                return toast.success("Tin nhắn được gửi")
            },
            onError: (_err, _variables, context) => {
                if (context?.previousData) {
                    queryClient.setQueryData<InfiniteMessages>(
                        ['message.list', channelId],
                        context.previousData
                    );
                }

                return toast.error("Đã có lỗi xảy ra.");
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