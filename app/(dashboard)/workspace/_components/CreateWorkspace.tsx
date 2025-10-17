"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { workspaceSchema, WorkspaceSchemaType } from "@/app/schemas/workspace";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { isDefinedError } from "@orpc/client";

/**
 * Render a dialog-based UI that validates a workspace name and creates a new workspace.
 *
 * Manages the form lifecycle, displays success or error feedback, and closes the dialog when creation succeeds.
 *
 * @returns The component UI containing the trigger button and the create-workspace dialog
 */
export function CreateWorkspace() {
    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();

    const form = useForm({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: "",
        },
    })

    const createWorkspaceMutation = useMutation(
        orpc.workspace.create.mutationOptions({
            onSuccess: (newWorkspace) => {
                toast.success(`Không gian làm việc ${newWorkspace.workspaceName} đã tạo thành công!`)

                queryClient.invalidateQueries({
                    queryKey: orpc.workspace.list.queryKey(),
                });

                form.reset();
                setOpen(false);
            },
            onError: (error) => {
                if (isDefinedError(error)) {
                    if (error.code === "RATE_LIMITED") {
                        toast.message(error.message);
                        return;
                    }
                    toast.error(error.message);
                    return;
                }
                toast.error("Không tạo được không gian làm việc. Vui lòng thử lại!")
            }
        })
    )

    function onSubmit(values: WorkspaceSchemaType) {
        createWorkspaceMutation.mutate(values)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-12 rounded-xl border-2 border-dashed border-muted-foreground/50 text-muted-foreground hover:border-muted-foreground hover:text-foreground hover:rounded-lg transition-all duration-200"
                        >
                            <Plus className="size-5" />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>Tạo không gian làm việc</p>
                </TooltipContent>
            </Tooltip>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tạo không gian làm việc</DialogTitle>
                    <DialogDescription>
                        Không gian làm việc mới để bắt đầu
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        className="space-y-6"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Không gian làm việc của bạn"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button disabled={createWorkspaceMutation.isPending} type="submit">
                            {createWorkspaceMutation.isPending ? "Đang tạo..." : "Tạo không gian"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}