import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardShell } from '@/components/dashboard-shell';
import { CabinForm } from '@/components/cabin-form';

export default function EditCabinPage({ params }: { params: { id: string } }) {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Editar Cabaña"
                description="Modifique los detalles de la cabaña."
            />
            <div className="grid gap-8">
                <CabinForm id={params.id} />
            </div>
        </DashboardShell>
    );
}
