'use client';

import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarDay,
    faUser,
    faHouseChimney,
    faDollarSign,
    faInfoCircle,
    faArrowLeft,
    faPrint,
    faEnvelope,
    faCheck,
    faBan,
    faEdit,
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';
import { type Booking, mockBookings } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export function BookingDetails({ id }: { id: string }) {
    const [booking, setBooking] = useState<Booking | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Simulamos una carga de datos
        const loadBooking = async () => {
            setIsLoading(true);
            try {
                // Simulamos un retraso de red
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const foundBooking = mockBookings.find((b) => b.id === id);
                setBooking(foundBooking || null);
            } catch (error) {
                console.error('Error al cargar la reserva:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadBooking();
    }, [id]);

    const handleStatusChange = (
        newStatus: 'Confirmada' | 'Pendiente' | 'Cancelada',
    ) => {
        if (booking) {
            setBooking({ ...booking, status: newStatus });
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-40 mb-2" />
                    <Skeleton className="h-4 w-60" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!booking) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Reserva no encontrada</CardTitle>
                    <CardDescription>
                        No se ha encontrado la reserva con el ID especificado.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button variant="outline" onClick={() => router.back()}>
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            className="mr-2 h-4 w-4"
                        />
                        Volver
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle className="text-2xl">
                            Reserva #{booking.id}
                        </CardTitle>
                        <CardDescription>
                            Creada el{' '}
                            {format(
                                parseISO(booking.startDate),
                                "dd 'de' MMMM 'de' yyyy",
                                { locale: es },
                            )}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge
                            className={cn(
                                'text-sm py-1.5 px-3',
                                booking.status === 'Confirmada'
                                    ? 'bg-green-500'
                                    : booking.status === 'Pendiente'
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500',
                            )}
                        >
                            {booking.status}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium flex items-center">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="mr-2 h-4 w-4 text-muted-foreground"
                                />
                                Información del Cliente
                            </h3>
                            <Separator />
                            <div className="space-y-1">
                                <p className="font-medium">
                                    {booking.customerName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {booking.customerEmail}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {booking.customerPhone}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-medium flex items-center">
                                <FontAwesomeIcon
                                    icon={faCalendarDay}
                                    className="mr-2 h-4 w-4 text-muted-foreground"
                                />
                                Detalles de la Estancia
                            </h3>
                            <Separator />
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <p className="text-sm">Check-in:</p>
                                    <p className="text-sm font-medium">
                                        {format(
                                            parseISO(booking.startDate),
                                            'dd/MM/yyyy',
                                        )}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm">Check-out:</p>
                                    <p className="text-sm font-medium">
                                        {format(
                                            parseISO(booking.endDate),
                                            'dd/MM/yyyy',
                                        )}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm">Duración:</p>
                                    <p className="text-sm font-medium">
                                        {booking.nights}{' '}
                                        {booking.nights === 1
                                            ? 'noche'
                                            : 'noches'}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm">Huéspedes:</p>
                                    <p className="text-sm font-medium">
                                        {booking.guests}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium flex items-center">
                                <FontAwesomeIcon
                                    icon={faHouseChimney}
                                    className="mr-2 h-4 w-4 text-muted-foreground"
                                />
                                Información de la Cabaña
                            </h3>
                            <Separator />
                            <div className="space-y-1">
                                <p className="font-medium">
                                    {booking.cabinName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    ID: {booking.cabinId}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-medium flex items-center">
                                <FontAwesomeIcon
                                    icon={faDollarSign}
                                    className="mr-2 h-4 w-4 text-muted-foreground"
                                />
                                Información de Pago
                            </h3>
                            <Separator />
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <p className="text-sm">Total:</p>
                                    <p className="text-sm font-medium">
                                        ${booking.totalAmount}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm">Método:</p>
                                    <p className="text-sm font-medium">
                                        {booking.paymentMethod}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm">Estado:</p>
                                    <p className="text-sm font-medium">
                                        {booking.paymentStatus}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {booking.observations && (
                    <div className="mt-6 space-y-2">
                        <h3 className="text-lg font-medium flex items-center">
                            <FontAwesomeIcon
                                icon={faInfoCircle}
                                className="mr-2 h-4 w-4 text-muted-foreground"
                            />
                            Observaciones
                        </h3>
                        <Separator />
                        <p className="text-sm">{booking.observations}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => router.back()}>
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="mr-2 h-4 w-4"
                    />
                    Volver
                </Button>
                <Button variant="outline">
                    <FontAwesomeIcon icon={faPrint} className="mr-2 h-4 w-4" />
                    Imprimir
                </Button>
                <Button variant="outline">
                    <FontAwesomeIcon
                        icon={faEnvelope}
                        className="mr-2 h-4 w-4"
                    />
                    Enviar por Email
                </Button>
                <div className="flex-1"></div>
                {booking.status === 'Pendiente' && (
                    <Button
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusChange('Confirmada')}
                    >
                        <FontAwesomeIcon
                            icon={faCheck}
                            className="mr-2 h-4 w-4"
                        />
                        Confirmar
                    </Button>
                )}
                {booking.status !== 'Cancelada' && (
                    <Button
                        variant="destructive"
                        onClick={() => handleStatusChange('Cancelada')}
                    >
                        <FontAwesomeIcon
                            icon={faBan}
                            className="mr-2 h-4 w-4"
                        />
                        Cancelar
                    </Button>
                )}
                <Button variant="default">
                    <FontAwesomeIcon icon={faEdit} className="mr-2 h-4 w-4" />
                    Editar
                </Button>
            </CardFooter>
        </Card>
    );
}
