'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Building2, Phone, ArrowRight, AlertCircle } from 'lucide-react'

// Verwende den zentralen SSR-Client mit korrekten Cookie-Optionen
const supabase = createClient()

export default function OnboardingPage() {
  const [organizationName, setOrganizationName] = useState('')
  const [vapiPhoneId, setVapiPhoneId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/login'
        return
      }

      // Check if user already has an organization
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (profile?.organization_id) {
        window.location.href = '/dashboard'
        return
      }

      setCheckingAuth(false)
    }

    checkAuth()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Get current session token
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setError('Sitzung abgelaufen. Bitte erneut einloggen.')
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/onboarding/create-organization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          name: organizationName.trim(),
          vapi_phone_id: vapiPhoneId.trim() || null
        })
      })

      if (response.ok) {
        window.location.href = '/dashboard'
      } else {
        const data = await response.json()
        setError(data.error || 'Fehler beim Erstellen der Organisation')
        setIsLoading(false)
      }
    } catch (err: any) {
      setError(err.message || 'Unbekannter Fehler')
      setIsLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-[100dvh] bg-[#fafaf8] flex items-center justify-center w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#19e66f]/30 border-t-[#12b355] mx-auto"></div>
          <p className="mt-4 text-[14px] font-medium text-slate-500">Laden…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-[#fafaf8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 w-full relative overflow-hidden">
      {/* Background glow for premium feel */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[50%] top-[10%] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[#19e66f]/10 blur-[100px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <span className="font-display text-4xl font-bold tracking-tight text-[#19e66f]">
            Callfolio
          </span>
        </div>
        <h2 className="mt-2 text-center font-display text-[32px] font-bold tracking-[-0.02em] text-slate-900">
          Willkommen bei Callfolio
        </h2>
        <p className="mt-3 text-center text-[15px] font-medium text-slate-500">
          Erstelle deine Hausverwaltung, um loszulegen
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        {/* Double Bezel Architecture */}
        <div className="relative rounded-[3rem] bg-slate-50 p-2 sm:p-3 border border-slate-100 shadow-sm">
          <div className="relative overflow-hidden rounded-[calc(3rem-0.75rem)] bg-white px-6 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] sm:px-10 sm:py-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-2">
                  Name der Hausverwaltung
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="appearance-none block w-full pl-11 px-4 py-3.5 border border-slate-200 rounded-2xl bg-slate-50 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#19e66f]/30 focus:border-[#19e66f] focus:bg-white text-[15px] font-medium transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                    placeholder="z.B. Mustermann Hausverwaltung GmbH"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-2">
                  Vapi Phone ID <span className="text-slate-400 normal-case font-medium tracking-normal">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={vapiPhoneId}
                    onChange={(e) => setVapiPhoneId(e.target.value)}
                    className="appearance-none block w-full pl-11 px-4 py-3.5 border border-slate-200 rounded-2xl bg-slate-50 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#19e66f]/30 focus:border-[#19e66f] focus:bg-white text-[15px] font-mono transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                    placeholder="Kann später konfiguriert werden"
                  />
                </div>
                <p className="mt-2 text-[12px] font-medium text-slate-400 leading-relaxed">
                  Die Phone ID aus deinem Vapi Dashboard. Du kannst das auch unter Einstellungen nachträglich setzen.
                </p>
              </div>

              {error && (
                <div className="rounded-2xl bg-red-50/50 p-4 border border-red-100 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[14px] text-red-700 font-medium leading-snug">{error}</p>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !organizationName.trim()}
                  className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-full text-[15px] font-bold text-[#0f1714] bg-[#19e66f] shadow-[0_8px_30px_rgba(25,230,111,0.25)] hover:scale-[0.98] hover:shadow-[0_12px_40px_rgba(25,230,111,0.35)] disabled:hover:scale-100 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-[#0f1714]/20 border-t-[#0f1714] rounded-full animate-spin" />
                  ) : (
                    <>
                      Organisation erstellen
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="mt-8 text-center text-[11px] font-medium text-slate-400/80">
          &copy; {new Date().getFullYear()} Callfolio – Die intelligente Hausverwaltung.
        </p>
      </div>
    </div>
  )
}