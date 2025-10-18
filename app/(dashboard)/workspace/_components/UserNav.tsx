"use client";

import Image from "next/image";
import { LogoutLink, PortalLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { CreditCard, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { getAvatar } from "@/lib/get-avatar";

/**
 * Render the user profile dropdown for the current authenticated user.
 *
 * Displays an avatar trigger button and a dropdown panel that shows a larger avatar,
 * the user's display name, a static email label, and menu items for "Tài khoản" (Account),
 * "Thanh toán" (Payments), and "Đăng xuất" (Logout). The avatar uses the resolved image
 * source and falls back to the user's initials when the image is unavailable.
 *
 * @returns The dropdown menu element for the authenticated user.
 */
export function UserNav() {
    const { data: { user } } = useSuspenseQuery(orpc.workspace.list.queryOptions());

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="size-12 rounded-xl hover:rounded-lg transition-all duration-200 bg-background/50 border-border/50 hover:bg-accent hover:text-accent-foreground"
                >
                    <Avatar>
                        <Image src={getAvatar(user.picture, user.email!)} alt="Hình ảnh người dùng" className="object-cover" fill />
                        <AvatarFallback>{user.given_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                side="right"
                sideOffset={8}
                className="mt-4"
            >
                <DropdownMenuLabel className="font-normal flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="relative size-8 rounded-lg">
                        <AvatarImage
                            src={getAvatar(user.picture, user.email!)}
                            alt="Hình ảnh người dùng"
                            className="object-cover"
                        />
                        <AvatarFallback>{user.given_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <p className="truncate font-medium">{user.given_name}</p>
                        <p>idevndesign@applications.dev</p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <PortalLink>
                            <User /> Tài khoản
                        </PortalLink>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <PortalLink>
                            <CreditCard /> Thanh toán
                        </PortalLink>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <LogoutLink>
                        <LogOut /> Đăng xuất
                    </LogoutLink>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}