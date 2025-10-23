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

/**
 * Renders a message composition UI with a rich text editor, send control, and attachment/upload support.
 *
 * The send button is disabled when `isSubmitting` is true. If `upload.stagedUrl` is present an attachment chip is shown and can be removed via `upload.clear`; otherwise an attach button opens the upload modal via `upload.setOpen(true)`. The image/file upload modal is controlled by `upload.isOpen` and forwards uploaded URLs to `upload.onUploaded`.
 *
 * @param value - Current rich text content
 * @param onChange - Called with updated content when the editor changes
 * @param onSubmit - Called when the send button is clicked
 * @param isSubmitting - When true, disables the send button
 * @param upload - Attachment upload state and handlers (controls staged URL, open state, and upload callbacks)
 * @returns The MessageComposer React element
 */
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