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

interface MessageInputFormProps {
    channelId: string;
    user: KindeUser<Record<string, unknown>>;
}

type MessagePage = { items: Message[]; nextCursor?: string; };

type InfiniteMessages = InfiniteData<MessagePage>;

export function MessageInputForm({ channelId, user }: Readonly<MessageInputFormProps>) {
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

    const insertOptimisticMessage = (
        old: InfiniteMessages | undefined,
        optimisticMessage: InfiniteMessages["pages"][number]["items"][number],
    ): InfiniteMessages => {
        if (!old) {
            return {
                pages: [
                    {
                        items: [optimisticMessage],
                        nextCursor: undefined,
                    },
                ],
                pageParams: [undefined],
            };
        }

        const [firstPage = { items: [], nextCursor: undefined }, ...otherPages] = old.pages;
        const updatedFirstPage = {
            ...firstPage,
            items: [optimisticMessage, ...firstPage.items],
        };

        return {
            ...old,
            pages: [updatedFirstPage, ...otherPages],
        };
    };

    const replaceMessageById = (
        old: InfiniteMessages,
        targetId: string,
        message: InfiniteMessages["pages"][number]["items"][number],
    ): InfiniteMessages => {
        const nextPages = old.pages.map((page) => {
            const updatedItems = page.items.map((item) =>
                item.id === targetId ? { ...message } : item,
            );

            return {
                ...page,
                items: updatedItems,
            };
        });

        return {
            ...old,
            pages: nextPages,
        };
    };

    const createMessageMutation = useMutation(
        orpc.message.create.mutationOptions({
            onMutate: async (data) => {
                await queryClient.cancelQueries({
                    queryKey: ["message.list", channelId],
                });

                const previousData = queryClient.getQueryData<InfiniteMessages>([
                    "message.list",
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
                    authorName: user.given_name ?? "John Doe",
                    authorAvatar: getAvatar(user.picture, user.email!),
                    channelId,
                    threadId: null,
                };

                queryClient.setQueryData<InfiniteMessages>(
                    ["message.list", channelId],
                    (old) => insertOptimisticMessage(old, optimisticMessage),
                );

                return {
                    previousData,
                    tempId,
                };
            },
            onSuccess: (data, _variables, context) => {
                const tempId = context?.tempId;

                queryClient.setQueryData<InfiniteMessages>(
                    ["message.list", channelId],
                    (old) => {
                        if (!old || !tempId) {
                            return old;
                        }

                        return replaceMessageById(old, tempId, data);
                    },
                );

                form.reset({ channelId, content: "" });

                upload.clear();

                setEditorKey((k) => k + 1);

                return toast.success("Tin nhắn được gửi");
            },
            onError: (_err, _variables, context) => {
                if (context?.previousData) {
                    queryClient.setQueryData<InfiniteMessages>(
                        ["message.list", channelId],
                        context.previousData,
                    );
                }

                return toast.error("Đã có lỗi xảy ra.");
            },
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