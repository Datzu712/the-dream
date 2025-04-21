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
import { useGetCabins } from '@/hooks/api/cabin/useGetCabins';
import { useDeleteCabin } from '@/hooks/api/cabin/useDeleteCabin';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Cabin } from '@/types/models';

export function CabinTable() {
    const { data: cabins, isLoading, error, refetch } = useGetCabins();
    const { mutate: deleteCabin, isPending: isDeleting } = useDeleteCabin();
    const { toast } = useToast();

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
            deleteCabin(cabinToDelete, {
                onSuccess: () => {
                    toast({
                        title: 'Cabaña eliminada',
                        description:
                            'La cabaña ha sido eliminada exitosamente.',
                    });
                    setOpenDeleteDialog(false);
                    setCabinToDelete(null);
                    refetch();
                },
                onError: (error) => {
                    toast({
                        title: 'Error',
                        description: 'No se pudo eliminar la cabaña.',
                        variant: 'destructive',
                    });
                },
            });
        }
    };

    const viewImages = (images: string[]) => {
        setSelectedCabinImages(images);
        setOpenImagesDialog(true);
    };

    // Estado de carga
    if (isLoading) {
        return (
            <div className="rounded-md border">
                <div className="p-4">
                    <Skeleton className="h-8 w-64 mb-4" />
                    <div className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Estado de error
    if (error) {
        return (
            <div className="rounded-md border p-4">
                <div className="text-red-500">
                    Error al cargar las cabañas. Por favor, intente nuevamente.
                </div>
            </div>
        );
    }

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
                        {cabins &&
                            cabins.map((cabin: Cabin) => (
                                <TableRow key={cabin.id}>
                                    <TableCell className="font-medium">
                                        {cabin.name}
                                    </TableCell>
                                    <TableCell>
                                        {cabin.capacity} personas
                                    </TableCell>
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
                                                viewImages(
                                                    cabin.images?.map(
                                                        (img) => img.imageUrl,
                                                    ) || [],
                                                )
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
                                            {cabin.images
                                                ? cabin.images.length
                                                : 0}
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
                                                        handleDelete(
                                                            cabin.id.toString(),
                                                        )
                                                    }
                                                    disabled={isDeleting}
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
                        {selectedCabinImages.map((src, index) => (
                            <div
                                key={index}
                                className="relative aspect-video rounded-md overflow-hidden"
                            >
                                <Image
                                    src={src}
                                    alt={`Imagen ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
