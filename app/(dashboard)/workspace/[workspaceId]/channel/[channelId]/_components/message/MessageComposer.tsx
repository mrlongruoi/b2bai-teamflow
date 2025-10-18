import { Send, ImageIcon } from "lucide-react";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";

interface iAppProps {
    value: string;
    onChange: (next: string) => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
}

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