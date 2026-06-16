'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Camera, X, Loader2, CheckCircle2, AlertCircle, Plus,
    UserCircle2, MapPin, Building2, FileImage, MessageSquare, Wrench, Mail
} from 'lucide-react'

// ============================================================
// Callfolio – Public Upload Page (v3)
// Conditional rendering based on mode:
//   mode=register → identity form required (unknown tenant, photo optional)
//   mode=photo    → identity hidden, photo-only (known tenant)
//   undefined     → legacy: needsRecovery drives identity section
// ============================================================

interface Props {
    ticketId: string
    ticketCode: string | null
    initialFirstName: string
    initialLastName: string
    initialUnit: string
    issueSummary: string | null
    orgName: string | null
    orgLogoUrl: string | null
    needsRecovery: boolean
    /** Explicit mode passed from SMS link. Overrides needsRecovery heuristic. */
    mode?: 'register' | 'photo'
}

interface PreviewFile {
    file: File
    previewUrl: string
}

type PageStatus = 'idle' | 'submitting' | 'success' | 'error'

// ── Floating Label Input ──────────────────────────────────────────────────────
function FloatingInput({
    id, label, value, onChange, required = false, icon: Icon,
    type = 'text', inputMode, autoComplete = 'off',
}: {
    id: string
    label: string
    value: string
    onChange: (v: string) => void
    required?: boolean
    icon: React.ElementType
    type?: 'text' | 'email' | 'tel'
    inputMode?: 'text' | 'email' | 'tel'
    autoComplete?: string
}) {
    return (
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#19e66f] transition-colors pointer-events-none">
                <Icon className="w-4 h-4" />
            </div>
            <input
                id={id}
                type={type}
                inputMode={inputMode}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder=" "
                required={required}
                autoComplete={autoComplete}
                className="peer w-full pl-11 pr-4 pt-6 pb-2.5 rounded-2xl border border-gray-200 bg-white
                           focus:border-[#19e66f] focus:ring-2 focus:ring-[#19e66f]/15 outline-none
                           transition-all duration-200 text-sm font-medium text-slate-800
                           placeholder:text-transparent"
            />
            <label
                htmlFor={id}
                className="absolute left-11 pointer-events-none font-bold transition-all duration-200
                           text-[10px] uppercase tracking-widest text-slate-400 top-2
                           peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case
                           peer-placeholder-shown:tracking-normal peer-placeholder-shown:top-[15px]
                           peer-placeholder-shown:text-slate-400
                           peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest
                           peer-focus:top-2 peer-focus:text-[#19e66f]"
            >
                {label}{required ? ' *' : ''}
            </label>
        </div>
    )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function UploadClient({
    ticketId, ticketCode, initialFirstName, initialLastName, initialUnit,
    issueSummary, orgName, orgLogoUrl, needsRecovery, mode,
}: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    // ── Derived mode flags ───────────────────────────────────────────────────
    // mode=register → show identity form (required), photo is optional
    // mode=photo    → hide identity form, photo is required
    // fallback      → use legacy needsRecovery heuristic
    const isRegisterMode = mode === 'register'
    const isPhotoMode    = mode === 'photo'
    const showIdentitySection = isRegisterMode || (!isPhotoMode && needsRecovery)
    const identityRequired    = isRegisterMode   // In register mode identity fields are mandatory

    // Form data — first_name + last_name are the Single Source of Truth (matches DB v17).
    const [firstName, setFirstName] = useState(initialFirstName)
    const [lastName, setLastName]   = useState(initialLastName)
    // Discrete address fields (matches DB v19 + the dashboard edit dialog).
    const [street, setStreet]       = useState('')
    const [houseNumber, setHouseNumber] = useState('')
    const [zip, setZip]             = useState('')
    const [city, setCity]           = useState('')
    const [unit, setUnit]           = useState(initialUnit)
    const [email, setEmail]         = useState('')

    // Photos
    const [files, setFiles] = useState<PreviewFile[]>([])

    // Optional note for the contractor — surfaced in photo mode, appended to issue_details
    const [note, setNote] = useState('')

    // UI state
    const [status, setStatus]               = useState<PageStatus>('idle')
    const [errorMessage, setErrorMessage]   = useState('')
    const [uploadProgress, setUploadProgress] = useState(0)

    // ── Validation helpers ───────────────────────────────────────────────────
    // Reject phone-shaped strings that Vapi sometimes generates as "names"
    const isPhoneLike = (v: string) => /^[+\d\s\-()\u00ad]{7,}$/.test(v.trim())
    const isValidName = (v: string) => v.trim().length >= 2 && !isPhoneLike(v)
    const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

    // Identity is valid only when BOTH first + last pass and the street is filled.
    const identityFilledCorrectly =
        isValidName(firstName) && isValidName(lastName) && street.trim().length >= 2
    const hasNote = note.trim().length > 0
    // Email is optional. If filled it must look like an email — blocks submit in register mode.
    const emailFieldOk = email.trim().length === 0 || isValidEmail(email)
    // PLZ is optional. If filled it must be a 5-digit German postal code.
    const zipFieldOk = zip.trim().length === 0 || /^\d{5}$/.test(zip.trim())

    // canSubmit logic:
    //   register mode → identity required (+ optional photo + optional note)
    //   photo mode    → photo OR note (tenant is already registered)
    //   legacy        → photo OR data (existing logic)
    const canSubmit = isRegisterMode
        ? identityFilledCorrectly && emailFieldOk && zipFieldOk     // identity mandatory + valid email/PLZ if filled
        : isPhotoMode
            ? files.length > 0 || hasNote                           // photo or note
            : files.length > 0 || (showIdentitySection && (firstName.trim() || lastName.trim() || street.trim() || unit.trim()))

    // ── File handling ───────────────────────────────────────────────────────
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files
        if (!selected) return

        const newFiles: PreviewFile[] = []
        for (let i = 0; i < selected.length; i++) {
            const f = selected[i]
            if (!f.type.startsWith('image/')) continue
            if (f.size > 10 * 1024 * 1024) continue
            newFiles.push({ file: f, previewUrl: URL.createObjectURL(f) })
        }

        if (newFiles.length > 0) {
            setFiles(prev => [...prev, ...newFiles])
            setStatus('idle')
            setErrorMessage('')
        }
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const removeFile = (index: number) => {
        setFiles(prev => {
            const copy = [...prev]
            URL.revokeObjectURL(copy[index].previewUrl)
            copy.splice(index, 1)
            return copy
        })
    }

    // ── Submit ──────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!canSubmit) return

        // Extra client-side guard: never send phone-shaped or too-short names
        if (showIdentitySection && (firstName.trim() || lastName.trim())) {
            if (isPhoneLike(firstName) || isPhoneLike(lastName)) {
                setStatus('error')
                setErrorMessage('Bitte geben Sie Ihren Namen ein (keine Telefonnummer).')
                return
            }
            if (firstName.trim().length < 2 || lastName.trim().length < 2) {
                setStatus('error')
                setErrorMessage('Vor- und Nachname müssen jeweils mindestens 2 Zeichen lang sein.')
                return
            }
        }

        setStatus('submitting')
        setErrorMessage('')
        setUploadProgress(0)

        try {
            // 1. Patch identity data and/or the contractor note via patch_data.
            //    Two trigger cases:
            //      (a) register/recovery mode → identity fields filled
            //      (b) photo mode → tenant added an optional note
            //    Photo-mode never sends caller_name/address so we don't overwrite
            //    known good identity data with the form's empty strings.
            const wantsIdentityPatch = showIdentitySection && identityFilledCorrectly
            const wantsNotePatch     = hasNote

            if (wantsIdentityPatch || wantsNotePatch) {
                const patchBody: Record<string, string | undefined> = {
                    ticket_id: ticketId,
                    action: 'patch_data',
                }
                if (wantsIdentityPatch) {
                    if (isValidName(firstName)) patchBody.first_name = firstName.trim()
                    if (isValidName(lastName))  patchBody.last_name  = lastName.trim()
                    if (street.trim())          patchBody.street       = street.trim()
                    if (houseNumber.trim())     patchBody.house_number = houseNumber.trim()
                    if (zip.trim())             patchBody.zip          = zip.trim()
                    if (city.trim())            patchBody.city         = city.trim()
                    if (unit.trim())            patchBody.unit         = unit.trim()
                    if (isValidEmail(email))    patchBody.email        = email.trim().toLowerCase()
                }
                if (wantsNotePatch) {
                    patchBody.tenant_note = note.trim()
                }

                const res = await fetch('/api/public/ticket-update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(patchBody),
                })
                if (!res.ok) {
                    const data = await res.json()
                    throw new Error(data.error || 'Fehler beim Speichern der Daten')
                }
            }

            // 2. Upload photos
            if (files.length > 0) {
                let uploaded = 0
                for (const { file } of files) {
                    const formData = new FormData()
                    formData.append('file', file)
                    formData.append('ticketId', ticketId)

                    const res = await fetch('/api/upload', { method: 'POST', body: formData })
                    if (!res.ok) {
                        const data = await res.json()
                        throw new Error(data.error || 'Upload fehlgeschlagen')
                    }
                    uploaded++
                    setUploadProgress(Math.round((uploaded / files.length) * 100))
                }
            }

            setStatus('success')
        } catch (err: any) {
            setStatus('error')
            setErrorMessage(err.message || 'Ein unerwarteter Fehler ist aufgetreten.')
        }
    }

    // ── Page headline + subtitle based on mode ──────────────────────────────
    // In photo mode we greet by first name (tenant is already registered).
    const greetingFirstName = (initialFirstName ?? '').trim()
    const personalGreeting = greetingFirstName ? `Hallo ${greetingFirstName},` : 'Hallo,'

    const headline = isRegisterMode
        ? 'Kurze Bestätigung'
        : isPhotoMode
            ? personalGreeting
            : needsRecovery
                ? 'Ihre Angaben'
                : 'Foto hinzufügen'

    const subline = isRegisterMode
        ? 'Damit wir Ihr Anliegen richtig zuordnen können, bestätigen Sie bitte kurz Ihren Namen und Ihre Adresse. Ein Foto ist optional.'
        : isPhotoMode
            ? 'damit der Handwerker optimal vorbereitet anrücken kann, laden Sie bitte ein Foto des Schadens hoch. Eine kurze Notiz hilft zusätzlich.'
            : needsRecovery
                ? 'Wir konnten Ihre Daten nicht vollständig zuordnen. Bitte helfen Sie uns, Ihr Anliegen korrekt zu bearbeiten.'
                : 'Laden Sie ein Foto des Schadens hoch, damit der Handwerker optimal vorbereitet ist.'

    // ── Success Screen ──────────────────────────────────────────────────────
    if (status === 'success') {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 font-[family-name:var(--font-space-grotesk)]">
                <div className="flex flex-col items-center gap-6 max-w-xs text-center">
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                        className="w-24 h-24 rounded-full bg-[#19e66f]/10 flex items-center justify-center"
                    >
                        <CheckCircle2 className="w-12 h-12 text-[#19e66f]" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.4 }}
                        className="space-y-3"
                    >
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                            Vielen Dank!
                        </h1>
                        <p className="text-slate-500 leading-relaxed text-sm font-medium">
                            Ihre Daten wurden erfolgreich übermittelt. Ein Handwerker wird sich in Kürze mit Ihnen in Verbindung setzen.
                        </p>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-[11px] text-slate-300 font-semibold uppercase tracking-widest mt-4"
                    >
                        Callfolio
                    </motion.p>
                </div>
            </div>
        )
    }

    // ── Main Page ───────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-white flex flex-col font-[family-name:var(--font-space-grotesk)]">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Header */}
            <header className="pt-10 pb-6 px-6 border-b border-slate-50">
                {(orgLogoUrl || orgName) && (
                    <div className="flex items-center gap-3 mb-6">
                        {orgLogoUrl ? (
                            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                                <Image src={orgLogoUrl} alt={orgName || 'Logo'} width={160} height={40} unoptimized className="h-10 w-auto max-w-[160px] object-contain" />
                            </div>
                        ) : (
                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-slate-400" />
                            </div>
                        )}
                        <div>
                            <p className="font-black text-slate-900 text-sm leading-tight">{orgName}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Mieterportal</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                        {ticketCode ? `Ticket #${ticketCode}` : 'Anfrage'}
                    </span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    {headline}
                </h1>
                <p className="text-slate-400 text-sm mt-1.5 leading-relaxed font-medium">
                    {subline}
                </p>
            </header>

            <main className="flex-1 px-6 pt-6 pb-4 space-y-6">

                {/* ── Issue Summary Card (photo mode only) ── */}
                {isPhotoMode && issueSummary && (
                    <section className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Wrench className="w-3.5 h-3.5 text-slate-400" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Ihr Anliegen
                            </p>
                        </div>
                        <p className="text-sm text-slate-700 font-medium leading-relaxed">
                            {issueSummary}
                        </p>
                    </section>
                )}

                {/* ── Identity / Registration Section ── */}
                {showIdentitySection && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#19e66f]" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {identityRequired ? 'Ihre Daten (erforderlich)' : 'Ihre Daten'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <FloatingInput
                                id="first-name"
                                label="Vorname"
                                value={firstName}
                                onChange={setFirstName}
                                required={identityRequired}
                                icon={UserCircle2}
                                autoComplete="given-name"
                            />
                            <FloatingInput
                                id="last-name"
                                label="Nachname"
                                value={lastName}
                                onChange={setLastName}
                                required={identityRequired}
                                icon={UserCircle2}
                                autoComplete="family-name"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2">
                                <FloatingInput
                                    id="street"
                                    label="Straße"
                                    value={street}
                                    onChange={setStreet}
                                    required={identityRequired}
                                    icon={MapPin}
                                    autoComplete="address-line1"
                                />
                            </div>
                            <FloatingInput
                                id="house-number"
                                label="Nr."
                                value={houseNumber}
                                onChange={setHouseNumber}
                                icon={Building2}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <FloatingInput
                                id="zip"
                                label="PLZ"
                                value={zip}
                                onChange={setZip}
                                icon={MapPin}
                                inputMode="tel"
                                autoComplete="postal-code"
                            />
                            <div className="col-span-2">
                                <FloatingInput
                                    id="city"
                                    label="Stadt"
                                    value={city}
                                    onChange={setCity}
                                    icon={Building2}
                                    autoComplete="address-level2"
                                />
                            </div>
                        </div>
                        <FloatingInput
                            id="unit"
                            label="Wohnung / Stockwerk / Lage"
                            value={unit}
                            onChange={setUnit}
                            icon={Building2}
                        />

                        {/* E-Mail — only collected during register flow */}
                        {isRegisterMode && (
                            <FloatingInput
                                id="email"
                                label="E-Mail (optional)"
                                value={email}
                                onChange={setEmail}
                                icon={Mail}
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                            />
                        )}

                        {/* Validation hint */}
                        {identityRequired && (!isValidName(firstName) || !isValidName(lastName) || street.trim().length < 2) && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-amber-600 font-medium flex items-center gap-1.5 px-1"
                            >
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                Bitte Vor- und Nachname sowie die Straße ausfüllen, um fortzufahren.
                            </motion.p>
                        )}
                        {isRegisterMode && zip.trim().length > 0 && !/^\d{5}$/.test(zip.trim()) && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-amber-600 font-medium flex items-center gap-1.5 px-1"
                            >
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                Die PLZ muss aus 5 Ziffern bestehen oder leer bleiben.
                            </motion.p>
                        )}
                        {isRegisterMode && email.trim().length > 0 && !isValidEmail(email) && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-amber-600 font-medium flex items-center gap-1.5 px-1"
                            >
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                Bitte eine gültige E-Mail-Adresse eintragen oder das Feld leer lassen.
                            </motion.p>
                        )}

                        <div className="h-px bg-slate-50 mt-2" />
                    </section>
                )}

                {/* ── Photo Upload Section ── */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#19e66f]" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {isRegisterMode ? 'Foto (optional)' : isPhotoMode ? 'Foto' : `Foto${needsRecovery ? ' (optional)' : ''}`}
                        </p>
                    </div>

                    {/* Camera trigger */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={status === 'submitting'}
                        className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-10 flex flex-col items-center justify-center gap-3 active:scale-[0.98] transition-transform disabled:opacity-50"
                    >
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                            <Camera className="w-6 h-6 text-[#19e66f]" />
                        </div>
                        <div className="text-center">
                            <p className="font-black text-slate-700 text-sm">Foto aufnehmen oder auswählen</p>
                            <p className="text-xs text-slate-400 mt-0.5 font-medium">JPEG · PNG · WebP · max. 10 MB</p>
                        </div>
                    </button>

                    {/* Thumbnails */}
                    <AnimatePresence>
                        {files.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                    {files.length} {files.length === 1 ? 'Foto' : 'Fotos'} ausgewählt
                                </p>
                                <div className="grid grid-cols-3 gap-3">
                                    {files.map((pf, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm"
                                        >
                                            <Image src={pf.previewUrl} alt={`Foto ${i + 1}`} fill unoptimized sizes="(max-width: 768px) 33vw, 150px" className="object-cover" />
                                            {status !== 'submitting' && (
                                                <button
                                                    onClick={() => removeFile(i)}
                                                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
                                                >
                                                    <X className="w-3.5 h-3.5 text-white" />
                                                </button>
                                            )}
                                        </motion.div>
                                    ))}
                                    {status !== 'submitting' && (
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center active:scale-95 transition-transform"
                                        >
                                            <Plus className="w-6 h-6 text-slate-300" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* ── Optional Note for Contractor (photo mode + register optional) ── */}
                {(isPhotoMode || isRegisterMode) && (
                    <section className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#19e66f]" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Notiz für den Handwerker (optional)
                            </p>
                        </div>
                        <div className="relative">
                            <div className="absolute left-4 top-4 text-slate-300 pointer-events-none">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <textarea
                                id="tenant-note"
                                value={note}
                                onChange={e => setNote(e.target.value.slice(0, 500))}
                                placeholder="Zusatzinfos für den Handwerker, z. B. Wo genau im Bad, beste Erreichbarkeit…"
                                rows={4}
                                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white
                                           focus:border-[#19e66f] focus:ring-2 focus:ring-[#19e66f]/15 outline-none
                                           transition-all duration-200 text-sm font-medium text-slate-800
                                           placeholder:text-slate-300 resize-none"
                            />
                            <p className="text-[10px] text-slate-300 font-medium text-right mt-1 pr-1">
                                {note.length}/500
                            </p>
                        </div>
                    </section>
                )}

                {/* Error */}
                {status === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
                    </div>
                )}

                {/* Upload progress */}
                {status === 'submitting' && files.length > 0 && (
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Loader2 className="w-4 h-4 text-[#19e66f] animate-spin" />
                            <p className="text-sm font-bold text-slate-600">
                                {uploadProgress < 100 ? `Wird übertragen… ${uploadProgress}%` : 'Abschließen…'}
                            </p>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-[#19e66f] rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                )}
            </main>

            {/* Footer / CTA */}
            <div className="px-6 pb-10 pt-2 space-y-3">
                <button
                    onClick={handleSubmit}
                    disabled={!canSubmit || status === 'submitting'}
                    className="w-full py-4 bg-[#19e66f] hover:bg-[#14cc60] active:scale-[0.98]
                               text-white font-black text-sm uppercase tracking-wider rounded-2xl
                               shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2.5
                               disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                    {status === 'submitting' ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Wird gesendet…</>
                    ) : files.length > 0 ? (
                        <><FileImage className="w-5 h-5" /> {files.length === 1 ? 'Foto senden' : `${files.length} Fotos senden`}{showIdentitySection && identityFilledCorrectly ? ' & Daten speichern' : ''}</>
                    ) : isRegisterMode ? (
                        <><CheckCircle2 className="w-5 h-5" /> Daten bestätigen</>
                    ) : (
                        <><CheckCircle2 className="w-5 h-5" /> Daten übermitteln</>
                    )}
                </button>

                <p className="text-center text-[11px] text-slate-300 font-medium leading-relaxed px-4">
                    Ihre Angaben werden sicher übertragen und ausschließlich zur Bearbeitung Ihres Anliegens verwendet.
                </p>
            </div>
        </div>
    )
}
