import { organization_user } from "@kinde/management-api-js"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { getAvatar } from "@/lib/get-avatar";

interface MemberItemProps {
    member: organization_user;
}

/**
 * Renders a clickable member row with avatar, name, role badge, and email.
 *
 * The avatar displays the user's picture when available and shows the first
 * letter of the user's full name as a fallback. The right side shows the
 * member's full name, a "Quản trị viên" role badge, and the member's email.
 *
 * @param member - The organization user to render inside the row
 * @returns A React element representing a clickable member list item
 */
export function MemberItem({ member }: MemberItemProps) {

    return (
        <div className="px-3 py-2 hover:bg-accent cursor-pointer transition-colors">
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <Avatar className="size-8">
                        <Image
                            src={getAvatar(member.picture ?? null, member.email!)}
                            alt="Member Avatar"
                            fill
                            className="object-cover"
                        />
                        <AvatarFallback>
                            {member.full_name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* member info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                            {member.full_name}
                        </p>
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
                            Quản trị viên
                        </span>
                    </div>

                    <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                </div>
            </div>
        </div>
    )
}