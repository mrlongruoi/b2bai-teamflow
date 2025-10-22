import { useState } from "react";
import { Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { MemberItem } from "./MemberItem";
import { Skeleton } from "@/components/ui/skeleton";

export function MemberOverview() {
    const [Open, setOpen] = useState(false);

    const [search, setSearch] = useState("");

    const { data, isLoading, error } = useQuery(
        orpc.workspace.member.list.queryOptions()
    )

    if (error) {
        return <h1>Lỗi: {error.message}</h1>
    }

    const members = data ?? [];

    const query = search.trim().toLowerCase();

    const filteredMembers = query ? members.filter((m) => {
        const name = m.full_name?.toLowerCase();

        const email = m.email?.toLowerCase();

        return name?.includes(query) || email?.includes(query);
    }) : members;

    return (
        <Popover open={Open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="dark:invert-20"
                >
                    <Users />
                    <span>Thành viên</span>
                </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="p-0 w-[300px]">
                <div className="p-0">
                    {/* header */}
                    <div className="px-4 py-3 border-b">
                        <h3 className="font-semibold text-sm">Thành viên trong kênh</h3>
                        <p className="text-xs text-muted-foreground">Danh sách thành viên</p>
                    </div>

                    {/* search */}
                    <div className="p-3 border-b">
                        <div className="relative ">
                            <Search
                                className="size-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                            />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Tìm kiếm thành viên..."
                                className="pl-9 h-8"
                            />
                        </div>
                    </div>

                    {/* members */}
                    <div className="max-h-80 overflow-y-auto">
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 px-4 py-2">
                                    <Skeleton className="size-8 rounded-full" />
                                    <div className="flex-1 space-y-1">
                                        <Skeleton className="h-3 w-32" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                            ))
                        ) : filteredMembers.length === 0 ? (
                            <p className="px-4 py-6 text-sm text-muted-foreground">Không tìm thấy thành viên nào</p>
                        ) : (
                            filteredMembers.map((member) => (
                                <MemberItem key={member.id} member={member} />
                            ))
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}