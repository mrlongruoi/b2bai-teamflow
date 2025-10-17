"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { workspaceSchema } from "@/app/schemas/workspace";

export function CreateWorkspace() {
    const [open, setOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: "",
        },
    })

    function onSubmit() {
        console.log("data")
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
                        Tạo không gian làm việc mới để bắt đầu
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

                        <Button type="submit">
                            Tạo không gian làm việc
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}