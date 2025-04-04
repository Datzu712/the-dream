'use client';

import { useState, useEffect } from 'react';
import {
    addMonths,
    subMonths,
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    parseISO,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronLeft,
    faChevronRight,
    faCalendarDay,
    faUser,
    faHouseChimney,
    faDollarSign,
    faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';
import { type Booking, mockBookings } from '@/lib/mock-data';
import { Separator } from '@/components/ui/separator';

export function BookingCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
        null,
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCabin, setSelectedCabin] = useState<string | null>(null);
    const [bookings, setBookings] = useState<Booking[]>(mockBookings);
    const [cabins, setCabins] = useState<{ id: string; name: string }[]>([]);

    // Extraer cabañas únicas de las reservas
    useEffect(() => {
        const uniqueCabins = Array.from(
            new Set(mockBookings.map((booking) => booking.cabinId)),
        ).map((cabinId) => {
            const booking = mockBookings.find((b) => b.cabinId === cabinId);
            return {
                id: cabinId,
                name: booking?.cabinName || 'Cabaña desconocida',
            };
        });
        setCabins(uniqueCabins);
    }, []);

    // Filtrar reservas por cabaña seleccionada
    useEffect(() => {
        if (selectedCabin) {
            setBookings(
                mockBookings.filter(
                    (booking) => booking.cabinId === selectedCabin,
                ),
            );
        } else {
            setBookings(mockBookings);
        }
    }, [selectedCabin]);

    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const prevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const handleBookingClick = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsDialogOpen(true);
    };

    // Generar días del mes actual
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Obtener el día de la semana del primer día del mes (0 = domingo, 1 = lunes, etc.)
    const startDay = monthStart.getDay();

    // Ajustar para que la semana comience en lunes (0 = lunes, 6 = domingo)
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

    // Nombres de los días de la semana
    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    // Función para obtener las reservas de un día específico
    const getBookingsForDay = (day: Date) => {
        return bookings.filter((booking) => {
            const startDate = parseISO(booking.startDate);
            const endDate = parseISO(booking.endDate);
            return day >= startDate && day <= endDate;
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth}>
                        <FontAwesomeIcon
                            icon={faChevronLeft}
                            className="h-4 w-4"
                        />
                    </Button>
                    <h2 className="text-xl font-semibold">
                        {format(currentDate, 'MMMM yyyy', { locale: es })}
                    </h2>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                        <FontAwesomeIcon
                            icon={faChevronRight}
                            className="h-4 w-4"
                        />
                    </Button>
                </div>
                <div className="w-full sm:w-auto">
                    <Select
                        value={selectedCabin || ''}
                        onValueChange={(value) =>
                            setSelectedCabin(value || null)
                        }
                    >
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Todas las cabañas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Todas las cabañas
                            </SelectItem>
                            {cabins.map((cabin) => (
                                <SelectItem key={cabin.id} value={cabin.id}>
                                    {cabin.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card>
                <CardContent className="p-0 overflow-x-auto">
                    <div className="min-w-[768px]">
                        {/* Encabezados de días de la semana */}
                        <div className="grid grid-cols-7 bg-muted">
                            {weekDays.map((day, index) => (
                                <div
                                    key={index}
                                    className="p-2 text-center font-medium"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Cuadrícula del calendario */}
                        <div className="grid grid-cols-7 border-t">
                            {/* Espacios vacíos antes del primer día del mes */}
                            {Array.from({ length: adjustedStartDay }).map(
                                (_, index) => (
                                    <div
                                        key={`empty-start-${index}`}
                                        className="min-h-[120px] p-2 border-b border-r bg-muted/20"
                                    />
                                ),
                            )}

                            {/* Días del mes */}
                            {daysInMonth.map((day, index) => {
                                const dayBookings = getBookingsForDay(day);
                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            'min-h-[120px] p-2 border-b border-r relative',
                                            !isSameMonth(day, currentDate) &&
                                                'bg-muted/20',
                                            isSameDay(day, new Date()) &&
                                                'bg-primary/5',
                                        )}
                                    >
                                        <div className="font-medium text-sm mb-1">
                                            {format(day, 'd')}
                                        </div>
                                        <div className="space-y-1 max-h-[90px] overflow-y-auto">
                                            {dayBookings.map((booking) => (
                                                <div
                                                    key={booking.id}
                                                    onClick={() =>
                                                        handleBookingClick(
                                                            booking,
                                                        )
                                                    }
                                                    className={cn(
                                                        'text-xs p-1 rounded cursor-pointer truncate',
                                                        isSameDay(
                                                            parseISO(
                                                                booking.startDate,
                                                            ),
                                                            day,
                                                        )
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-secondary text-secondary-foreground',
                                                    )}
                                                >
                                                    {booking.customerName} -{' '}
                                                    {booking.cabinName}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Espacios vacíos después del último día del mes */}
                            {Array.from({
                                length:
                                    42 -
                                    (adjustedStartDay + daysInMonth.length),
                            }).map((_, index) => (
                                <div
                                    key={`empty-end-${index}`}
                                    className="min-h-[120px] p-2 border-b border-r bg-muted/20"
                                />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Modal de detalles de reserva */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    {selectedBooking && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-xl">
                                    Detalles de la Reserva
                                </DialogTitle>
                                <DialogDescription>
                                    Información completa de la reserva
                                    seleccionada
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 mt-4">
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className="text-sm py-1 px-3"
                                    >
                                        #{selectedBooking.id}
                                    </Badge>
                                    <Badge
                                        className={cn(
                                            'text-sm py-1 px-3',
                                            selectedBooking.status ===
                                                'Confirmada'
                                                ? 'bg-green-500'
                                                : selectedBooking.status ===
                                                    'Pendiente'
                                                  ? 'bg-yellow-500'
                                                  : 'bg-red-500',
                                        )}
                                    >
                                        {selectedBooking.status}
                                    </Badge>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <FontAwesomeIcon
                                            icon={faCalendarDay}
                                            className="h-4 w-4 mt-1 text-muted-foreground"
                                        />
                                        <div>
                                            <p className="font-medium">
                                                Fechas
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(
                                                    parseISO(
                                                        selectedBooking.startDate,
                                                    ),
                                                    'dd/MM/yyyy',
                                                )}{' '}
                                                -{' '}
                                                {format(
                                                    parseISO(
                                                        selectedBooking.endDate,
                                                    ),
                                                    'dd/MM/yyyy',
                                                )}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedBooking.nights}{' '}
                                                {selectedBooking.nights === 1
                                                    ? 'noche'
                                                    : 'noches'}
                                            </p>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex items-start gap-3">
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="h-4 w-4 mt-1 text-muted-foreground"
                                        />
                                        <div>
                                            <p className="font-medium">
                                                Cliente
                                            </p>
                                            <p className="text-sm">
                                                {selectedBooking.customerName}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedBooking.customerEmail}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedBooking.customerPhone}
                                            </p>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex items-start gap-3">
                                        <FontAwesomeIcon
                                            icon={faHouseChimney}
                                            className="h-4 w-4 mt-1 text-muted-foreground"
                                        />
                                        <div>
                                            <p className="font-medium">
                                                Cabaña
                                            </p>
                                            <p className="text-sm">
                                                {selectedBooking.cabinName}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedBooking.guests}{' '}
                                                {selectedBooking.guests === 1
                                                    ? 'huésped'
                                                    : 'huéspedes'}
                                            </p>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex items-start gap-3">
                                        <FontAwesomeIcon
                                            icon={faDollarSign}
                                            className="h-4 w-4 mt-1 text-muted-foreground"
                                        />
                                        <div>
                                            <p className="font-medium">Pago</p>
                                            <p className="text-sm">
                                                Total: $
                                                {selectedBooking.totalAmount}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Método:{' '}
                                                {selectedBooking.paymentMethod}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Estado:{' '}
                                                {selectedBooking.paymentStatus}
                                            </p>
                                        </div>
                                    </div>

                                    {selectedBooking.observations && (
                                        <>
                                            <Separator />
                                            <div className="flex items-start gap-3">
                                                <FontAwesomeIcon
                                                    icon={faInfoCircle}
                                                    className="h-4 w-4 mt-1 text-muted-foreground"
                                                />
                                                <div>
                                                    <p className="font-medium">
                                                        Observaciones
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {
                                                            selectedBooking.observations
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
