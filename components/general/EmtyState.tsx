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