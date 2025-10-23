import { useState } from "react";
import { SmilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EmojiPicker, EmojiPickerContent, EmojiPickerFooter, EmojiPickerSearch } from "@/components/ui/emoji-picker";

interface EmojiReactionProps {
    onSelect: (emoji: string) => void;
}

export function EmojiReaction({ onSelect }: Readonly<EmojiReactionProps>) {
    const [open, setOpen] = useState(false);

    const handleEmojiSelect = (emoji: string) => {
        onSelect(emoji);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                >
                    <SmilePlus className="size-4" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-fit p-0"
                align="start"
            >
                <EmojiPicker
                    className="h-[342px]"
                    onEmojiSelect={(e) => handleEmojiSelect(e.emoji)}
                >
                    <EmojiPickerSearch />
                    <EmojiPickerContent />
                    <EmojiPickerFooter />
                </EmojiPicker>
            </PopoverContent>
        </Popover>
    )
}