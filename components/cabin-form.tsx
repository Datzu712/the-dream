'use client';

import { cn } from '@/lib/utils';
import type React from 'react';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useGetAmenities } from '@/hooks/api/amenity/useGetAmenities';
import { useCreateCabin } from '@/hooks/api/cabin/useCreateCabin';
import { useUpdateCabin } from '@/hooks/api/cabin/useUpdateCabin';
import { useGetCabin } from '@/hooks/api/cabin/useGetCabin';
import { useUploadCabinImages } from '@/hooks/api/cabin/useUploadCabinImages';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Amenity, Cabin, CabinFormData } from '@/types/models';
import { useAddCabinImageUrl } from '@/hooks/api/cabin/useAddCabinImageUrl';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';

const formSchema = z.object({
    name: z.string().min(2, {
        message: 'El nombre debe tener al menos 2 caracteres.',
    }),
    capacity: z.coerce.number().min(1, {
        message: 'La capacidad debe ser al menos 1 persona.',
    }),
    price: z.coerce.number().min(1, {
        message: 'El precio debe ser mayor a 0.',
    }),
    status: z.string({
        required_error: 'Por favor seleccione un estado.',
    }),
    location: z.string().min(2, {
        message: 'La ubicación debe tener al menos 2 caracteres.',
    }),
    description: z.string().min(10, {
        message: 'La descripción debe tener al menos 10 caracteres.',
    }),
    amenities: z.array(z.string()).optional(),
});

export function CabinForm({ id }: { id?: string }) {
    const router = useRouter();
    const { toast } = useToast();

    // Hooks existentes
    const { data: amenitiesData, isLoading: isLoadingAmenities } =
        useGetAmenities<Amenity[]>();
    const { data: cabinData, isLoading: isLoadingCabin } = useGetCabin(id);
    const { mutate: createCabin, isPending: isCreating } = useCreateCabin();
    const { mutate: updateCabin, isPending: isUpdating } = useUpdateCabin();
    const { mutate: uploadImages, isPending: isUploading } =
        useUploadCabinImages();
    const { mutate: addImageUrl, isPending: isAddingImageUrl } =
        useAddCabinImageUrl();

    // Estado de imágenes
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    // Estado para el diálogo de URL de imagen
    const [urlDialogOpen, setUrlDialogOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [isMainImage, setIsMainImage] = useState(false);

    type FormValues = z.infer<typeof formSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            capacity: 1,
            price: 0,
            status: 'Disponible',
            location: '',
            description: '',
            amenities: [],
        },
    });

    const imageForm = useForm({
        defaultValues: {
            imageUrl: '',
        },
    });

    // Poblar formulario cuando se está editando
    useEffect(() => {
        if (id && cabinData) {
            form.reset({
                name: cabinData.name,
                capacity: cabinData.capacity,
                price: cabinData.price,
                status: cabinData.status,
                location: cabinData.location,
                description: cabinData.description,
                amenities:
                    cabinData.amenities?.map((a) => a.id.toString()) || [],
            });

            // Establecer vistas previas de imágenes si están disponibles
            if (cabinData.images && cabinData.images.length > 0) {
                setPreviewImages(cabinData.images.map((img) => img.imageUrl));
            }
        }
    }, [id, cabinData, form]);

    const handleAddImageUrl = () => {
        if (!imageUrl.trim()) {
            toast({
                title: 'Error',
                description: 'Por favor, ingrese una URL de imagen válida',
                variant: 'destructive',
            });
            return;
        }

        // Si estamos editando una cabaña existente
        if (id) {
            addImageUrl(
                {
                    cabinId: id,
                    imageUrl: imageUrl,
                    isMain: isMainImage,
                },
                {
                    onSuccess: () => {
                        toast({
                            title: 'Imagen agregada',
                            description:
                                'La imagen ha sido agregada exitosamente.',
                        });
                        setUrlDialogOpen(false);
                        setImageUrl('');
                        setIsMainImage(false);
                        // Actualizar la vista previa de imágenes
                        setPreviewImages((prev) => [...prev, imageUrl]);
                    },
                    onError: (error) => {
                        console.error(
                            'Error al agregar imagen por URL:',
                            error,
                        );
                        toast({
                            title: 'Error',
                            description:
                                'No se pudo agregar la imagen. Verifique la URL e intente nuevamente.',
                            variant: 'destructive',
                        });
                    },
                },
            );
        } else {
            // Si es una cabaña nueva, guarda la URL para usarla cuando se cree la cabaña
            setPreviewImages((prev) => [...prev, imageUrl]);
            setUrlDialogOpen(false);
            setImageUrl('');
            setIsMainImage(false);
        }
    };

    const onSubmit = (values: FormValues) => {
        const formData: CabinFormData = {
            name: values.name,
            capacity: values.capacity,
            price: values.price,
            status: values.status,
            location: values.location,
            description: values.description,
            amenities: values.amenities,
        };

        if (id) {
            // Actualizar cabaña existente
            updateCabin(
                {
                    id,
                    data: formData,
                },
                {
                    onSuccess: (updatedCabin) => {
                        let successCount = 0;
                        let totalOperations = 0;

                        // Verificar si hay archivos de imagen para subir
                        if (imageFiles.length > 0) {
                            totalOperations++;
                            // Si hay imágenes, subirlas después de actualizar
                            uploadImages(
                                {
                                    cabinId: id,
                                    files: imageFiles,
                                },
                                {
                                    onSuccess: () => {
                                        successCount++;
                                        if (successCount === totalOperations) {
                                            toast({
                                                title: 'Cabaña actualizada',
                                                description:
                                                    'La cabaña y sus imágenes han sido actualizadas exitosamente.',
                                            });
                                            router.push('/dashboard/cabins');
                                        }
                                    },
                                    onError: (error) => {
                                        console.error(
                                            'Error al subir imágenes:',
                                            error,
                                        );
                                        toast({
                                            title: 'Cabaña actualizada parcialmente',
                                            description:
                                                'La cabaña se actualizó pero hubo un error al subir las imágenes.',
                                            variant: 'destructive',
                                        });
                                    },
                                },
                            );
                        }

                        // Si no hay operaciones pendientes, redirigir inmediatamente
                        if (totalOperations === 0) {
                            toast({
                                title: 'Cabaña actualizada',
                                description:
                                    'La cabaña ha sido actualizada exitosamente.',
                            });
                            router.push('/dashboard/cabins');
                        }
                    },
                    onError: (error) => {
                        console.error('Error al actualizar cabaña:', error);
                        toast({
                            title: 'Error',
                            description: 'No se pudo actualizar la cabaña.',
                            variant: 'destructive',
                        });
                    },
                },
            );
        } else {
            // Crear nueva cabaña
            createCabin(formData, {
                onSuccess: (newCabin) => {
                    let successCount = 0;
                    let totalOperations = 0;

                    // Subir archivos de imagen si los hay
                    if (imageFiles.length > 0) {
                        totalOperations++;
                        uploadImages(
                            {
                                cabinId: newCabin.id.toString(),
                                files: imageFiles,
                            },
                            {
                                onSuccess: () => {
                                    successCount++;
                                    if (successCount === totalOperations) {
                                        toast({
                                            title: 'Cabaña creada',
                                            description:
                                                'La cabaña y sus imágenes han sido creadas exitosamente.',
                                        });
                                        router.push('/dashboard/cabins');
                                    }
                                },
                                onError: (error) => {
                                    console.error(
                                        'Error al subir imágenes:',
                                        error,
                                    );
                                },
                            },
                        );
                    }

                    // Si no hay operaciones pendientes, redirigir inmediatamente
                    if (totalOperations === 0) {
                        toast({
                            title: 'Cabaña creada',
                            description:
                                'La cabaña ha sido creada exitosamente.',
                        });
                        router.push('/dashboard/cabins');
                    }
                },
                onError: (error) => {
                    console.error('Error al crear cabaña:', error);
                    toast({
                        title: 'Error',
                        description: 'No se pudo crear la cabaña.',
                        variant: 'destructive',
                    });
                },
            });
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const fileArray = Array.from(e.target.files);
            const newImagePreviews = fileArray.map((file) =>
                URL.createObjectURL(file),
            );

            setPreviewImages((prev) => [...prev, ...newImagePreviews]);
            setImageFiles((prev) => [...prev, ...fileArray]);
        }
    };

    const removeImage = (index: number) => {
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // Estado de carga
    if (id && isLoadingCabin) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-1/3" />
                        <Skeleton className="h-32 w-full" />

                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>

                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Preparar lista de amenidades
    type AmenityOption = {
        id: string;
        label: string;
    };

    const amenitiesList: AmenityOption[] =
        amenitiesData?.map((amenity) => ({
            id: amenity.id.toString(),
            label: amenity.name,
        })) || [];

    return (
        <Card>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nombre de la cabaña"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="capacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Capacidad</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="4"
                                                min={1}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Número máximo de huéspedes
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Precio por noche</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="150"
                                                min={1}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Precio en dólares
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione el estado" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Disponible">
                                                    Disponible
                                                </SelectItem>
                                                <SelectItem value="Ocupada">
                                                    Ocupada
                                                </SelectItem>
                                                <SelectItem value="Mantenimiento">
                                                    Mantenimiento
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ubicación</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Zona Lago"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describa las características de la cabaña..."
                                            className="min-h-32"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amenities"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel>Amenidades</FormLabel>
                                        <FormDescription>
                                            Seleccione las comodidades
                                            disponibles en la cabaña
                                        </FormDescription>
                                    </div>

                                    {isLoadingAmenities ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            {[1, 2, 3, 4].map((i) => (
                                                <Skeleton
                                                    key={i}
                                                    className="h-10 w-full"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {amenitiesList.map((amenity) => (
                                                <FormField
                                                    key={amenity.id}
                                                    control={form.control}
                                                    name="amenities"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={amenity.id}
                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(
                                                                            amenity.id,
                                                                        )}
                                                                        onCheckedChange={(
                                                                            checked,
                                                                        ) => {
                                                                            return checked
                                                                                ? field.onChange(
                                                                                      [
                                                                                          ...(field.value ||
                                                                                              []),
                                                                                          amenity.id,
                                                                                      ],
                                                                                  )
                                                                                : field.onChange(
                                                                                      field.value?.filter(
                                                                                          (
                                                                                              value,
                                                                                          ) =>
                                                                                              value !==
                                                                                              amenity.id,
                                                                                      ),
                                                                                  );
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                    {
                                                                        amenity.label
                                                                    }
                                                                </FormLabel>
                                                            </FormItem>
                                                        );
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <FormLabel>Imágenes</FormLabel>
                            <FormDescription className="mb-3">
                                Formato JPG o PNG, máximo 5MB por imagen.
                            </FormDescription>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {previewImages.map((src, index) => (
                                        <div
                                            key={index}
                                            className="relative aspect-square rounded-md overflow-hidden border"
                                        >
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 z-10 h-8 w-8"
                                                onClick={() =>
                                                    removeImage(index)
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className="h-4 w-4"
                                                />
                                            </Button>
                                            <Image
                                                src={src}
                                                alt={`Imagen ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                    <label
                                        htmlFor="image-upload"
                                        className="flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed cursor-pointer hover:bg-muted transition-colors"
                                    >
                                        <FontAwesomeIcon
                                            icon={faCloudUploadAlt}
                                            className="h-8 w-8 mb-2 text-muted-foreground"
                                        />
                                        <span className="text-sm text-muted-foreground">
                                            Subir archivos
                                        </span>
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </label>

                                    {/* Nuevo botón para agregar imágenes por URL */}
                                    <div
                                        onClick={() => setUrlDialogOpen(true)}
                                        className="flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed cursor-pointer hover:bg-muted transition-colors"
                                    >
                                        <FontAwesomeIcon
                                            icon={faCloudUploadAlt}
                                            className="h-8 w-8 mb-2 text-muted-foreground"
                                        />
                                        <span className="text-sm text-center text-muted-foreground">
                                            Agregar URL de imagen
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/dashboard/cabins')}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    isCreating ||
                                    isUpdating ||
                                    isUploading ||
                                    isAddingImageUrl
                                }
                            >
                                {isCreating ||
                                isUpdating ||
                                isUploading ||
                                isAddingImageUrl ? (
                                    <>Guardando...</>
                                ) : id ? (
                                    <>Actualizar Cabaña</>
                                ) : (
                                    <>Crear Cabaña</>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>

            {/* Dialog para agregar URL de imagen */}
            <Dialog open={urlDialogOpen} onOpenChange={setUrlDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Agregar imagen por URL</DialogTitle>
                        <DialogDescription>
                            Ingrese la URL de la imagen que desea agregar a la
                            cabaña.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...imageForm}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <FormLabel htmlFor="image-url">
                                    URL de imagen
                                </FormLabel>
                                <Input
                                    id="image-url"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    value={imageUrl}
                                    onChange={(e) =>
                                        setImageUrl(e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is-main"
                                    checked={isMainImage}
                                    onCheckedChange={(checked) =>
                                        setIsMainImage(checked === true)
                                    }
                                />
                                <label
                                    htmlFor="is-main"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Establecer como imagen principal
                                </label>
                            </div>
                        </div>
                    </Form>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setUrlDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleAddImageUrl}
                            disabled={isAddingImageUrl}
                        >
                            {isAddingImageUrl ? 'Agregando...' : 'Agregar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
