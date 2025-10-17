import { createQueryClient } from './client'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

export const getQueryClient = cache(createQueryClient)

/**
 * Wraps children in a React Query HydrationBoundary initialized from the given client.
 *
 * @param props.client - The QueryClient whose cache will be dehydrated and used to hydrate the boundary.
 * @param props.children - The element(s) to render inside the hydration boundary.
 * @returns The provided children wrapped in a HydrationBoundary populated with the client's dehydrated state.
 */
export function HydrateClient(props: { children: React.ReactNode, client: QueryClient }) {
  return (
    <HydrationBoundary state={dehydrate(props.client)}>
      {props.children}
    </HydrationBoundary>
  )
}