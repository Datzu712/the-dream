import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardShell } from '@/components/dashboard-shell';
import { CabinForm } from '@/components/cabin-form';

export default function NewCabinPage() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Crear Nueva Cabaña"
                description="Añada una nueva cabaña a su inventario."
            />
            <div className="grid gap-8">
                <CabinForm />
            </div>
        </DashboardShell>
    );
}
