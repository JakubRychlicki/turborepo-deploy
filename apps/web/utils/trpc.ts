import { QueryCache, QueryClient } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import type { AppRouter } from '@repo/api'
import superjson from 'superjson';

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any) => {
      console.error(error)
    }
  })
})

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${baseUrl}/trpc`,
      transformer: superjson,
      fetch(input: RequestInfo | URL, init?: RequestInit) {
        return fetch(input, {
          ...init,
          credentials: 'include'
        })
      }
    })
  ]
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient
})

