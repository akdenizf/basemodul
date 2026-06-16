"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Edit3, Loader2, User, Phone, Mail, MapPin, Building, Home, CheckCircle, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Tenant } from '@/lib/types';

// Props interface
interface EditTenantDialogProps {
    tenant: Tenant;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTenantUpdated?: () => void;
}

// Zod Schema for Form Validation
const tenantSchema = z.object({
    firstName: z.string().min(1, "Vorname ist erforderlich"),
    lastName: z.string().min(1, "Nachname ist erforderlich"),
    phone: z.string()
        .min(1, "Telefonnummer ist erforderlich")
        .regex(/^[\d\s\+\-\(\)]+$/, "Ungültige Telefonnummer"),
    email: z.string().email("Ungültige E-Mail-Adresse").optional().or(z.literal('')),
    street: z.string().optional(),
    houseNumber: z.string().optional(),
    zip: z.string().optional(),
    city: z.string().optional(),
    unit: z.string().optional(),
});

type TenantFormData = z.infer<typeof tenantSchema>;

export default function EditTenantDialog({ tenant, open, onOpenChange, onTenantUpdated }: EditTenantDialogProps) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<TenantFormData>({
        resolver: zodResolver(tenantSchema),
    });

    // Pre-fill form when tenant changes
    useEffect(() => {
        if (tenant && open) {
            // Name: prefer the discrete SoT columns (v17), fall back to splitting `name`.
            const nameParts = (tenant.name ?? '').trim().split(/\s+/);
            const firstName = tenant.first_name || nameParts[0] || '';
            const lastName = tenant.last_name || nameParts.slice(1).join(' ') || '';

            // Address: discrete columns are the SoT (v19). Only fall back to
            // parsing the legacy `address` string when ALL discrete fields are
            // empty (e.g. a row that predates the migration backfill).
            let street = tenant.street || '';
            let houseNumber = tenant.house_number || '';
            let zip = tenant.zip || '';
            let city = tenant.city || '';

            if (!street && !houseNumber && !zip && !city && tenant.address) {
                const parts = tenant.address.split(',').map(p => p.trim());
                const zipCityMatch = parts[0]?.match(/^(\d{5})\s+(.+)$/);
                if (zipCityMatch) {
                    zip = zipCityMatch[1];
                    city = zipCityMatch[2];
                } else if (parts[0]) {
                    city = parts[0];
                }
                if (parts[1]) {
                    const streetMatch = parts[1].match(/^(.+?)\s+(\d+[a-zA-Z]?)$/);
                    if (streetMatch) {
                        street = streetMatch[1];
                        houseNumber = streetMatch[2];
                    } else {
                        street = parts[1];
                    }
                }
            }

            // Use reset() instead of setValue() to properly initialize the form
            reset({
                firstName,
                lastName,
                phone: tenant.phone || '',
                email: tenant.email || '',
                street,
                houseNumber,
                zip,
                city,
                unit: tenant.unit || '',
            });
        }
    }, [tenant, open, reset]);


    const onSubmit = async (data: TenantFormData) => {
        setIsSubmitting(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert('Nicht angemeldet. Bitte Seite neu laden.');
                setIsSubmitting(false);
                return;
            }

            // Call server-side API
            const response = await fetch('/api/tenants/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    id: tenant.id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
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
                console.error('[EditTenantDialog] API error:', result);
                alert(`Fehler beim Aktualisieren: ${result.error || 'Unbekannter Fehler'}`);
                return;
            }

            console.log('[EditTenantDialog] Tenant updated:', result.tenant?.id);

            // Success handling
            onOpenChange(false);
            setShowSuccess(true);

            if (onTenantUpdated) {
                onTenantUpdated();
            }

            router.refresh();
        } catch (err) {
            console.error('[EditTenantDialog] Error:', err);
            alert('Ein Fehler ist aufgetreten');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert('Nicht angemeldet. Bitte Seite neu laden.');
                setIsDeleting(false);
                return;
            }

            const response = await fetch(`/api/tenants/delete?id=${tenant.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('[EditTenantDialog] Delete error:', result);
                alert(`Fehler beim Löschen: ${result.error || 'Unbekannter Fehler'}`);
                return;
            }

            console.log('[EditTenantDialog] Tenant deleted:', tenant.id);

            // Close dialog and refresh
            onOpenChange(false);

            if (onTenantUpdated) {
                onTenantUpdated();
            }

            router.refresh();
        } catch (err) {
            console.error('[EditTenantDialog] Delete error:', err);
            alert('Ein Fehler ist aufgetreten');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-800">
                    <DialogHeader className="px-6 py-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <Edit3 className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                            </div>
                            <DialogTitle className="text-xl">Mieter bearbeiten</DialogTitle>
                        </div>
                        <DialogDescription className="text-slate-500 dark:text-slate-400 ml-12">
                            Aktualisieren Sie die Daten von {tenant.name}.
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
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="phone"
                                            {...register('phone')}
                                            placeholder="+49 170 1234567"
                                            disabled={isSubmitting}
                                            className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-colors"
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
                                            {...register('email')}
                                            placeholder="max@beispiel.de"
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
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="street">Straße</Label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
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
                                        placeholder="42"
                                        disabled={isSubmitting}
                                        className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="zip">PLZ</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="zip"
                                            {...register('zip')}
                                            placeholder="80331"
                                            disabled={isSubmitting}
                                            className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                                        />
                                    </div>
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
                                <div className="relative">
                                    <Home className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="unit"
                                        {...register('unit')}
                                        placeholder="1. OG links"
                                        disabled={isSubmitting}
                                        className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                            {/* Delete Button (Left) */}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button
                                        type="button"
                                        disabled={isDeleting || isSubmitting}
                                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Trash2 size={16} />
                                        <span>Mieter löschen</span>
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-800">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Mieter wirklich löschen?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
                                            Diese Aktion kann nicht rückgängig gemacht werden. Der Mieter &quot;{tenant.name}&quot; wird permanent aus der Datenbank entfernt.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">
                                            Abbrechen
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            {isDeleting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Wird gelöscht...
                                                </>
                                            ) : (
                                                'Löschen'
                                            )}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            {/* Save Button (Right) */}
                            <button
                                type="submit"
                                disabled={isSubmitting || isDeleting}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Wird gespeichert...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Speichern</span>
                                    </>
                                )}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Success Dialog */}
            <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                <DialogContent className="sm:max-w-md bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col items-center justify-center py-6 space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                Mieter erfolgreich aktualisiert!
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Die Änderungen wurden in der Datenbank gespeichert und sind nun in der Übersicht verfügbar.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors"
                        >
                            OK, verstanden
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
