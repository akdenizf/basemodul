'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'

// Verwende den zentralen SSR-Client mit korrekten Cookie-Optionen
const supabase = createClient()

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegisterMode, setIsRegisterMode] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'E-Mail oder Passwort falsch' : error.message)
      setIsLoading(false)
    } else {
      window.location.href = '/dashboard'
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein.')
      setIsLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else if (data.user?.identities?.length === 0) {
      setError('Diese E-Mail-Adresse wird bereits verwendet.')
      setIsLoading(false)
    } else {
      setSuccess('Registrierung fast abgeschlossen! Wir haben dir einen Bestätigungslink an deine E-Mail gesendet.')
      setIsLoading(false)
      setEmail('')
      setPassword('')
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#fafaf8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 w-full relative overflow-hidden">
      {/* Background glow for premium feel */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[50%] top-[10%] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[#19e66f]/10 blur-[100px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-4xl font-bold tracking-tight text-[#19e66f]">
              Callfolio
            </span>
          </Link>
        </div>
        <h2 className="mt-2 text-center font-display text-[32px] font-bold tracking-[-0.02em] text-slate-900">
          {isRegisterMode ? 'Konto erstellen' : 'Willkommen zurück'}
        </h2>
        <p className="mt-3 text-center text-[15px] font-medium text-slate-500">
          {isRegisterMode ? 'Starte jetzt mit Callfolio' : 'Melde dich an, um deine Tickets zu verwalten'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        {/* Double Bezel Architecture */}
        <div className="relative rounded-[3rem] bg-slate-50 p-2 sm:p-3 border border-slate-100 shadow-sm">
          <div className="relative overflow-hidden rounded-[calc(3rem-0.75rem)] bg-white px-6 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] sm:px-10 sm:py-12">

            {success ? (
              <div className="text-center py-4">
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-[#19e66f]/15 mb-6 shadow-sm border border-[#19e66f]/20">
                  <CheckCircle2 className="h-7 w-7 text-[#12b355]" />
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-900 mb-3 tracking-tight">E-Mail prüfen</h3>
                <p className="text-[15px] text-slate-500 mb-8 leading-relaxed font-medium">
                  {success}
                </p>
                <button
                  onClick={() => { setSuccess(''); setIsRegisterMode(false); }}
                  className="w-full flex justify-center py-3.5 px-4 rounded-full text-[15px] font-bold text-[#0f1714] bg-[#19e66f] shadow-[0_8px_30px_rgba(25,230,111,0.25)] hover:bg-[#15d163] hover:scale-[0.98] transition-all duration-300"
                >
                  Zum Login
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={isRegisterMode ? handleRegister : handleLogin}>
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-2">
                    E-Mail-Adresse
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full pl-11 px-4 py-3.5 border border-slate-200 rounded-2xl bg-slate-50 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#19e66f]/30 focus:border-[#19e66f] focus:bg-white text-[15px] font-medium transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                      placeholder="name@firma.de"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-2">
                    Passwort
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full pl-11 px-4 py-3.5 border border-slate-200 rounded-2xl bg-slate-50 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#19e66f]/30 focus:border-[#19e66f] focus:bg-white text-[15px] font-medium transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                      placeholder="••••••••"
                    />
                  </div>
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
                    disabled={isLoading}
                    className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-full text-[15px] font-bold text-[#0f1714] bg-[#19e66f] shadow-[0_8px_30px_rgba(25,230,111,0.25)] hover:scale-[0.98] hover:shadow-[0_12px_40px_rgba(25,230,111,0.35)] disabled:hover:scale-100 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-[#0f1714]/20 border-t-[#0f1714] rounded-full animate-spin" />
                    ) : (
                      <>
                        {isRegisterMode ? 'Konto erstellen' : 'Anmelden'}
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {!success && (
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-[13px] font-medium text-slate-400">
                      {isRegisterMode ? 'Bereits ein Konto?' : 'Neu bei Callfolio?'}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => {
                      setIsRegisterMode(!isRegisterMode)
                      setError('')
                    }}
                    className="w-full flex justify-center py-3.5 px-4 border border-slate-200 rounded-full bg-white text-[15px] font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all duration-300"
                  >
                    {isRegisterMode ? 'Hier anmelden' : 'Kostenlos registrieren'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 relative z-10 pb-8">
          <div className="flex flex-col items-center gap-2">
            <p className="text-[13px] font-medium text-slate-500">
              Ein Produkt von <span className="font-bold text-slate-900">AGENTEQ</span>
            </p>
            <div className="flex items-center gap-3 text-[12px] font-medium text-slate-400">
              <Link href="/impressum" className="hover:text-slate-600 transition-colors">
                Impressum
              </Link>
              <span>•</span>
              <Link href="/datenschutz" className="hover:text-slate-600 transition-colors">
                Datenschutz
              </Link>
            </div>
          </div>
          <p className="text-center text-[11px] font-medium text-slate-400/80">
            &copy; {new Date().getFullYear()} Callfolio – Die intelligente Hausverwaltung.
          </p>
        </div>
      </div>
    </div>
  )
}