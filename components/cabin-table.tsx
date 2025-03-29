'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEdit,
    faEllipsisH,
    faImage,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';

export function CabinTable() {
    const [cabins, setCabins] = useState(cabinData);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [cabinToDelete, setCabinToDelete] = useState<string | null>(null);
    const [openImagesDialog, setOpenImagesDialog] = useState(false);
    const [selectedCabinImages, setSelectedCabinImages] = useState<string[]>(
        [],
    );

    const handleDelete = (id: string) => {
        setCabinToDelete(id);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (cabinToDelete) {
            setCabins(cabins.filter((cabin) => cabin.id !== cabinToDelete));
            setOpenDeleteDialog(false);
            setCabinToDelete(null);
        }
    };

    const viewImages = (images: string[]) => {
        setSelectedCabinImages(images);
        setOpenImagesDialog(true);
    };

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Capacidad</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Ubicación</TableHead>
                            <TableHead>Imágenes</TableHead>
                            <TableHead className="text-right">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cabins.map((cabin) => (
                            <TableRow key={cabin.id}>
                                <TableCell className="font-medium">
                                    {cabin.name}
                                </TableCell>
                                <TableCell>{cabin.capacity} personas</TableCell>
                                <TableCell>${cabin.price}/noche</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            cabin.status === 'Disponible'
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {cabin.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{cabin.location}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            viewImages(cabin.images || [])
                                        }
                                        disabled={
                                            !cabin.images ||
                                            cabin.images.length === 0
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={faImage}
                                            className="mr-2 h-4 w-4"
                                        />
                                        {cabin.images ? cabin.images.length : 0}
                                    </Button>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                            >
                                                <span className="sr-only">
                                                    Abrir menú
                                                </span>
                                                <FontAwesomeIcon
                                                    icon={faEllipsisH}
                                                    className="h-4 w-4"
                                                />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>
                                                Acciones
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={`/dashboard/cabins/${cabin.id}`}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                        className="mr-2 h-4 w-4"
                                                    />
                                                    Editar
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onClick={() =>
                                                    handleDelete(cabin.id)
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className="mr-2 h-4 w-4"
                                                />
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará
                            permanentemente la cabaña de nuestros servidores.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={openImagesDialog} onOpenChange={setOpenImagesDialog}>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Imágenes de la cabaña</DialogTitle>
                        <DialogDescription>
                            Vista previa de todas las imágenes disponibles.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {selectedCabinImages.map((image, index) => (
                            <div
                                key={index}
                                className="aspect-video rounded-md overflow-hidden border"
                            >
                                <Image
                                    src={image || '/placeholder.svg'}
                                    alt={`Imagen de cabaña ${index + 1}`}
                                    width={400}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

const cabinData = [
    {
        id: '1',
        name: 'Cabaña Pino',
        capacity: 4,
        price: 120,
        status: 'Disponible',
        location: 'Zona Norte',
        description: 'Hermosa cabaña rodeada de pinos con vista panorámica.',
        amenities: ['Chimenea', 'Jacuzzi', 'WiFi', 'Cocina equipada'],
        images: [
            '/placeholder.svg?height=400&width=600',
            '/placeholder.svg?height=400&width=600',
        ],
    },
    {
        id: '2',
        name: 'Cabaña Lago',
        capacity: 6,
        price: 180,
        status: 'Disponible',
        location: 'Zona Lago',
        description: 'Cabaña a orillas del lago con acceso directo al agua.',
        amenities: ['Muelle privado', 'Bote', 'Terraza', 'Parrilla'],
        images: [
            '/placeholder.svg?height=400&width=600',
            '/placeholder.svg?height=400&width=600',
            '/placeholder.svg?height=400&width=600',
        ],
    },
    {
        id: '3',
        name: 'Cabaña Montaña',
        capacity: 8,
        price: 220,
        status: 'Ocupada',
        location: 'Zona Alta',
        description:
            'Amplia cabaña en lo alto de la montaña con vistas espectaculares.',
        amenities: [
            'Sauna',
            'Sala de juegos',
            'Terraza panorámica',
            'Estacionamiento',
        ],
        images: ['/placeholder.svg?height=400&width=600'],
    },
    {
        id: '4',
        name: 'Cabaña Bosque',
        capacity: 2,
        price: 90,
        status: 'Mantenimiento',
        location: 'Zona Bosque',
        description: 'Acogedora cabaña para parejas en medio del bosque.',
        amenities: ['Chimenea', 'Bañera', 'Desayuno incluido', 'Senderos'],
        images: [
            '/placeholder.svg?height=400&width=600',
            '/placeholder.svg?height=400&width=600',
        ],
    },
    {
        id: '5',
        name: 'Cabaña Río',
        capacity: 5,
        price: 150,
        status: 'Disponible',
        location: 'Zona Río',
        description: 'Cabaña junto al río con sonidos naturales del agua.',
        amenities: ['Pesca', 'Hamacas', 'Fogata', 'Cocina exterior'],
        images: [
            '/placeholder.svg?height=400&width=600',
            '/placeholder.svg?height=400&width=600',
            '/placeholder.svg?height=400&width=600',
            '/placeholder.svg?height=400&width=600',
        ],
    },
];
