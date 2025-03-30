import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardShell } from '@/components/dashboard-shell';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarDays,
    faChartLine,
    faHouseChimney,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';

export default function DashboardPage() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Panel de Control"
                description="Resumen general del mes actual."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Ingresos Totales
                        </CardTitle>
                        <FontAwesomeIcon
                            icon={faChartLine}
                            className="h-4 w-4 text-muted-foreground"
                        />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% desde el mes pasado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Reservas
                        </CardTitle>
                        <FontAwesomeIcon
                            icon={faCalendarDays}
                            className="h-4 w-4 text-muted-foreground"
                        />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">
                            +180.1% desde el mes pasado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Cabañas
                        </CardTitle>
                        <FontAwesomeIcon
                            icon={faHouseChimney}
                            className="h-4 w-4 text-muted-foreground"
                        />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">
                            +2 desde el mes pasado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Clientes
                        </CardTitle>
                        <FontAwesomeIcon
                            icon={faUsers}
                            className="h-4 w-4 text-muted-foreground"
                        />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">
                            +201 desde el mes pasado
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Reservas Recientes</CardTitle>
                        <CardDescription>
                            Hay 12 reservas este mes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="flex items-center"
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {booking.customerName}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {booking.cabinName} •{' '}
                                            {booking.dates}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        {booking.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Ocupación por Cabaña</CardTitle>
                        <CardDescription>
                            Tasa de ocupación para este mes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {cabinOccupancy.map((cabin) => (
                                <div key={cabin.id} className="space-y-2">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium">
                                            {cabin.name}
                                        </span>
                                        <span className="ml-auto text-sm text-muted-foreground">
                                            {cabin.occupancy}%
                                        </span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                        <div
                                            className="h-full bg-primary"
                                            style={{
                                                width: `${cabin.occupancy}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    );
}

const recentBookings = [
    {
        id: '1',
        customerName: 'Carlos Rodríguez',
        cabinName: 'Cabaña Pino',
        dates: '12 Mar - 15 Mar',
        amount: '$350',
    },
    {
        id: '2',
        customerName: 'María González',
        cabinName: 'Cabaña Lago',
        dates: '15 Mar - 20 Mar',
        amount: '$750',
    },
    {
        id: '3',
        customerName: 'Juan Pérez',
        cabinName: 'Cabaña Montaña',
        dates: '18 Mar - 22 Mar',
        amount: '$580',
    },
    {
        id: '4',
        customerName: 'Ana Martínez',
        cabinName: 'Cabaña Bosque',
        dates: '22 Mar - 25 Mar',
        amount: '$420',
    },
];

const cabinOccupancy = [
    {
        id: '1',
        name: 'Cabaña Pino',
        occupancy: 85,
    },
    {
        id: '2',
        name: 'Cabaña Lago',
        occupancy: 75,
    },
    {
        id: '3',
        name: 'Cabaña Montaña',
        occupancy: 92,
    },
    {
        id: '4',
        name: 'Cabaña Bosque',
        occupancy: 62,
    },
];
