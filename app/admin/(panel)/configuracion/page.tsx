import AdminHeader from '@/components/admin/AdminHeader'
import ConfigForm from './ConfigForm'

export const dynamic = 'force-dynamic'

export default function ConfiguracionPage() {
  return (
    <div>
      <AdminHeader title="Configuración" subtitle="Ajustes generales de la tienda" />
      <ConfigForm />
    </div>
  )
}
