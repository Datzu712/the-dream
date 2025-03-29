import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardShell } from '@/components/dashboard-shell';
import { CabinTable } from '@/components/cabin-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function CabinsPage() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Cabañas"
                description="Administre sus cabañas disponibles para alquiler."
            >
                <Button asChild>
                    <Link href="/dashboard/cabins/new">
                        <FontAwesomeIcon
                            icon={faPlusCircle}
                            className="mr-2 h-4 w-4"
                        />
                        Nueva Cabaña
                    </Link>
                </Button>
            </DashboardHeader>
            <CabinTable />
        </DashboardShell>
    );
}
