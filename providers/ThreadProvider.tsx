"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface ThreadContextType {
    selectedThreadId: string | null;
    openThread: (messageId: string) => void;
    closeThread: () => void;
    toggleThread: (messageId: string) => void;
    isThreadOpen: boolean;
};

const ThreadContext = createContext<ThreadContextType | undefined>(undefined);

/**
 * Provides thread selection state and control functions to descendant components.
 *
 * @param children - The React nodes that will receive the thread context
 * @returns The React provider element that supplies thread context to its children
 */
export function ThreadProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

    const [isThreadOpen, setIsThreadOpen] = useState(false);

    const openThread = (messageId: string) => {
        setSelectedThreadId(messageId);
        setIsThreadOpen(true);
    }

    const closeThread = () => {
        setSelectedThreadId(null);
        setIsThreadOpen(false);
    }

    const toggleThread = (messageId: string) => {
        if (selectedThreadId === messageId && isThreadOpen) {
            closeThread();
        } else {
            openThread(messageId);
        }
    }

    const value: ThreadContextType = {
        selectedThreadId,
        openThread,
        closeThread,
        toggleThread,
        isThreadOpen,
    }

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