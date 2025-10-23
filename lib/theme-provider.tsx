"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * Wraps its children with NextThemesProvider and forwards all received props to it.
 *
 * @returns The rendered NextThemesProvider element containing the provided children.
 */
export function ThemeProvider({
    children,
    ...props
}: Readonly<React.ComponentProps<typeof NextThemesProvider>>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}