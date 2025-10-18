import { Send, ImageIcon } from "lucide-react";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";

interface iAppProps {
    value: string;
    onChange: (next: string) => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
}

/**
 * Render a rich-text message composer with send and attach controls.
 *
 * The send button invokes `onSubmit` and is disabled while `isSubmitting` is true.
 *
 * @param value - Current editor content as an HTML or plain-text string
 * @param onChange - Callback invoked with the updated editor content
 * @param onSubmit - Callback invoked when the send button is clicked
 * @param isSubmitting - When `true`, disables the send button to prevent duplicate submits
 * @returns The message composer React element
 */
export function MessageComposer({ value, onChange, onSubmit, isSubmitting }: iAppProps) {

    return (
        <>
            <RichTextEditor
                field={{
                    value,
                    onChange
                }}
                sendButton={<Button disabled={isSubmitting} type="button" size="sm" onClick={onSubmit}>
                    <Send className="size-4 mr-1" />
                    Gửi
                </Button>}

                footerLeft={
                    <Button type="button" size="sm" variant="outline" >
                        <ImageIcon className="size-4 mr-1" />
                        Gắn
                    </Button>
                }
            />
        </>
    )
}