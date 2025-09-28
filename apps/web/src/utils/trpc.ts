import { QueryCache, QueryClient } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import type { AppRouter } from '@repo/api'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
import { NAVIGATION } from '@/config/constants'
import superjson from 'superjson';

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const forceLogout = async () => {
  try {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = NAVIGATION.LOGIN
        },
        onError: () => {
          window.location.href = NAVIGATION.LOGIN
        }
      }
    })
  } catch (error) {
    console.error('Error during logout:', error)
    window.location.href = NAVIGATION.LOGIN
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(error.message, {
        action: {
          label: 'retry',
          onClick: () => {
            queryClient.invalidateQueries()
          }
        }
      })
    }
  })
})

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${baseUrl}/trpc`,
      transformer: superjson,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include'
        }).then((response) => {
          if (response.status === 401) {
            forceLogout()
          }
          return response
        })
      }
    })
  ]
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient
})
