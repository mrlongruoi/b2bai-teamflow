import { MessageSquareText, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThread } from "@/providers/ThreadProvider";

interface toolbarProps {
    messageId: string;
    canEdit: boolean;
    onEdit: () => void;
}

/**
 * Render a hover toolbar for a message that exposes edit and thread actions.
 *
 * The toolbar appears on hover and positions itself relative to the message; when `canEdit` is true it shows an edit button that calls `onEdit`, and it always shows a thread button that toggles the thread for `messageId`.
 *
 * @param messageId - Identifier of the message used when toggling the thread view
 * @param canEdit - When true, shows an edit button
 * @param onEdit - Callback invoked when the edit button is clicked
 * @returns A JSX element representing the positioned hover toolbar with action buttons
 */
export function MessageHoverToolbar({ messageId, canEdit, onEdit }: toolbarProps) {
    const { toggleThread } = useThread();

    return (
        <div className="absolute -right-2 -top-3 items-center gap-1 rounded-md border border-gray-200 bg-white/95 px-1.5 py-1 shadow-sm backdrop-blur transition-opacity opacity-0 group-hover:opacity-100 dark:border-neutral-800 dark:bg-neutral-900/90">
            {canEdit && (
                <Button variant="ghost" size="icon" onClick={onEdit}>
                    <Pencil className="size-4" />
                </Button>
            )}

            <Button variant="ghost" size="icon" onClick={() => toggleThread(messageId)}>
                <MessageSquareText className="size-4" />
            </Button>
        </div>
    )
}