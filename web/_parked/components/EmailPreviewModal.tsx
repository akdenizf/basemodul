'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  X, Mail, Send, AlertCircle, Wrench, ChevronDown,
  Loader2, CheckCircle2, Phone, ShieldAlert, Link as LinkIcon
} from 'lucide-react'
import { parseTemplate } from '@/lib/utils/template-parser'
import { contractorAssignmentTemplate, tenantConfirmationTemplate } from '@/lib/email-templates'
import type { Ticket } from '@/lib/types'

// ============================================================
// CALLFOLIO v8.1 – Email Preview Modal (HTML + Photo Embedding)
// ============================================================

export interface EmailData {
  recipient_type: 'admin' | 'tenant' | 'contractor'
  recipient_email: string
  subject: string
  body: string
  html_body?: string
  template_type: string
  contractor_id?: string
  contractor_name?: string
  org_name?: string
}

interface CommunicationTemplate {
  id: string
  slug: string
  label: string
  subject: string
  content: string
}

interface Contractor {
  id: string
  name: string
  email: string
  phone: string
  trade: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  ticket: Ticket
  onSend: (data: EmailData) => Promise<void>
  preselectedTemplateId?: string | null
  preselectedContractorId?: string | null
  orgName?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Converts URLs in plain text to clickable links (for the preview)
function renderBodyWithLinks(body: string) {
  const urlPattern = /(https?:\/\/[^\s)]+)/g
  const parts = body.split(urlPattern)

  return parts.map((part, i) => {
    if (urlPattern.test(part)) {
      // Reset regex lastIndex since test() advances it
      urlPattern.lastIndex = 0
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-600 dark:text-slate-400 underline underline-offset-2 decoration-slate-400 dark:decoration-slate-600 hover:decoration-slate-600 break-all inline-flex items-baseline gap-1"
        >
          {part}
          <LinkIcon className="w-3 h-3 inline shrink-0 relative top-[1px]" />
        </a>
      )
    }
    return <span key={i}>{part}</span>
  })
}

const supabase = createClient()

export default function EmailPreviewModal({ isOpen, onClose, ticket, onSend, preselectedTemplateId, preselectedContractorId, orgName }: Props) {
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([])
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [signature, setSignature] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined)
  const [allPhotoUrls, setAllPhotoUrls] = useState<string[]>([])

  const [selectedSlug, setSelectedSlug] = useState<string>('')
  const [selectedContractorId, setSelectedContractorId] = useState<string>(preselectedContractorId || '')
  const [recipientEmail, setRecipientEmail] = useState('')

  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // ---------- Load templates + contractors + photo ----------
  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const headers = { 'Authorization': `Bearer ${session.access_token}` }

      const [templatesRes, contractorsRes, extraRes, attachmentsRes] = await Promise.all([
        fetch('/api/communication-templates', { headers }),
        fetch('/api/contractors', { headers }),
        fetch('/api/settings/org-extra', { headers }),
        supabase.from('ticket_attachments').select('file_url, storage_path').eq('ticket_id', ticket.id)
      ])

      if (templatesRes.ok) {
        const { templates: t } = await templatesRes.json()
        setTemplates(t || [])

        if (preselectedTemplateId) {
          const found = t.find((tpl: CommunicationTemplate) => tpl.slug === preselectedTemplateId)
          if (found) setSelectedSlug(found.slug)
        } else if (!selectedSlug) {
          const emailTemplates = (t || []).filter((tpl: CommunicationTemplate) => !tpl.slug.includes('sms'))
          if (emailTemplates.length > 0) {
            setSelectedSlug(emailTemplates[0].slug)
          }
        }
      }

      if (contractorsRes.ok) {
        const { contractors: c } = await contractorsRes.json()
        setContractors(c || [])
      }

      if (extraRes.ok) {
        const { settings } = await extraRes.json()
        setSignature(settings?.sender_signature || '')
      }

      // Load ALL photo URLs for embedding
      if (attachmentsRes.data && attachmentsRes.data.length > 0) {
        const urls = attachmentsRes.data
          .map((a: any) => a.file_url)
          .filter(Boolean) as string[]
        setAllPhotoUrls(urls)
        if (urls.length > 0) setPhotoUrl(urls[0])
      }
    } catch (err) {
      console.error('EmailPreviewModal: failed to load data', err)
    } finally {
      setIsLoading(false)
    }
  }, [ticket.id, preselectedTemplateId, selectedSlug])

  useEffect(() => {
    if (isOpen) {
      loadData()
      if (preselectedContractorId) {
        setSelectedContractorId(preselectedContractorId)
      }
    }
  }, [isOpen, loadData, preselectedContractorId])

  // ---------- Derived state ----------
  const selectedTemplate = useMemo(() => templates.find(t => t.slug === selectedSlug), [templates, selectedSlug])
  const selectedContractor = useMemo(() => contractors.find(c => c.id === selectedContractorId), [contractors, selectedContractorId])

  const recipientType = useMemo((): 'admin' | 'tenant' | 'contractor' => {
    // If a contractor is selected, always treat as contractor (regardless of template slug)
    if (selectedContractorId) return 'contractor'
    if (selectedSlug.includes('contractor')) return 'contractor'
    if (selectedSlug.includes('tenant')) return 'tenant'
    return 'admin'
  }, [selectedSlug, selectedContractorId])

  // Auto-fill recipient email
  useEffect(() => {
    if (recipientType === 'contractor' && selectedContractor) {
      setRecipientEmail(selectedContractor.email)
    } else if (recipientType === 'tenant') {
      setRecipientEmail('')
    } else {
      setRecipientEmail(process.env.NEXT_PUBLIC_ADMIN_EMAIL || '')
    }
  }, [recipientType, selectedContractor])

  // ---------- Parsed preview ----------
  const parsedSubject = useMemo(() => {
    if (!selectedTemplate?.subject) return ''
    return parseTemplate(selectedTemplate.subject, ticket, {
      signature,
      contractor_name: selectedContractor?.name,
      photo_url: photoUrl
    })
  }, [selectedTemplate, ticket, signature, selectedContractor, photoUrl])

  const parsedBody = useMemo(() => {
    if (!selectedTemplate?.content) return ''
    return parseTemplate(selectedTemplate.content, ticket, {
      signature,
      contractor_name: selectedContractor?.name,
      photo_url: photoUrl
    })
  }, [selectedTemplate, ticket, signature, selectedContractor, photoUrl])

  // ---------- Validation ----------
  const isValidEmail = EMAIL_REGEX.test(recipientEmail)
  const isContractorMode = recipientType === 'contractor'
  const hasContractor = isContractorMode && !!selectedContractor
  const missingContractor = isContractorMode && !selectedContractor
  const canSend = isValidEmail && !!parsedBody && !!parsedSubject && (!isContractorMode || hasContractor)

  // Build validation issues list
  const validationIssues: string[] = []
  if (isContractorMode && !selectedContractor) validationIssues.push('Kein Handwerker ausgewählt')
  if (!recipientEmail) validationIssues.push('E-Mail-Adresse fehlt')
  else if (!isValidEmail) validationIssues.push('Ungültige E-Mail-Adresse')
  if (!parsedBody) validationIssues.push('Kein Nachrichtentext vorhanden')

  // ---------- Send ----------
  const handleSend = async () => {
    if (!canSend) return
    setIsSending(true)
    try {
      // Generate HTML based on recipient type
      let htmlBody: string | undefined
      if (recipientType === 'contractor' && contractorAssignmentTemplate.generateHtml) {
        const htmlResult = contractorAssignmentTemplate.generateHtml(ticket, allPhotoUrls, orgName)
        htmlBody = htmlResult.html
      } else if (recipientType === 'tenant' && tenantConfirmationTemplate.generateHtml) {
        const htmlResult = tenantConfirmationTemplate.generateHtml(ticket, undefined, orgName)
        htmlBody = htmlResult.html
      }

      await onSend({
        recipient_type: recipientType,
        recipient_email: recipientEmail,
        subject: parsedSubject,
        body: parsedBody,
        html_body: htmlBody,
        template_type: selectedSlug,
        contractor_id: selectedContractor?.id,
        contractor_name: selectedContractor?.name,
        org_name: orgName,
      })
    } finally {
      setIsSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#151921] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">

        {/* ── Header ── */}
        <div className="p-5 pb-0 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <Mail className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                {isContractorMode ? 'Auftrag senden' : 'E-Mail senden'}
              </h2>
              <p className="text-xs text-slate-400">Ticket #{ticket.ticket_code || ticket.id?.substring(0, 8)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* ── Data Validation Bar ── */}
        <div className="mx-5 mt-4 mb-0 shrink-0">
          {canSend ? (
            <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/40 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="flex-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                  Empfänger: {selectedContractor?.name || recipientEmail.split('@')[0]}
                </span>
                <span className="text-emerald-600 dark:text-emerald-500">
                  <Mail className="w-3 h-3 inline mr-1" />
                  {recipientEmail}
                </span>
                {isContractorMode && selectedContractor?.trade && (
                  <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase rounded">
                    {selectedContractor.trade}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/40 rounded-xl">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
              <div className="flex-1 text-xs text-red-600 dark:text-red-400 font-medium">
                {validationIssues.join(' · ')}
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 pt-4 space-y-5">
            {/* Template Picker */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vorlage</label>
              <div className="relative">
                <select
                  value={selectedSlug}
                  onChange={e => { setSelectedSlug(e.target.value); setSelectedContractorId('') }}
                  className="w-full appearance-none bg-slate-50 dark:bg-[#0F1116] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-500 outline-none transition-all pr-10"
                >
                  {templates.filter(t => !t.slug.includes('sms')).map(t => (
                    <option key={t.slug} value={t.slug}>{t.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Contractor Picker (only for contractor templates) */}
            {isContractorMode && contractors.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <Wrench className="w-3 h-3" /> Handwerker auswählen
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {contractors.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedContractorId(c.id)}
                      className={`text-left p-3 rounded-xl border transition-all ${selectedContractorId === c.id
                        ? 'border-slate-500 bg-slate-100 dark:bg-slate-800 ring-2 ring-slate-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[9px] font-bold uppercase rounded">{c.trade}</span>
                        <span className="text-sm font-bold">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {c.email}</span>
                        {c.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {c.phone}</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recipient Email (hidden when contractor is selected, shown for manual override) */}
            {(!isContractorMode || !selectedContractor) && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Empfänger E-Mail</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={e => setRecipientEmail(e.target.value)}
                  className={`w-full bg-slate-50 dark:bg-[#0F1116] border rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-slate-500 outline-none transition-all ${recipientEmail && !isValidEmail
                    ? 'border-red-300 dark:border-red-800'
                    : 'border-slate-200 dark:border-slate-800'
                    }`}
                  placeholder="empfaenger@beispiel.de"
                />
              </div>
            )}

            {/* Preview */}
            <div className="space-y-3 bg-slate-50 dark:bg-[#0F1116] rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vorschau</span>
                {isContractorMode && selectedContractor && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {selectedContractor.name}
                  </span>
                )}
              </div>

              {parsedSubject && (
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-200 dark:border-slate-700">
                  {parsedSubject}
                </div>
              )}

              <div className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400 font-sans leading-relaxed max-h-64 overflow-y-auto custom-scrollbar">
                {parsedBody ? renderBodyWithLinks(parsedBody) : 'Bitte wählen Sie eine Vorlage aus.'}
              </div>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          {/* Left: validation hint when issues exist */}
          <div className="flex-1 min-w-0">
            {!canSend && validationIssues.length > 0 && !isLoading && (
              <p className="text-[11px] text-red-500 dark:text-red-400 font-medium truncate flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {validationIssues[0]}
              </p>
            )}
          </div>

          {/* Right: buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Abbrechen
            </button>

            {canSend ? (
              <button
                onClick={handleSend}
                disabled={isSending}
                className="bg-slate-900 hover:bg-slate-800 focus:ring-slate-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Senden…</>
                ) : (
                  <><Send className="w-4 h-4" /> Jetzt senden</>
                )}
              </button>
            ) : (
              <div className="bg-red-100 dark:bg-red-900/20 text-red-500 dark:text-red-400 font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 text-sm cursor-not-allowed">
                <ShieldAlert className="w-4 h-4" /> Daten unvollständig
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
