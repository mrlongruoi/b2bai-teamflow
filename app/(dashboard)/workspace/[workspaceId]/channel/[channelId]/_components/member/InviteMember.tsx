import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { inviteMemberSchema, InviteMemberSchemaType } from "@/app/schemas/member";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";

/**
 * Renders a modal dialog with a form to invite a workspace member by name and email.
 *
 * The form validates input with the `inviteMemberSchema` (Zod), sends the invitation via the workspace invite mutation, and displays toast feedback:
 * on success it shows a success toast, resets the form, and closes the dialog; on error it shows an error toast with the failure message.
 *
 * @returns The component's JSX element rendering the invite dialog and trigger button.
 */
export default function InviteMember() {
    const [Open, setOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(inviteMemberSchema),
        defaultValues: {
            email: "",
            name: "",
        }
    })

    const inviteMutation = useMutation(
        orpc.workspace.member.invite.mutationOptions({
            onSuccess: () => {
                toast.success("Lời mời đã được gửi thành công!");

                form.reset();

                setOpen(false);
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    )

    function onSubmit(values: InviteMemberSchemaType) {
        inviteMutation.mutate(values);
    }

    return (
        <Dialog open={Open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="dark:invert-20"
                >
                    <UserPlus />
                    Mời thành viên
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Thành viên được mời</DialogTitle>
                    <DialogDescription>Kết nối thành viên của bạn qua thư điện tử</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên thành viên</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập tên thành viên..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Địa chỉ hòm thư</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập địa chỉ E-mail..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">
                            Gửi lời mời
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}