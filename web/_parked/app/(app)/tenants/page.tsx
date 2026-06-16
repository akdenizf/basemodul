"use client";

import AuthGuard from '@/components/AuthGuard';
import TenantList from '@/components/tenants/TenantList';

export default function TenantsPage() {
    return (
        <AuthGuard>
            <div className="flex h-full bg-transparent">
                <TenantList />
            </div>
        </AuthGuard>
    );
}
