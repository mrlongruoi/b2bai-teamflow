import { Send, FileIcon } from "lucide-react";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";
import { ImageUploadModal } from "@/components/rich-text-editor/ImageUploadModal";
import { UseAttachmentUploadType } from "@/hooks/use-attachment-upload";
import { AttachmentChip } from "./AttachmentChip";

interface MessageComposerProps {
    value: string;
    onChange: (next: string) => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
    upload: UseAttachmentUploadType;
}

export function MessageComposer({ value, onChange, onSubmit, isSubmitting, upload }: Readonly<MessageComposerProps>) {

    return (
        <>
            <RichTextEditor
                field={{
                    value,
                    onChange
                }}
                sendButton={
                    <Button disabled={isSubmitting} type="button" size="sm" onClick={onSubmit}>
                        <Send className="size-4 mr-1" />
                        Gửi
                    </Button>}

                footerLeft={
                    upload.stagedUrl ? (
                        <AttachmentChip url={upload.stagedUrl} onRemove={upload.clear} />
                    ) : (
                        <Button className="dark:invert-20" onClick={() => upload.setOpen(true)} type="button" size="sm" variant="outline" >
                            <FileIcon className="size-4 mr-1" />
                            Đính kèm File
                        </Button>
                    )
                }
            />

            <ImageUploadModal
                onUploaded={(url) => upload.onUploaded(url)}
                open={upload.isOpen}
                onOpenChange={upload.setOpen}
            />
        </>
    )
}