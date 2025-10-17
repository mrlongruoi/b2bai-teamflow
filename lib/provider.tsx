'use client'

import { useState } from 'react'
import { createQueryClient } from './query/client'
import { QueryClientProvider } from '@tanstack/react-query'

/**
 * Provides a QueryClient context to descendant components.
 *
 * Initializes a single QueryClient instance for the component lifecycle and supplies it to descendants via React Query's QueryClientProvider.
 *
 * @param props.children - React nodes rendered inside the provider that will receive the QueryClient context
 * @returns The rendered QueryClientProvider wrapping `props.children`
 */
export function Providers(props: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  )
}