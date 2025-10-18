"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChannelNameSchema, transformChannelName } from "@/app/schemas/channel";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function CreateNewChannel() {
    const [open, setOpen] = useState(false)

    const form = useForm({
        resolver: zodResolver(ChannelNameSchema),
        defaultValues: {
            name: "",
        }
    })

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
                    <form className="space-y-6">
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
                            type="submit"
                        >
                            Tạo
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}