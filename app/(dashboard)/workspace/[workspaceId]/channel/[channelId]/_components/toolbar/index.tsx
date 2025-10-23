import { MessageSquareText, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThread } from "@/providers/ThreadProvider";

interface ToolBarProps {
    messageId: string;
    canEdit: boolean;
    onEdit: () => void;
}

/**
 * Renders a hover toolbar with edit and thread actions for a message.
 *
 * Shows an edit button when editing is allowed and always shows a thread button
 * that toggles the thread view for the provided message.
 *
 * @param messageId - The identifier of the message used when toggling the thread view
 * @param canEdit - Whether the edit button should be displayed
 * @param onEdit - Callback invoked when the edit button is clicked
 * @returns A JSX element that displays the hover toolbar with the appropriate buttons
 */
export function MessageHoverToolbar({ messageId, canEdit, onEdit }: Readonly<ToolBarProps>) {
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