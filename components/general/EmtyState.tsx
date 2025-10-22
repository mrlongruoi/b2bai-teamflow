import Link from "next/link";
import { MessageCircleMore, PlusCircle } from "lucide-react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { buttonVariants } from "../ui/button";

interface EmtyStateProps {
    title: string;
    description: string;
    buttonText: string;
    href: string;
}

/**
 * Render an empty-state UI with a title, description, and a primary action link.
 *
 * @param title - The main heading displayed in the empty state
 * @param description - Supporting descriptive text shown below the title
 * @param buttonText - Label for the action link shown as a button
 * @param href - Destination URL for the action link
 * @returns A JSX element representing the empty state layout
 */
export function EmptyState({ title, description, buttonText, href }: EmtyStateProps) {

    return (
        <Empty className="border border-dashed">
            <EmptyHeader>
                <EmptyMedia className="bg-primary/10" variant="icon">
                    <MessageCircleMore className="size-5 text-primary" />
                </EmptyMedia>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Link href={href} className={buttonVariants()}>
                    <PlusCircle />
                    {buttonText}
                </Link>
            </EmptyContent>
        </Empty>
    )
}