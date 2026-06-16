"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Loader2, User, Phone, Mail, MapPin, Building, Home, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Props interface
interface CreateTenantDialogProps {
    orgSlug?: string; // No longer required — server handles slug lookup
    onTenantCreated?: () => void;
}

// Country dialling codes for the phone prefix selector. DACH market —
// Germany is the default. The local part is typed without the leading 0.
const COUNTRY_CODES = [
    { code: '+49', flag: '🇩🇪', label: 'Deutschland' },
    { code: '+43', flag: '🇦🇹', label: 'Österreich' },
    { code: '+41', flag: '🇨🇭', label: 'Schweiz' },
] as const;

const DEFAULT_PHONE_PREFIX = '+49';

// Combine a dialling-code prefix with a locally-typed number into E.164.
// Strips non-digits and any leading zero(s) so "0170 12345" → "+49170 12345" → "+4917012345".
function buildPhoneE164(prefix: string, local: string): string {
    const digits = local.replace(/\D/g, '').replace(/^0+/, '');
    return digits ? `${prefix}${digits}` : '';
}

// Zod Schema for Form Validation
const tenantSchema = z.object({
    firstName: z.string().min(1, "Vorname ist erforderlich"),
    lastName: z.string().min(1, "Nachname ist erforderlich"),
    // phone holds only the LOCAL part — the country code is selected separately.
    phone: z.string()
        .min(1, "Telefonnummer ist erforderlich")
        .regex(/^[\d\s\-()]+$/, "Bitte nur Ziffern eingeben (ohne Vorwahl)")
        .refine(v => v.replace(/\D/g, '').replace(/^0+/, '').length >= 5, "Telefonnummer zu kurz"),
    email: z.string().email("Ungültige E-Mail-Adresse").optional().or(z.literal('')),
    street: z.string().optional(),
    houseNumber: z.string().optional(),
    zip: z.string().optional(),
    city: z.string().optional(),
    unit: z.string().optional(),
});

type TenantFormData = z.infer<typeof tenantSchema>;

export default function CreateTenantDialog({ onTenantCreated }: CreateTenantDialogProps) {
    const [open, setOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [phonePrefix, setPhonePrefix] = useState<string>(DEFAULT_PHONE_PREFIX);
    const router = useRouter();
    const supabase = createClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TenantFormData>({
        resolver: zodResolver(tenantSchema),
    });

    const onSubmit = async (data: TenantFormData) => {
        setIsSubmitting(true);
        try {
            // Get session token for the API call
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert('Nicht angemeldet. Bitte Seite neu laden.');
                setIsSubmitting(false);
                return;
            }

            // Call server-side API — all validation, formatting, and insert happen server-side
            const response = await fetch('/api/tenants/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: buildPhoneE164(phonePrefix, data.phone),
                    email: data.email || '',
                    street: data.street || '',
                    houseNumber: data.houseNumber || '',
                    zip: data.zip || '',
                    city: data.city || '',
                    unit: data.unit || '',
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('[CreateTenantDialog] API error:', result);
                alert(`Fehler beim Anlegen: ${result.error || 'Unbekannter Fehler'}`);
                return;
            }

            console.log('[CreateTenantDialog] Tenant created:', result.tenant?.id);

            // Success handling
            setOpen(false);
            setShowSuccess(true);
            reset();
            setPhonePrefix(DEFAULT_PHONE_PREFIX);

            if (onTenantCreated) {
                onTenantCreated();
            }

            router.refresh();
        } catch (err) {
            console.error('[CreateTenantDialog] Error:', err);
            alert('Ein Fehler ist aufgetreten');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus size={18} />
                        <span>Mieter manuell anlegen</span>
                    </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-800">
                    <DialogHeader className="px-6 py-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <Plus className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                            </div>
                            <DialogTitle className="text-xl">Neuen Mieter erfassen</DialogTitle>
                        </div>
                        <DialogDescription className="text-slate-500 dark:text-slate-400 ml-12">
                            Fügen Sie einen Mieter manuell hinzu, wenn kein Import gewünscht ist.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-400" />
                                Persönliche Daten
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Vorname *</Label>
                                    <Input
                                        id="firstName"
                                        {...register('firstName')}
                                        placeholder="Max"
                                        disabled={isSubmitting}
                                        className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                                    />
                                    {errors.firstName && (
                                        <p className="text-xs text-red-500">{errors.firstName.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Nachname *</Label>
                                    <Input
                                        id="lastName"
                                        {...register('lastName')}
                                        placeholder="Mustermann"
                                        disabled={isSubmitting}
                                        className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                                    />
                                    {errors.lastName && (
                                        <p className="text-xs text-red-500">{errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-slate-800" />

                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                <Phone className="w-4 h-4 text-slate-400" />
                                Kontakt
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefonnummer *</Label>
                                    <div className="flex gap-2">
                                        <select
                                            value={phonePrefix}
                                            onChange={(e) => setPhonePrefix(e.target.value)}
                                            disabled={isSubmitting}
                                            aria-label="Ländervorwahl"
                                            className="shrink-0 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-2 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 transition-colors outline-none cursor-pointer"
                                        >
                                            {COUNTRY_CODES.map((c) => (
                                                <option key={c.code} value={c.code}>
                                                    {c.flag} {c.code}
                                                </option>
                                            ))}
                                        </select>
                                        <Input
                                            id="phone"
                                            {...register('phone')}
                                            placeholder="170 1234567"
                                            inputMode="tel"
                                            disabled={isSubmitting}
                                            className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="text-xs text-red-500">{errors.phone.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">E-Mail</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            {...register('email')}
                                            placeholder="max@example.com"
                                            disabled={isSubmitting}
                                            className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs text-red-500">{errors.email.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-slate-800" />

                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                Objektadresse
                            </h4>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-3 space-y-2">
                                    <Label htmlFor="street">Straße</Label>
                                    <div className="relative">
                                        <Home className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="street"
                                            {...register('street')}
                                            placeholder="Musterstraße"
                                            disabled={isSubmitting}
                                            className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="houseNumber">Nr.</Label>
                                    <Input
                                        id="houseNumber"
                                        {...register('houseNumber')}
                                        placeholder="1"
                                        disabled={isSubmitting}
                                        className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="zip">PLZ</Label>
                                    <Input
                                        id="zip"
                                        {...register('zip')}
                                        placeholder="80331"
                                        disabled={isSubmitting}
                                        className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                                    />
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="city">Stadt</Label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="city"
                                            {...register('city')}
                                            placeholder="München"
                                            disabled={isSubmitting}
                                            className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="unit">Wohneinheit</Label>
                                <Input
                                    id="unit"
                                    {...register('unit')}
                                    placeholder="z.B. 1. OG, Whg. 05"
                                    disabled={isSubmitting}
                                    className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent"
                            >
                                Abbrechen
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isSubmitting ? 'Wird gespeichert...' : 'Mieter anlegen'}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Success Dialog */}
            <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                <DialogContent className="sm:max-w-md p-6 bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-800 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 py-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                        </div>
                        <DialogTitle className="text-2xl font-semibold text-slate-900 dark:text-white">
                            Mieter erfolgreich angelegt!
                        </DialogTitle>
                        <DialogDescription className="text-center text-slate-500 dark:text-slate-400">
                            Der neue Mieter wurde erfolgreich in der Datenbank gespeichert und ist nun in der Übersicht verfügbar.
                        </DialogDescription>
                    </div>
                    <DialogFooter className="sm:justify-center">
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="px-8 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
                        >
                            OK, verstanden
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
