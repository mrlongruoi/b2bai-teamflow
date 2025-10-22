import { MessageSquareText, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface toolbarProps {
    messageId: string;
    canEdit: boolean;
    onEdit: () => void;
}

/**
 * Render a compact hover toolbar for a specific message with action buttons.
 *
 * @param messageId - The ID of the message this toolbar is associated with
 * @param canEdit - If `true`, show an edit button for the message
 * @param onEdit - Callback invoked when the edit button is clicked
 * @returns The JSX element representing the message hover toolbar
 */
export function MessageHoverToolbar({ messageId, canEdit, onEdit }: toolbarProps) {

    return (
        <div className="absolute -right-2 -top-3 items-center gap-1 rounded-md border border-gray-200 bg-white/95 px-1.5 py-1 shadow-sm backdrop-blur transition-opacity opacity-0 group-hover:opacity-100 dark:border-neutral-800 dark:bg-neutral-900/90">
            {canEdit && (
                <Button variant="ghost" size="icon" onClick={onEdit}>
                    <Pencil className="size-4" />
                </Button>
            )}

            <Button variant="ghost" size="icon">
                <MessageSquareText className="size-4" />
            </Button>
        </div>
    )
}