import Link from "next/link";
import { MessageCircleMore, PlusCircle } from "lucide-react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { buttonVariants } from "../ui/button";

interface EmptyStateProps {
    title: string;
    description: string;
    buttonText: string;
    href: string;
}

/**
 * Renders a standardized empty state UI with a header icon, title, description, and an action link.
 *
 * @param title - Heading text displayed in the empty state
 * @param description - Supporting description text displayed under the title
 * @param buttonText - Label shown inside the action link button
 * @param href - Destination URL for the action link
 * @returns A React element representing the empty state layout
 */
export function EmptyState({ title, description, buttonText, href }: Readonly<EmptyStateProps>) {

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