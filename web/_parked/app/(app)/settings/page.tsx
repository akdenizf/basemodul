'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import AuthGuard from '@/components/AuthGuard'
import {
  Building, Phone, Save, User, LogOut, ArrowLeft, Mail,
  Wrench, MessageSquare, FileText, PlusCircle, Trash2,
  Edit2, CheckCircle2, AlertCircle, Zap, Eye, Code2, Upload, X, ImageIcon
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { parseTemplate, TEMPLATE_VARIABLES } from '@/lib/utils/template-parser'

// ============================================================
// CALLFOLIO v7.0 – SETTINGS (Dynamic Templates & Contractors)
// ============================================================

const supabase = createClient()

type TabType = 'organization' | 'communication' | 'contractors'

interface Organization {
  id: string
  name: string
  slug: string
  vapi_phone_id: string | null
  notification_email: string | null
  logo_url: string | null
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

// Mock ticket for live preview
const MOCK_TICKET = {
  id: '00000000-0000-0000-0000-000000000000',
  ticket_code: 'TK-00042',
  caller_name: 'Max Mustermann',
  caller_phone: '+4917612345678',
  issue_summary: 'Heizung funktioniert nicht',
  issue_details: 'Seit gestern Abend keine Wärme mehr.',
  address: 'Musterstraße 12',
  unit: 'EG links',
  category: 'HEATING',
  urgency: 'HIGH',
  created_at: new Date().toISOString(),
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('organization')

  // Data
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([])
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [senderSignature, setSenderSignature] = useState('')

  // Org form
  const [organizationName, setOrganizationName] = useState('')
  const [vapiPhoneId, setVapiPhoneId] = useState('')
  const [notificationEmail, setNotificationEmail] = useState('')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoUploading, setLogoUploading] = useState(false)

  // Template editor
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [editSubject, setEditSubject] = useState('')
  const [editContent, setEditContent] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  // Contractor form
  const [isContractorFormOpen, setIsContractorFormOpen] = useState(false)
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null)
  const [contractorName, setContractorName] = useState('')
  const [contractorEmail, setContractorEmail] = useState('')
  const [contractorPhone, setContractorPhone] = useState('')
  const [contractorTrade, setContractorTrade] = useState('')

  // UI state
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Danger Zone (Account löschen)
  const [isDangerModalOpen, setIsDangerModalOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  // ---------- DATA LOADING ----------
  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const headers = { 'Authorization': `Bearer ${session.access_token}` }

      const [orgRes, extraRes, templatesRes, contRes] = await Promise.all([
        fetch('/api/settings/get-organization', { headers }),
        fetch('/api/settings/org-extra', { headers }),
        fetch('/api/communication-templates', { headers }),
        fetch('/api/contractors', { headers }),
      ])

      if (orgRes.ok) {
        const { organization: org } = await orgRes.json()
        setOrganization(org)
        setOrganizationName(org.name || '')
        setVapiPhoneId(org.vapi_phone_id || '')
        setNotificationEmail(org.notification_email || '')
        setLogoUrl(org.logo_url || null)
      }
      if (extraRes.ok) {
        const { settings } = await extraRes.json()
        setSenderSignature(settings?.sender_signature || '')
      }
      if (templatesRes.ok) {
        const { templates: t } = await templatesRes.json()
        setTemplates(t || [])
      }
      if (contRes.ok) {
        const { contractors: c } = await contRes.json()
        setContractors(c || [])
      }
    } catch (err: any) {
      console.error('Error loading settings:', err)
      setError('Fehler beim Laden der Einstellungen')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // Clear success/error after 4s
  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => { setSuccess(''); setError('') }, 4000)
      return () => clearTimeout(t)
    }
  }, [success, error])

  // ---------- ORG SAVE ----------
  const handleOrgSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(''); setSuccess('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` }

      const [res1, res2] = await Promise.all([
        fetch('/api/settings/update-organization', {
          method: 'PUT', headers,
          body: JSON.stringify({
            name: organizationName.trim(),
            vapi_phone_id: vapiPhoneId.trim() || null,
            notification_email: notificationEmail.trim() || null,
            logo_url: logoUrl,
          }),
        }),
        fetch('/api/settings/org-extra', {
          method: 'PATCH', headers,
          body: JSON.stringify({ sender_signature: senderSignature }),
        }),
      ])

      if (res1.ok && res2.ok) {
        setSuccess('Organisationseinstellungen gespeichert')
        loadData()
      } else {
        setError('Fehler beim Speichern')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  // ---------- TEMPLATE SAVE ----------
  const handleTemplateSave = async () => {
    if (!editingSlug) return
    setIsSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const res = await fetch('/api/communication-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ slug: editingSlug, subject: editSubject, content: editContent }),
      })
      if (res.ok) {
        setSuccess('Vorlage gespeichert')
        setEditingSlug(null)
        loadData()
      } else {
        setError('Fehler beim Speichern der Vorlage')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  // ---------- CONTRACTOR CRUD ----------
  const handleContractorSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` }
      const method = editingContractor ? 'PUT' : 'POST'
      const res = await fetch('/api/contractors', {
        method, headers,
        body: JSON.stringify({
          id: editingContractor?.id,
          name: contractorName,
          email: contractorEmail,
          phone: contractorPhone,
          trade: contractorTrade,
        }),
      })
      if (res.ok) {
        setSuccess(editingContractor ? 'Handwerker aktualisiert' : 'Handwerker hinzugefügt')
        resetContractorForm()
        loadData()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteContractor = async (id: string) => {
    if (!confirm('Handwerker wirklich löschen?')) return
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const res = await fetch(`/api/contractors?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      })
      if (res.ok) { setSuccess('Handwerker gelöscht'); loadData() }
    } catch (err: any) {
      setError(err.message)
    }
  }

  const resetContractorForm = () => {
    setIsContractorFormOpen(false)
    setEditingContractor(null)
    setContractorName(''); setContractorEmail(''); setContractorPhone(''); setContractorTrade('')
  }

  // ---------- TEMPLATE HELPERS ----------
  const openTemplateEditor = (t: CommunicationTemplate) => {
    setEditingSlug(t.slug)
    setEditSubject(t.subject)
    setEditContent(t.content)
    setShowPreview(false)
  }

  const previewText = useMemo(() => {
    if (!editContent) return ''
    return parseTemplate(editContent, MOCK_TICKET as any, { signature: senderSignature })
  }, [editContent, senderSignature])

  const previewSubject = useMemo(() => {
    if (!editSubject) return ''
    return parseTemplate(editSubject, MOCK_TICKET as any, { signature: senderSignature })
  }, [editSubject, senderSignature])

  const slugIcon = (slug: string) => {
    if (slug.includes('tenant')) return <User className="w-4 h-4" />
    if (slug.includes('contractor')) return <Wrench className="w-4 h-4" />
    if (slug.includes('sms')) return <MessageSquare className="w-4 h-4" />
    return <Mail className="w-4 h-4" />
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  // ---------- DANGER ZONE: Account löschen ----------
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'LÖSCHEN') return
    setIsDeletingAccount(true)
    setError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Sitzung abgelaufen. Bitte erneut einloggen.')
        return
      }
      const res = await fetch('/api/user/delete', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Löschen fehlgeschlagen')
      }
      // Sign out locally and redirect (auth user is already gone server-side)
      await supabase.auth.signOut()
      window.location.href = '/login?deleted=1'
    } catch (err: any) {
      setError(err.message || 'Konto konnte nicht gelöscht werden')
      setIsDeletingAccount(false)
    }
  }

  const closeDangerModal = () => {
    if (isDeletingAccount) return
    setIsDangerModalOpen(false)
    setDeleteConfirmText('')
  }

  // ---------- RENDER ----------
  if (isLoading) {
    return (
      <AuthGuard requireOrganization={true}>
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900" />
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requireOrganization={true}>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-500" />
              </Link>
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">Einstellungen</h1>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-[14px] font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100">
              <LogOut className="w-4 h-4" />
              <span>Abmelden</span>
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-10">
          {/* Status Messages */}
          {error && (
            <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="font-bold text-[14px]">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-8 p-5 bg-[#19e66f]/10 border border-[#19e66f]/20 rounded-2xl text-[#12b355] flex items-center gap-3 animate-in fade-in slide-in-from-top-2 text-[14px] shadow-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p className="font-bold">{success}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-1.5 mb-10 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-fit shadow-inner">
            {[
              { key: 'organization' as TabType, label: 'Organisation', icon: <Building className="w-4 h-4" /> },
              { key: 'communication' as TabType, label: 'Kommunikation', icon: <MessageSquare className="w-4 h-4" /> },
              { key: 'contractors' as TabType, label: 'Handwerker', icon: <Wrench className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all ${activeTab === tab.key
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* ================================================================ */}
          {/* 1. ORGANISATION TAB                                               */}
          {/* ================================================================ */}
          {activeTab === 'organization' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-10 border-b border-slate-100">
                <h2 className="font-display text-2xl font-bold text-slate-900">Unternehmensprofil</h2>
                <p className="text-slate-500 text-[15px] font-medium mt-2">Verwalten Sie Ihre Firmendaten und Integrationen.</p>
              </div>
              <form onSubmit={handleOrgSave} className="p-10 space-y-10">
                {/* Logo Upload Section */}
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Firmenlogo</label>
                  <div className="flex items-center gap-8">
                    {/* Preview */}
                    <div className="relative group">
                      {logoUrl ? (
                        <div className="w-28 h-28 rounded-2xl border border-slate-200 overflow-hidden bg-white flex items-center justify-center shadow-sm">
                          <Image src={logoUrl} alt="Logo" width={112} height={112} unoptimized className="w-full h-full object-contain p-3" />
                        </div>
                      ) : (
                        <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50">
                          <ImageIcon className="w-8 h-8 text-slate-300" />
                        </div>
                      )}
                    </div>
                    {/* Upload controls */}
                    <div className="flex flex-col gap-3">
                      <label className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold cursor-pointer transition-all border ${logoUploading ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200 shadow-sm'
                        }`}>
                        <Upload className="w-4 h-4" />
                        {logoUploading ? 'Hochladen…' : (logoUrl ? 'Logo ändern' : 'Logo hochladen')}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/svg+xml,image/webp"
                          className="hidden"
                          disabled={logoUploading}
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (!file || !organization?.id) return
                            setLogoUploading(true)
                            try {
                              const ext = (file.name.split('.').pop() || 'png').replace(/[^a-zA-Z0-9]/g, '')
                              const path = `${organization.id}/logo.${ext}`
                              const { error: uploadErr } = await supabase.storage
                                .from('logos')
                                .upload(path, file, { upsert: true, contentType: file.type })
                              if (uploadErr) throw uploadErr
                              const { data: urlData } = supabase.storage
                                .from('logos')
                                .getPublicUrl(path)
                              const newUrl = urlData.publicUrl + '?t=' + Date.now()
                              setLogoUrl(newUrl)
                              setSuccess('Logo hochgeladen!')
                            } catch (err: any) {
                              console.error('Logo upload error:', err)
                              setError('Logo konnte nicht hochgeladen werden: ' + (err.message || 'Unbekannter Fehler'))
                            } finally {
                              setLogoUploading(false)
                            }
                          }}
                        />
                      </label>
                      {logoUrl && (
                        <button
                          type="button"
                          onClick={() => { setLogoUrl(null); setSuccess('Logo wird beim Speichern entfernt.') }}
                          className="inline-flex items-center gap-1.5 text-[12px] font-bold text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" /> Entfernen
                        </button>
                      )}
                      <p className="text-[11px] text-slate-400 font-medium">PNG, JPG, SVG oder WebP. Max 2 MB.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Hausverwaltung Name</label>
                    <input type="text" value={organizationName} onChange={e => setOrganizationName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-[15px] focus:ring-2 focus:ring-[#19e66f]/30 focus:border-[#19e66f] outline-none transition-all font-bold text-slate-900 shadow-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Ticket-Benachrichtigung E-Mail</label>
                    <input type="email" value={notificationEmail} onChange={e => setNotificationEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-[15px] focus:ring-2 focus:ring-[#19e66f]/30 focus:border-[#19e66f] outline-none transition-all font-bold text-slate-900 shadow-sm" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">E-Mail Signatur</label>
                  <textarea
                    value={senderSignature}
                    onChange={e => setSenderSignature(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-[15px] focus:ring-2 focus:ring-[#19e66f]/30 focus:border-[#19e66f] outline-none transition-all font-medium text-slate-900 shadow-sm h-32 resize-none"
                    placeholder="Mit freundlichen Grüßen…"
                  />
                  <p className="text-[12px] text-slate-500 font-medium mt-2">Wird unten an jede E-Mail angehängt. Verwende <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md font-bold">{'{{signature}}'}</code> in deinen Vorlagen.</p>
                </div>

                <div className="pt-10 border-t border-slate-100">
                  <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-2.5 mb-6">
                    <Zap className="w-5 h-5 text-amber-500" /> KI-Telefonie (Vapi)
                  </h3>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Vapi Phone ID</label>
                    <input type="text" value={vapiPhoneId} onChange={e => setVapiPhoneId(e.target.value)}
                      className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-[15px] focus:ring-2 focus:ring-[#19e66f]/30 focus:border-[#19e66f] outline-none transition-all font-mono font-bold text-slate-900 shadow-sm"
                      placeholder="12345678-abcd…" />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-100">
                  <button type="submit" disabled={isSaving}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl shadow-sm transition-all flex items-center gap-2.5 disabled:opacity-50">
                    <Save className="w-5 h-5" />
                    {isSaving ? 'Speichern…' : 'Änderungen speichern'}
                  </button>
                </div>
              </form>
            </div>

            {/* ── DANGER ZONE ─────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm overflow-hidden">
              <div className="p-10 border-b border-red-100 bg-red-50/40">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-red-700">Danger Zone</h2>
                </div>
                <p className="text-red-600/80 text-[15px] font-medium mt-2">Aktionen in diesem Bereich sind unwiderruflich.</p>
              </div>
              <div className="p-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-xl">
                  <h3 className="text-[16px] font-bold text-slate-900 mb-2">Konto löschen</h3>
                  <p className="text-[14px] font-medium text-slate-500 leading-relaxed">
                    Löscht Ihre Organisation, alle Tickets, Mieter, Handwerker, Vorlagen und den Login-Account permanent. Diese Aktion kann nicht rückgängig gemacht werden.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDangerModalOpen(true)}
                  className="shrink-0 inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-7 rounded-xl shadow-sm transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Konto löschen
                </button>
              </div>
            </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 2. KOMMUNIKATION TAB                                             */}
          {/* ================================================================ */}
          {activeTab === 'communication' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {editingSlug ? (
                /* ---- TEMPLATE EDITOR ---- */
                <div className="flex gap-8">
                  {/* Editor panel */}
                  <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button onClick={() => setEditingSlug(null)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200">
                          <ArrowLeft className="w-5 h-5 text-slate-500" />
                        </button>
                        <h2 className="font-display text-xl font-bold text-slate-900">{templates.find(t => t.slug === editingSlug)?.label || editingSlug}</h2>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setShowPreview(!showPreview)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${showPreview
                            ? 'bg-slate-100 text-slate-900 border border-slate-200'
                            : 'bg-slate-50 text-slate-500 hover:text-slate-900 border border-slate-100 hover:border-slate-200'
                            }`}>
                          <Eye className="w-4 h-4" /> {showPreview ? 'Editor' : 'Vorschau'}
                        </button>
                        <button onClick={handleTemplateSave} disabled={isSaving}
                          className="bg-[#19e66f] text-[#0f1714] px-6 py-2 rounded-xl text-[13px] font-bold hover:bg-[#15cf63] transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm">
                          <Save className="w-4 h-4" /> {isSaving ? 'Speichern…' : 'Speichern'}
                        </button>
                      </div>
                    </div>

                    <div className="p-8 space-y-6">
                      {/* Subject (only for email templates) */}
                      {!editingSlug.includes('sms') && (
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Betreff</label>
                          {showPreview ? (
                            <div className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-[14px] font-bold text-slate-900">{previewSubject}</div>
                          ) : (
                            <input type="text" value={editSubject} onChange={e => setEditSubject(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-[#19e66f]/30 focus:border-[#19e66f] outline-none transition-all shadow-sm" />
                          )}
                        </div>
                      )}

                      {/* Body */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                          {editingSlug.includes('sms') ? 'SMS-Text' : 'Nachricht'}
                        </label>
                        {showPreview ? (
                          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 min-h-[320px]">
                            <pre className="whitespace-pre-wrap text-[14px] text-slate-700 font-sans leading-relaxed">{previewText}</pre>
                          </div>
                        ) : (
                          <textarea
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 min-h-[320px] text-[14px] text-slate-900 leading-relaxed resize-none focus:ring-2 focus:ring-[#19e66f]/30 focus:border-[#19e66f] outline-none transition-all font-mono shadow-sm"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Variable reference sidebar */}
                  <div className="w-72 shrink-0">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-28">
                      <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
                        <Code2 className="w-4 h-4" /> Verfügbare Variablen
                      </h3>
                      <div className="space-y-3">
                        {TEMPLATE_VARIABLES.map(v => (
                          <button
                            key={v.key}
                            type="button"
                            onClick={() => {
                              if (!showPreview) setEditContent(c => c + `{{${v.key}}}`)
                            }}
                            className="w-full text-left group"
                          >
                            <div className="flex items-center justify-between">
                              <code className="text-[12px] font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md group-hover:bg-slate-100 transition-colors">
                                {`{{${v.key}}}`}
                              </code>
                            </div>
                            <p className="text-[11px] font-medium text-slate-500 mt-1.5 leading-snug">{v.label}</p>
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-6 leading-snug font-medium">Klicke auf eine Variable, um sie einzufügen.</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* ---- TEMPLATE LIST ---- */
                <div className="bg-white rounded-2xl border border-slate-200 p-10 shadow-sm">
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Vorlagen-Manager</h2>
                  <p className="text-slate-500 text-[15px] font-medium mb-10">Passen Sie die automatisierten Nachrichten für verschiedene Empfänger an.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {templates.map(t => (
                      <button
                        key={t.slug}
                        onClick={() => openTemplateEditor(t)}
                        className="text-left p-6 rounded-2xl border border-slate-200 hover:border-[#19e66f]/50 hover:shadow-md transition-all duration-300 group bg-white"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-2.5 bg-slate-50 rounded-xl text-slate-700 border border-slate-100 group-hover:bg-slate-100 transition-colors">
                            {slugIcon(t.slug)}
                          </div>
                          <h3 className="font-bold text-[15px] text-slate-900">{t.label}</h3>
                        </div>
                        {t.subject && (
                          <p className="text-[13px] font-bold text-slate-600 mb-2 truncate">{t.subject}</p>
                        )}
                        <p className="text-[13px] text-slate-500 line-clamp-3 leading-relaxed">{t.content.substring(0, 120)}…</p>
                        <span className="inline-flex items-center gap-1.5 mt-4 text-[11px] font-bold text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-widest">
                          <Edit2 className="w-3.5 h-3.5" /> Bearbeiten
                        </span>
                      </button>
                    ))}

                    {templates.length === 0 && (
                      <div className="col-span-full py-16 text-center text-slate-400 text-sm">
                        <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p>Keine Vorlagen gefunden. Bitte führen Sie die Migration aus.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* 3. HANDWERKER TAB                                                */}
          {/* ================================================================ */}
          {activeTab === 'contractors' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-white rounded-2xl border border-slate-200 p-10 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-slate-900">Dienstleister-Netzwerk</h2>
                    <p className="text-slate-500 text-[15px] font-medium mt-2">Hinterlegen Sie Partnerfirmen für eine schnelle Beauftragung.</p>
                  </div>
                  <button onClick={() => { resetContractorForm(); setIsContractorFormOpen(true) }}
                    className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-[14px] font-bold transition-all shadow-sm">
                    <PlusCircle className="w-5 h-5" /> Partner hinzufügen
                  </button>
                </div>

                {/* Form */}
                {isContractorFormOpen && (
                  <div className="mb-10 p-8 bg-slate-50 rounded-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
                    <form onSubmit={handleContractorSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input placeholder="Firma / Name" value={contractorName} onChange={e => setContractorName(e.target.value)} required
                        className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-[14px] font-medium outline-none focus:ring-2 focus:ring-[#19e66f]/30 focus:border-[#19e66f] shadow-sm" />
                      <input placeholder="E-Mail" type="email" value={contractorEmail} onChange={e => setContractorEmail(e.target.value)} required
                        className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-[14px] font-medium outline-none focus:ring-2 focus:ring-[#19e66f]/30 focus:border-[#19e66f] shadow-sm" />
                      <input placeholder="Telefon (optional)" type="tel" value={contractorPhone} onChange={e => setContractorPhone(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-[14px] font-medium outline-none focus:ring-2 focus:ring-[#19e66f]/30 focus:border-[#19e66f] shadow-sm" />
                      <select value={contractorTrade} onChange={e => setContractorTrade(e.target.value)} required
                        className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-[14px] font-medium outline-none focus:ring-2 focus:ring-[#19e66f]/30 focus:border-[#19e66f] shadow-sm">
                        <option value="">Gewerk wählen…</option>
                        <option value="Sanitär/Heizung">Sanitär/Heizung</option>
                        <option value="Elektro">Elektro</option>
                        <option value="Dach/Fassade">Dach/Fassade</option>
                        <option value="Tischler">Tischler</option>
                        <option value="Schlüsseldienst">Schlüsseldienst</option>
                        <option value="Gartenpflege">Gartenpflege</option>
                        <option value="Sonstiges">Sonstiges</option>
                      </select>
                      <div className="md:col-span-2 flex justify-end gap-3 mt-4 border-t border-slate-200 pt-6">
                        <button type="button" onClick={resetContractorForm} className="px-6 py-3 rounded-xl text-[14px] font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">Abbrechen</button>
                        <button type="submit" disabled={isSaving}
                          className="bg-slate-900 text-white px-8 py-3 rounded-xl text-[14px] font-bold hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50">
                          {isSaving ? 'Speichern…' : (editingContractor ? 'Aktualisieren' : 'Hinzufügen')}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-slate-200 bg-slate-50/50">
                        <th className="pb-4 pt-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400 rounded-tl-xl">Gewerk</th>
                        <th className="pb-4 pt-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Name</th>
                        <th className="pb-4 pt-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400">E-Mail</th>
                        <th className="pb-4 pt-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Telefon</th>
                        <th className="pb-4 pt-4 px-4 text-right rounded-tr-xl" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {contractors.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-16 text-center text-slate-400 text-[14px] font-medium italic">Keine Handwerker hinterlegt.</td>
                        </tr>
                      ) : (
                        contractors.map(c => (
                          <tr key={c.id} className="group hover:bg-slate-50 transition-colors">
                            <td className="py-5 px-4">
                              <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold uppercase tracking-widest border border-slate-200">
                                {c.trade}
                              </span>
                            </td>
                            <td className="py-5 px-4 font-bold text-[15px] tracking-tight text-slate-900">{c.name}</td>
                            <td className="py-5 px-4 text-[14px] text-slate-500 font-medium">{c.email}</td>
                            <td className="py-5 px-4 text-[14px] text-slate-500 font-mono font-medium">{c.phone || '—'}</td>
                            <td className="py-5 px-4 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => {
                                    setEditingContractor(c)
                                    setContractorName(c.name)
                                    setContractorEmail(c.email)
                                    setContractorPhone(c.phone || '')
                                    setContractorTrade(c.trade)
                                    setIsContractorFormOpen(true)
                                  }}
                                  className="p-2.5 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors shadow-sm"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteContractor(c.id)}
                                  className="p-2.5 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors shadow-sm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ── DANGER ZONE: Konto löschen Modal ─────────────────── */}
        {isDangerModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={closeDangerModal}
          >
            <div
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-10 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-6">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">Konto endgültig löschen?</h2>
              <p className="text-[14px] font-medium text-slate-500 leading-relaxed mb-6">
                Folgende Daten werden <span className="font-bold text-slate-700">permanent entfernt</span>:
              </p>
              <ul className="text-[13px] font-medium text-slate-600 space-y-2 mb-8 bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <li className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Organisation & Vapi-Verknüpfung</li>
                <li className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Alle Tickets & Aktivitäten</li>
                <li className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Alle Mieter & Handwerker</li>
                <li className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> E-Mail-Vorlagen & Einstellungen</li>
                <li className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Login-Account & Zugangsdaten</li>
              </ul>
              <div className="space-y-3 mb-8">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Tippen Sie <code className="bg-slate-100 text-red-600 px-1.5 py-0.5 rounded-md font-bold">LÖSCHEN</code> zur Bestätigung
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  disabled={isDeletingAccount}
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-[15px] focus:ring-2 focus:ring-red-500/30 focus:border-red-500 outline-none transition-all font-mono font-bold text-slate-900 shadow-sm disabled:opacity-50"
                  placeholder="LÖSCHEN"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeDangerModal}
                  disabled={isDeletingAccount}
                  className="px-6 py-3 rounded-xl text-[14px] font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-50"
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'LÖSCHEN' || isDeletingAccount}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeletingAccount ? 'Lösche…' : 'Endgültig löschen'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
