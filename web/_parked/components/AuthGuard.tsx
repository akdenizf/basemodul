'use client'

import { useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'

// Verwende den zentralen SSR-Client mit korrekten Cookie-Optionen
const supabase = createClient()

interface AuthGuardProps {
  children: ReactNode
  requireOrganization?: boolean
}

export default function AuthGuard({ children, requireOrganization = true }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasOrganization, setHasOrganization] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/login'
        return
      }

      setIsAuthenticated(true)

      // Check for organization if required
      if (requireOrganization) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('user_id', user.id)
          .maybeSingle()

        if (!profile?.organization_id) {
          window.location.href = '/onboarding'
          return
        }

        setHasOrganization(true)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [requireOrganization])

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] w-full h-full bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 font-medium">Laden...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requireOrganization && !hasOrganization) {
    return null
  }

  return <>{children}</>
}