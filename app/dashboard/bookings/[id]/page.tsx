import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardShell } from '@/components/dashboard-shell';
import { BookingDetails } from '@/components/booking-details';

export default function BookingDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Detalles de Reserva"
                description="Información completa de la reserva seleccionada."
            />
            <div className="mt-6">
                <BookingDetails id={params.id} />
            </div>
        </DashboardShell>
    );
}
