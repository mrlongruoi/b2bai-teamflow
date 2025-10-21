import { Send, FileIcon } from "lucide-react";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";
import { ImageUploadModal } from "@/components/rich-text-editor/ImageUploadModal";
import { UseAttachmentUploadType } from "@/hooks/use-attachment-upload";
import { AttachmentChip } from "./AttachmentChip";

interface iAppProps {
    value: string;
    onChange: (next: string) => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
    upload: UseAttachmentUploadType;
}

/**
 * Renders a message composer UI with a rich-text editor, send control, attachment control, and image upload modal.
 *
 * The editor is controlled by `value` and `onChange`. The send button invokes `onSubmit` and is disabled when `isSubmitting` is true.
 * The footer shows an attachment chip when `upload.stagedUrl` is set, otherwise it shows a button that opens the upload modal.
 *
 * @param value - Current editor content
 * @param onChange - Called with the next editor content
 * @param onSubmit - Called when the send button is clicked
 * @param isSubmitting - When true, disables the send button
 * @param upload - Attachment upload state and actions (controls staged URL, modal open state, upload handling, and clear)
 * @returns The composed message input UI as a JSX element
 */
export function MessageComposer({ value, onChange, onSubmit, isSubmitting, upload }: iAppProps) {

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