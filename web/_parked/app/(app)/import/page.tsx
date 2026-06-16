import AuthGuard from '@/components/AuthGuard'
import ImportWizard from '@/components/admin/ImportWizard'

export default function ImportPage() {
  return (
    <AuthGuard requireOrganization={true}>
      <ImportWizard />
    </AuthGuard>
  )
}