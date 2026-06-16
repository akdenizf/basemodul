'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, Loader2, ArrowLeft, Download } from 'lucide-react';
import Papa from 'papaparse';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

// Types
interface ImportRow {
  name: string;
  address: string;
  unit: string;
  tenant_id: string;
  phone?: string;
  email?: string;
  notes?: string;
}

interface PreviewRow {
  rowIndex: number;
  status: 'VALID_NEW' | 'VALID_UPDATE' | 'CONFLICT' | 'ERROR';
  normalized?: any;
  reason?: string;
  issues?: string[];
}

interface PreviewResponse {
  validRows: Array<{
    rowIndex: number;
    status: 'VALID_NEW' | 'VALID_UPDATE';
    normalized: any;
    reason?: string;
  }>;
  conflicts: Array<{
    rowIndex: number;
    reason: string;
    details: any;
  }>;
  errors: Array<{
    rowIndex: number;
    field: string;
    reason: string;
  }>;
  stats: {
    total: number;
    valid: number;
    conflict: number;
    error: number;
  };
}

interface CommitResponse {
  inserted?: number;
  updated?: number;
  stats?: {
    total: number;
  };
  error?: string;
  details?: any[];
}

// State machine states
type WizardState = 'IDLE' | 'PREVIEWING' | 'READY' | 'COMMITTING' | 'SUCCESS' | 'ERROR';

// tenant_id is auto-stamped server-side from the logged-in user's organization.
// Customers only need to provide their tenant data as-is from their property management system.
const REQUIRED_HEADERS = ['name', 'address', 'unit', 'phone', 'email', 'notes'];

export default function ImportWizard() {
  const router = useRouter();
  const [state, setState] = useState<WizardState>('IDLE');
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ImportRow[]>([]);
  const [previewData, setPreviewData] = useState<PreviewResponse | null>(null);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [commitResult, setCommitResult] = useState<CommitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset wizard state
  const resetWizard = useCallback(() => {
    setState('IDLE');
    setFile(null);
    setParsedRows([]);
    setPreviewData(null);
    setPreviewRows([]);
    setCommitResult(null);
    setError(null);
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((uploadedFile: File) => {
    if (!uploadedFile.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setFile(uploadedFile);
    setState('PREVIEWING');
    setError(null);

    // Parse CSV with Papa Parse
    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const headers = results.meta.fields || [];

          // Check for required headers
          const missingHeaders = REQUIRED_HEADERS.filter(
            header => !headers.includes(header)
          );

          if (missingHeaders.length > 0) {
            setError(
              `Missing required CSV headers: ${missingHeaders.join(', ')}. ` +
              `Required headers: ${REQUIRED_HEADERS.join(', ')}`
            );
            setState('ERROR');
            return;
          }

          // Extract only required columns and clean data
          // Note: tenant_id is NOT extracted from CSV - it is auto-stamped server-side
          // from the logged-in user's organization for security.
          const cleanedRows: ImportRow[] = results.data.map((row: any) => ({
            name: row.name || '',
            address: row.address || '',
            unit: row.unit || '',
            tenant_id: '', // Will be auto-stamped server-side from session
            phone: row.phone || undefined,
            email: row.email || undefined,
            notes: row.notes || undefined,
          }));

          setParsedRows(cleanedRows);

          // Get the current session token for API authentication
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();

          if (!session) {
            throw new Error('Keine aktive Session gefunden. Bitte melden Sie sich erneut an.');
          }

          // Call preview API with Authorization header
          const response = await fetch('/api/admin/import/preview', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ rows: cleanedRows }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
          }

          const previewResponse: PreviewResponse = await response.json();
          setPreviewData(previewResponse);

          // Convert to unified preview rows format
          const unifiedRows: PreviewRow[] = [];

          // Add valid rows
          previewResponse.validRows.forEach(row => {
            unifiedRows.push({
              rowIndex: row.rowIndex,
              status: row.status,
              normalized: row.normalized,
              reason: row.reason,
              issues: [],
            });
          });

          // Add conflict rows
          previewResponse.conflicts.forEach(conflict => {
            unifiedRows.push({
              rowIndex: conflict.rowIndex,
              status: 'CONFLICT',
              reason: conflict.reason,
              issues: [conflict.reason],
            });
          });

          // Add error rows
          const errorsByRow = new Map<number, string[]>();
          previewResponse.errors.forEach(error => {
            const existing = errorsByRow.get(error.rowIndex) || [];
            existing.push(error.reason);
            errorsByRow.set(error.rowIndex, existing);
          });

          errorsByRow.forEach((issues, rowIndex) => {
            unifiedRows.push({
              rowIndex,
              status: 'ERROR',
              issues,
            });
          });

          // Sort by row index
          unifiedRows.sort((a, b) => a.rowIndex - b.rowIndex);
          setPreviewRows(unifiedRows);

          setState('READY');
        } catch (err: any) {
          console.error('Preview error:', err);
          setError(err.message || 'Failed to preview CSV data');
          setState('ERROR');
        }
      },
      error: (err) => {
        console.error('CSV parse error:', err);
        setError('Failed to parse CSV file. Please check the file format.');
        setState('ERROR');
      },
    });
  }, []);

  // Handle commit
  const handleCommit = useCallback(async () => {
    if (!parsedRows.length) return;

    setState('COMMITTING');
    setError(null);

    try {
      // Get the current session token for API authentication
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Keine aktive Session gefunden. Bitte melden Sie sich erneut an.');
      }

      const response = await fetch('/api/admin/import/commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ rows: parsedRows }),
      });

      const result: CommitResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      setCommitResult(result);
      setState('SUCCESS');
    } catch (err: any) {
      console.error('Commit error:', err);
      setError(err.message || 'Failed to import data');
      setState('ERROR');
    }
  }, [parsedRows]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileUpload(droppedFile);
    }
  }, [handleFileUpload]);

  // Get status color classes
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VALID_NEW':
      case 'VALID_UPDATE':
        return 'text-green-600 bg-green-50';
      case 'CONFLICT':
        return 'text-yellow-600 bg-yellow-50';
      case 'ERROR':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VALID_NEW':
      case 'VALID_UPDATE':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'CONFLICT':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'ERROR':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-6 overflow-y-auto w-full">
      <div className="max-w-5xl mx-auto">
        {/* Header (Nur Zurück & Titel) */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
            title="Zurück zum Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-[28px] font-bold text-slate-900 tracking-tight">
            Mieter-Import
          </h1>
        </div>

        {/* Step 1: Upload (IDLE) */}
        {state === 'IDLE' && (
          <>
            {/* Karte 1: "1. Daten vorbereiten" */}
            <div className="rounded-[2.5rem] bg-slate-50 p-2 shadow-sm border border-slate-100 mb-6">
              <div className="rounded-[calc(2.5rem-0.5rem)] bg-white p-8 shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
                <h2 className="font-display text-xl font-bold text-slate-900 mb-2">
                  1. Daten vorbereiten
                </h2>
                <p className="text-slate-500 mb-6 text-[15px] font-medium">
                  Stellen Sie sicher, dass Ihre CSV-Datei folgende Spalten in der ersten Zeile enthält:
                </p>
                <div className="mb-6 flex flex-wrap gap-2">
                  {REQUIRED_HEADERS.map((header) => (
                    <span key={header} className="bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-mono border border-slate-200 shadow-sm">
                      {header}
                    </span>
                  ))}
                </div>
                <a href="/muster-mieter.csv" download="Muster_Callfolio_Mieter.csv" className="text-[#12b355] hover:text-[#0e8a42] text-[14px] font-bold flex items-center gap-2 w-max transition-colors">
                  <Download className="w-4 h-4" /> Muster-CSV herunterladen
                </a>
              </div>
            </div>

            {/* Karte 2: "2. Datei hochladen" */}
            <div className="rounded-[2.5rem] bg-slate-50 p-2 shadow-sm border border-slate-100 mb-6">
              <div className="rounded-[calc(2.5rem-0.5rem)] bg-white p-8 shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
                <h2 className="font-display text-xl font-bold text-slate-900 mb-6">
                  2. Datei hochladen
                </h2>
              <div
                className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-[#19e66f] transition-colors bg-slate-50/50 cursor-pointer group"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('csv-upload')?.click()}
              >
                <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-slate-200 mx-auto mb-4 group-hover:border-[#19e66f]/50 group-hover:bg-[#19e66f]/5 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-[#12b355] transition-colors" />
                </div>
                <p className="text-slate-600 mb-6 font-medium">
                  CSV-Datei hier ablegen oder klicken
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      handleFileUpload(selectedFile);
                    }
                  }}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="inline-flex items-center px-6 py-3 bg-[#19e66f] hover:bg-[#15d163] hover:scale-[0.98] text-[#0f1714] font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Datei auswählen
                </label>
              </div>
              </div>
            </div>

            {/* Footer / Beruhigende Info-Box */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-sm text-slate-600">
              <h4 className="font-bold text-slate-900 mb-1">Was passiert nach dem Upload?</h4>
              <p className="font-medium leading-relaxed">
                Ihre Daten werden zunächst vom System geprüft. Sie können fehlerhafte Einträge korrigieren, bevor die Mieter final in Ihre Datenbank übernommen werden. Bei Fragen hilft Ihnen unser Support gerne weiter.
              </p>
            </div>
          </>
        )}

        {state !== 'IDLE' && (
          <div className="rounded-[2.5rem] bg-slate-50 p-2 shadow-sm border border-slate-100 mb-6">
            <div className="rounded-[calc(2.5rem-0.5rem)] bg-white p-8 shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
            {/* Loading state */}
            {state === 'PREVIEWING' && (
              <div className="text-center py-16">
                <Loader2 className="w-10 h-10 animate-spin text-[#19e66f] mx-auto mb-4" />
                <p className="text-slate-600 font-bold tracking-tight">CSV-Daten werden analysiert...</p>
              </div>
            )}

            {/* Step 2: Preview */}
            {state === 'READY' && previewData && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold text-slate-900">
                    Import-Vorschau
                  </h2>
                  <button
                    onClick={resetWizard}
                    className="text-[14px] font-bold text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Andere Datei hochladen
                  </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-center">
                    <div className="font-display text-3xl font-bold text-slate-900">
                      {previewData.stats.total}
                    </div>
                    <div className="text-[12px] font-bold uppercase tracking-widest text-slate-500 mt-1">Zeilen gesamt</div>
                  </div>
                  <div className="bg-[#19e66f]/10 border border-[#19e66f]/20 p-5 rounded-2xl text-center">
                    <div className="font-display text-3xl font-bold text-[#12b355]">
                      {previewData.stats.valid}
                    </div>
                    <div className="text-[12px] font-bold uppercase tracking-widest text-[#12b355] mt-1">Gültig</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl text-center">
                    <div className="font-display text-3xl font-bold text-amber-600">
                      {previewData.stats.conflict}
                    </div>
                    <div className="text-[12px] font-bold uppercase tracking-widest text-amber-600 mt-1">Konflikte</div>
                  </div>
                  <div className="bg-red-50 border border-red-100 p-5 rounded-2xl text-center">
                    <div className="font-display text-3xl font-bold text-red-600">
                      {previewData.stats.error}
                    </div>
                    <div className="text-[12px] font-bold uppercase tracking-widest text-red-600 mt-1">Fehler</div>
                  </div>
                </div>

                {/* Preview Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                    <p className="text-[13px] font-bold text-slate-500">
                      Zeige die ersten 200 Zeilen • Gesamt: {previewData.stats.total} Zeilen
                    </p>
                  </div>
                  <div className="overflow-x-auto max-h-96 overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                        <tr>
                          <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            Zeile
                          </th>
                          <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            Status
                          </th>
                          <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            Name
                          </th>
                          <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            Adresse
                          </th>
                          <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            Telefon
                          </th>
                          <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            Probleme
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {previewRows.slice(0, 200).map((row, index) => {
                          const originalRow = parsedRows[row.rowIndex - 1];
                          return (
                            <tr key={index} className={`transition-colors hover:bg-slate-50/50 ${getStatusColor(row.status)}`}>
                              <td className="px-5 py-3 text-[14px] font-medium text-slate-900">
                                {row.rowIndex}
                              </td>
                              <td className="px-5 py-3">
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(row.status)}
                                  <span className="text-[11px] font-bold uppercase tracking-widest">
                                    {row.status === 'VALID_NEW' && 'NEU'}
                                    {row.status === 'VALID_UPDATE' && 'UPDATE'}
                                    {row.status === 'CONFLICT' && 'KONFLIKT'}
                                    {row.status === 'ERROR' && 'FEHLER'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-[14px] font-medium text-slate-900">
                                {originalRow?.name || '-'}
                              </td>
                              <td className="px-5 py-3 text-[14px] font-medium text-slate-900">
                                {originalRow?.address || '-'}
                              </td>
                              <td className="px-5 py-3 text-[14px] font-medium text-slate-900">
                                {originalRow?.phone || '-'}
                              </td>
                              <td className="px-5 py-3 text-[14px] font-medium text-slate-900">
                                {row.issues && row.issues.length > 0 ? (
                                  <div className="space-y-1">
                                    {row.issues.map((issue, i) => (
                                      <div key={i} className="text-[12px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                                        {issue}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-slate-400">-</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Commit Button */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <div>
                    {(previewData.stats.conflict > 0 || previewData.stats.error > 0) && (
                      <p className="text-[14px] font-bold text-red-600 flex items-center gap-2">
                        <AlertTriangle size={16} /> Bitte beheben Sie Fehler/Konflikte in Ihrer CSV und laden Sie diese erneut hoch.
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleCommit}
                    disabled={previewData.stats.conflict > 0 || previewData.stats.error > 0}
                    className="px-8 py-3.5 bg-[#19e66f] hover:bg-[#15d163] hover:scale-[0.98] text-[#0f1714] font-bold rounded-full transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:scale-100 disabled:cursor-not-allowed shadow-sm"
                  >
                    {previewData.stats.valid} Mieter importieren
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Committing */}
            {state === 'COMMITTING' && (
              <div className="text-center py-16">
                <Loader2 className="w-10 h-10 animate-spin text-[#19e66f] mx-auto mb-4" />
                <p className="text-slate-600 font-bold tracking-tight">Mieterdaten werden importiert...</p>
              </div>
            )}

            {/* Success State */}
            {state === 'SUCCESS' && commitResult && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-[#19e66f]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-[#12b355]" />
                </div>
                <h2 className="font-display text-3xl font-bold text-slate-900 mb-3">
                  Import erfolgreich!
                </h2>
                <p className="text-[15px] font-medium text-slate-500 mb-8 max-w-md mx-auto">
                  Erfolgreich {commitResult.stats?.total} Mieter importiert
                  {commitResult.inserted && ` (${commitResult.inserted} neu)`}
                  {commitResult.updated && ` (${commitResult.updated} aktualisiert)`}
                </p>
                <button
                  onClick={resetWizard}
                  className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full transition-all shadow-sm"
                >
                  Weitere Datei importieren
                </button>
              </div>
            )}

            {/* Error State */}
            {state === 'ERROR' && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="font-display text-3xl font-bold text-slate-900 mb-3">
                  Import fehlgeschlagen
                </h2>
                {error && (
                  <p className="text-[15px] font-bold text-red-600 bg-red-50 p-4 rounded-xl mb-8 max-w-2xl mx-auto border border-red-100">
                    {error}
                  </p>
                )}
                <button
                  onClick={resetWizard}
                  className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full transition-all shadow-sm"
                >
                  Erneut versuchen
                </button>
              </div>
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}