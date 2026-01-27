
'use client'

import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react'
import { authClient } from '@/lib/neon-auth'

export function NeonAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <NeonAuthUIProvider authClient={authClient}>
      {children}
    </NeonAuthUIProvider>
  )
}
