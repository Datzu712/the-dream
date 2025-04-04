import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardShell } from '@/components/dashboard-shell';
import { BookingCalendar } from '@/components/booking-calendar';

export default function BookingsPage() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Reservas"
                description="Visualice y gestione todas las reservas de sus cabañas."
            />
            <div className="mt-6">
                <BookingCalendar />
            </div>
        </DashboardShell>
    );
}
