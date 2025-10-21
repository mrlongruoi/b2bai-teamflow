import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttachmentChipProps {
    url: string;
    onRemove: () => void;
}

/**
 * Renders an attachment thumbnail that reveals a destructive remove button on hover.
 *
 * @param url - Source URL of the attachment image to display.
 * @param onRemove - Callback invoked when the remove button is clicked.
 * @returns The attachment chip JSX element with a hover overlay and remove action.
 */
export function AttachmentChip({ url, onRemove }: AttachmentChipProps) {

    return (
        <div className="group relative overflow-hidden rounded-md bg-muted size-12">
            <Image
                src={url}
                alt="Attachment"
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 grid place-items-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/30 group-hover:opacity-100">
                <Button
                    onClick={onRemove}
                    type="button"
                    variant="destructive"
                    className="size-6 p-0 rounded-full"
                >
                    <X className="size-3" />
                </Button>
            </div>
        </div>
    )
}