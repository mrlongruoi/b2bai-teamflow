import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttachmentChipProps {
    url: string;
    onRemove: () => void;
}

/**
 * Render an image thumbnail that reveals a destructive remove button on hover.
 *
 * @param url - The image source URL displayed as the attachment thumbnail.
 * @param onRemove - Callback invoked when the remove button is clicked.
 * @returns A React element containing the thumbnail image with a hover overlay that exposes a destructive remove button.
 */
export function AttachmentChip({ url, onRemove }: Readonly<AttachmentChipProps>) {

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