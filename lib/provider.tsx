'use client'

import { useState } from 'react'
import { createQueryClient } from './query/client'
import { QueryClientProvider } from '@tanstack/react-query'

/**
 * Provides a React Query client to all descendant components.
 *
 * Initializes a single QueryClient for the component's lifetime and renders
 * the given children inside a QueryClientProvider.
 *
 * @param props.children - The React nodes to render inside the provider.
 * @returns A React element that wraps `children` with a `QueryClientProvider` backed by a single `QueryClient` instance.
 */
export function Providers(props: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  )
}