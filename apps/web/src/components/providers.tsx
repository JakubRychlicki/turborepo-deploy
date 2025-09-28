'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/utils/trpc'
import { Toaster } from './ui/sonner'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({
  children
}: ProvidersProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
      <Toaster richColors position="top-right" />
    </>
  )
}
