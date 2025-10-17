"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { orpc } from "@/lib/orpc";
import { cn } from "@/lib/utils";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useSuspenseQuery } from "@tanstack/react-query";

const colorCombinations = [
    'bg-blue-500 hover:bg-blue-600 text-white',
    'bg-emerald-500 hover:bg-emerald-600 text-white',
    'bg-purple-500 hover:bg-purple-600 text-white',
    'bg-amber-500 hover:bg-amber-600 text-white',
    'bg-rose-500 hover:bg-rose-600 text-white',
    'bg-indigo-500 hover:bg-indigo-600 text-white',
    'bg-cyan-500 hover:bg-cyan-600 text-white',
    'bg-pink-500 hover:bg-pink-600 text-white',
];

const getWorkspaceColor = (id: string) => {
    const charSum = id
        .split("")
        .reduce((sum, char) => sum + char
            .codePointAt(0)!, 0);
    const colorIndex = charSum % colorCombinations.length;

    return colorCombinations[colorIndex];
};

/**
 * Render a vertical list of workspace icon buttons with login links and tooltips.
 *
 * Fetches workspaces and the current workspace via the suspense query and displays each workspace as a colored icon button that navigates using `LoginLink`; the current workspace is visually highlighted and annotated in its tooltip.
 *
 * @returns A React element containing a stacked list of tooltip-wrapped workspace icon buttons where the active workspace is highlighted and labeled "(Hoạt động)" in its tooltip.
 */
export function WorkspaceList() {
    const { data: { workspaces, currentWorkspace } } = useSuspenseQuery(orpc.workspace.list.queryOptions());

    return (
        <TooltipProvider>
            <div className="flex flex-col gap-2">
                {workspaces.map((ws) => {
                    const isActive = currentWorkspace.orgCode === ws.id;

                    return (
                        <Tooltip key={ws.id}>
                            <TooltipTrigger asChild>
                                <LoginLink orgCode={ws.id}>
                                    <Button
                                        size="icon"
                                        className={cn(
                                            "size-12 transition-all duration-200",
                                            getWorkspaceColor(ws.id),
                                            isActive ? 'rounded-lg' : 'rounded-xl hover:rounded-lg',
                                        )}
                                    >
                                        <span className="text-sm font-semibold">{ws.avatar}</span>
                                    </Button>
                                </LoginLink>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p>{ws.name} {isActive && "(Hoạt động)"}{""}</p>
                            </TooltipContent>
                        </Tooltip>
                    )
                })}
            </div>
        </TooltipProvider>
    );
};