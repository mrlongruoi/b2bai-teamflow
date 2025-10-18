"use client";

import { orpc } from "@/lib/orpc";
import { useSuspenseQuery } from "@tanstack/react-query";

/**
 * Displays the current workspace's organization name as a heading.
 *
 * @returns A JSX heading element containing the current workspace's `orgName`.
 */
export function WorkspaceHeader() {
    const { data: { currentWorkspace } } = useSuspenseQuery(orpc.channel.list.queryOptions())

    return (
        <h2 className="text-lg font-semibold">
            {currentWorkspace.orgName}
        </h2>
    )
}