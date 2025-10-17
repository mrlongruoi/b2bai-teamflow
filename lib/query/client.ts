import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'
import { serializer } from '../serializer'

/**
 * Create a preconfigured React Query `QueryClient` with custom serialization, hydration, and dehydration behavior.
 *
 * The client serializes query keys and cached data via the project's `serializer`, uses a 60,000 ms stale time for queries,
 * treats queries with state `status === 'pending'` as dehydrable in addition to the default criteria, and preserves serialized
 * data as objects of the form `{ json, meta }` for dehydration/hydration.
 *
 * @returns A `QueryClient` instance configured with the project's `serializer`, a 60,000 ms query stale time, a `queryKeyHashFn` that returns a JSON string of `{ json, meta }`, and custom `dehydrate`/`hydrate` handlers that serialize to and deserialize from `{ json, meta }`.
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn(queryKey) {
          const [json, meta] = serializer.serialize(queryKey)
          return JSON.stringify({ json, meta })
        },
        staleTime: 60 * 1000, // > 0 to prevent immediate refetching on mount
      },
      dehydrate: {
        shouldDehydrateQuery: query => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
        serializeData(data) {
          const [json, meta] = serializer.serialize(data)
          return { json, meta }
        },
      },
      hydrate: {
        deserializeData(data) {
          return serializer.deserialize(data.json, data.meta)
        }
      },
    }
  })
}