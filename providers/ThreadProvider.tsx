"use client";

import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

interface ThreadContextType {
    selectedThreadId: string | null;
    openThread: (messageId: string) => void;
    closeThread: () => void;
    toggleThread: (messageId: string) => void;
    isThreadOpen: boolean;
};

const ThreadContext = createContext<ThreadContextType | undefined>(undefined);

/**
 * Provides ThreadContext to descendants and manages the currently selected thread and its open/closed state.
 *
 * @param children - The React nodes to render inside the provider.
 * @returns The context provider element that supplies thread state and control functions (`openThread`, `closeThread`, `toggleThread`, `selectedThreadId`, `isThreadOpen`) to its descendants.
 */
export function ThreadProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

    const [isThreadOpen, setIsThreadOpen] = useState(false);

    const openThread = useCallback((messageId: string) => {
        setSelectedThreadId(messageId);
        setIsThreadOpen(true);
    }, []);

    const closeThread = useCallback(() => {
        setSelectedThreadId(null);
        setIsThreadOpen(false);
    }, []);

    const toggleThread = useCallback((messageId: string) => {
        if (selectedThreadId === messageId && isThreadOpen) {
            closeThread();
        } else {
            openThread(messageId);
        }
    }, [selectedThreadId, isThreadOpen, closeThread, openThread]);

    const value: ThreadContextType = useMemo(
        () => ({
            selectedThreadId,
            openThread,
            closeThread,
            toggleThread,
            isThreadOpen,
        }),
        [selectedThreadId, openThread, closeThread, toggleThread, isThreadOpen],
    );

    return (
        <ThreadContext.Provider value={value}>
            {children}
        </ThreadContext.Provider>
    )
}

export function useThread() {
    const context = useContext(ThreadContext);

    if (context === undefined) {
        throw new Error("useThread phải được sử dụng trong ThreadProvider");
    }

    return context;
}