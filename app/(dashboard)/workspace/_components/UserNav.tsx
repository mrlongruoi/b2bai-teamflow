import { LogoutLink, PortalLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { CreditCard, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const user = {
    picture: "https://github.com/shadcn.png",
    given_name: 'mrlongruoi',
}

export function UserNav() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="size-12 rounded-xl hover:rounded-lg transition-all duration-200 bg-background/50 border-boder/50 hover:bg-accent hover:text-accent-foreground"
                >
                    <Avatar>
                        <AvatarImage
                            src={user.picture}
                            alt="Hình ảnh người dùng"
                            className="object-cover"
                        />
                        <AvatarFallback>{user.given_name.slice(0, 2).toUpperCase()}</AvatarFallback>
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
                            src={user.picture}
                            alt="Hình ảnh người dùng"
                            className="object-cover"
                        />
                        <AvatarFallback>{user.given_name.slice(0, 2).toUpperCase()}</AvatarFallback>
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