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
 * Renders a message composer UI with a controlled rich text editor, submit button, and attachment controls.
 *
 * @param value - Current editor content
 * @param onChange - Callback invoked with the new editor content
 * @param onSubmit - Callback invoked when the send button is clicked
 * @param isSubmitting - When true, disables the send button to prevent duplicate submissions
 * @param upload - Attachment upload controls and state (e.g., `stagedUrl`, `isOpen`, `setIsOpen`, `onUploaded`, `clear`)
 * @returns A JSX element that displays the composer, manages attachment staging, and integrates an image/file upload modal
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
                        <Button className="dark:invert-20" onClick={() => upload.setIsOpen(true)} type="button" size="sm" variant="outline" >
                            <FileIcon className="size-4 mr-1" />
                            Đính kèm File
                        </Button>
                    )
                }
            />

            <ImageUploadModal
                onUploaded={(url) => upload.onUploaded(url)}
                open={upload.isOpen}
                onOpenChange={upload.setIsOpen}
            />
        </>
    )
}