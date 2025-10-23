import { createQueryClient } from './client'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

export const getQueryClient = cache(createQueryClient)

/**
 * Provides a React Query hydration context using the dehydrated state of the given QueryClient.
 *
 * @param props.children - Content to render inside the hydration boundary.
 * @param props.client - QueryClient whose dehydrated state is used to initialize the hydration boundary.
 * @returns A React element that renders a HydrationBoundary initialized with the client's dehydrated state.
 */
export function HydrateClient(props: Readonly<{ children: React.ReactNode, client: QueryClient }>) {
  return (
    <HydrationBoundary state={dehydrate(props.client)}>
      {props.children}
    </HydrationBoundary>
  )
}