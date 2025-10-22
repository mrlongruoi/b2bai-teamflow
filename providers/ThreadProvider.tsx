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
 * Provides thread selection and open/close state to descendant components via ThreadContext.
 *
 * @returns A provider element that supplies the current selected thread id, open/close state, and handlers (`openThread`, `closeThread`, `toggleThread`) to its children
 */
export function ThreadProvider({ children }: { children: ReactNode }) {
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

/**
 * Access the current thread context value for the component tree.
 *
 * @returns The context object with `selectedThreadId`, `openThread`, `closeThread`, `toggleThread`, and `isThreadOpen`.
 * @throws Error if called outside a `ThreadProvider` with message "useThread phải được sử dụng trong ThreadProvider".
 */
export function useThread() {
    const context = useContext(ThreadContext);

    if (context === undefined) {
        throw new Error("useThread phải được sử dụng trong ThreadProvider");
    }

    return context;
}