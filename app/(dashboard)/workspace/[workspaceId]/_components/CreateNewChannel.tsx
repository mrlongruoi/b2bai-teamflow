"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isDefinedError } from "@orpc/client";
import { orpc } from "@/lib/orpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChannelNameSchema, ChannelSchemaNameType, transformChannelName } from "@/app/schemas/channel";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export function CreateNewChannel() {
    const [open, setOpen] = useState(false)

    const queryClient = useQueryClient();

    const router = useRouter();

    const { workspaceId } = useParams<{ workspaceId: string }>();

    const form = useForm({
        resolver: zodResolver(ChannelNameSchema),
        defaultValues: {
            name: "",
        }
    })

    const createChannelMutation = useMutation(
        orpc.channel.create.mutationOptions({
            onSuccess: (newChannel) => {
                toast.success(`Kênh "${newChannel.name}" đã được tạo thành công!`);
                queryClient.invalidateQueries({
                    queryKey: orpc.channel.list.queryKey(),
                });
                form.reset();

                setOpen(false);

                router.push(`/workspace/${workspaceId}/channel/${newChannel.id}`);
            },
            onError: (error) => {
                if (isDefinedError(error)) {
                    toast.error(error.message);
                    return;
                }
                toast.error("Không tạo được kênh. Vui lòng thử lại!");
            }
        })
    )

    function onSubmit(values: ChannelSchemaNameType) {
        createChannelMutation.mutate(values)
    }

    const watchedName = form.watch("name");

    const transformedName = watchedName ? transformChannelName(watchedName) : "";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full"
                >
                    <Plus className="size-4" />
                    Thêm kênh
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tạo kênh</DialogTitle>
                    <DialogDescription>Tạo kênh mới để bắt đầu</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Kênh của bạn" {...field}
                                        />
                                    </FormControl>
                                    {transformedName && transformedName !== watchedName && (
                                        <p className="text-sm text-muted-foreground">Sẽ được tạo ra như: <code className="bg-muted px-1 py-0.5 rounded text-xs">{transformedName}</code></p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            disabled={createChannelMutation.isPending}
                            type="submit"
                        >
                            {createChannelMutation.isPending ? "Đang tạo..." : "Tạo"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}