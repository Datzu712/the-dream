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
    images: z.array(z.any()).optional(),
});

const amenitiesList = [
    { id: 'chimenea', label: 'Chimenea' },
    { id: 'jacuzzi', label: 'Jacuzzi' },
    { id: 'wifi', label: 'WiFi' },
    { id: 'cocina', label: 'Cocina equipada' },
    { id: 'terraza', label: 'Terraza' },
    { id: 'parrilla', label: 'Parrilla' },
    { id: 'estacionamiento', label: 'Estacionamiento' },
    { id: 'sauna', label: 'Sauna' },
];

export function CabinForm({ id }: { id?: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [dragActive, setDragActive] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            capacity: 1,
            price: 0,
            status: 'Disponible',
            location: '',
            description: '',
            amenities: [],
            images: [],
        },
    });

    useEffect(() => {
        if (id) {
            // Simulando la carga de datos de una cabaña existente
            const cabin = cabinData.find((c) => c.id === id);
            if (cabin) {
                form.reset({
                    name: cabin.name,
                    capacity: cabin.capacity,
                    price: cabin.price,
                    status: cabin.status,
                    location: cabin.location,
                    description: cabin.description,
                    amenities: cabin.amenities,
                });

                // Si la cabaña tiene imágenes, las cargamos
                if (cabin.images && cabin.images.length > 0) {
                    setPreviewImages(cabin.images);
                }
            }
        }
    }, [id, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        // Simulando una petición a la API
        setTimeout(() => {
            console.log({ ...values, images: previewImages });
            setIsLoading(false);
            router.push('/dashboard/cabins');
        }, 1000);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            handleFiles(files);
        }
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFiles = (files: FileList) => {
        const newImages: string[] = [];

        Array.from(files).forEach((file) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        newImages.push(e.target.result as string);
                        if (newImages.length === files.length) {
                            setPreviewImages((prev) => [...prev, ...newImages]);
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const removeImage = (index: number) => {
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Cabaña Pino"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Nombre de la cabaña que verán los
                                            clientes.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="capacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Capacidad</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Número máximo de personas.
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
                                                min={0}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Precio por noche en dólares.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                                    <SelectValue placeholder="Seleccione un estado" />
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
                                        <FormDescription>
                                            Estado actual de la cabaña.
                                        </FormDescription>
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
                                                placeholder="Zona Norte"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Área o zona donde se encuentra la
                                            cabaña.
                                        </FormDescription>
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
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Descripción detallada que verán los
                                        clientes.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="images"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Imágenes</FormLabel>
                                    <FormDescription>
                                        Suba imágenes de la cabaña. Puede
                                        arrastrar y soltar o hacer clic para
                                        seleccionar.
                                    </FormDescription>
                                    <div
                                        className={cn(
                                            'mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                                            dragActive
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50',
                                        )}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={() =>
                                            document
                                                .getElementById('cabin-images')
                                                ?.click()
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={faCloudUploadAlt}
                                            className="h-10 w-10 text-muted-foreground mb-2"
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Arrastre y suelte imágenes aquí o
                                            haga clic para seleccionar
                                        </p>
                                        <input
                                            id="cabin-images"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </div>

                                    {previewImages.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {previewImages.map(
                                                (image, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative group"
                                                    >
                                                        <div className="aspect-square rounded-md overflow-hidden border">
                                                            <Image
                                                                src={
                                                                    image ||
                                                                    '/placeholder.svg'
                                                                }
                                                                alt={`Imagen de cabaña ${index + 1}`}
                                                                width={200}
                                                                height={200}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeImage(
                                                                    index,
                                                                )
                                                            }
                                                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faTrash}
                                                                className="h-3 w-3"
                                                            />
                                                        </button>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
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
                                        <FormLabel>Comodidades</FormLabel>
                                        <FormDescription>
                                            Seleccione todas las comodidades
                                            disponibles en la cabaña.
                                        </FormDescription>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                                                                        amenity.label,
                                                                    )}
                                                                    onCheckedChange={(
                                                                        checked,
                                                                    ) => {
                                                                        return checked
                                                                            ? field.onChange(
                                                                                  [
                                                                                      ...(field.value ||
                                                                                          []),
                                                                                      amenity.label,
                                                                                  ],
                                                                              )
                                                                            : field.onChange(
                                                                                  field.value?.filter(
                                                                                      (
                                                                                          value,
                                                                                      ) =>
                                                                                          value !==
                                                                                          amenity.label,
                                                                                  ),
                                                                              );
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                {amenity.label}
                                                            </FormLabel>
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/dashboard/cabins')}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading
                                    ? 'Guardando...'
                                    : id
                                      ? 'Actualizar Cabaña'
                                      : 'Crear Cabaña'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
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
            '/placeholder.svg?height=200&width=200',
            '/placeholder.svg?height=200&width=200',
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
            '/placeholder.svg?height=200&width=200',
            '/placeholder.svg?height=200&width=200',
            '/placeholder.svg?height=200&width=200',
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
        images: ['/placeholder.svg?height=200&width=200'],
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
            '/placeholder.svg?height=200&width=200',
            '/placeholder.svg?height=200&width=200',
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
            '/placeholder.svg?height=200&width=200',
            '/placeholder.svg?height=200&width=200',
            '/placeholder.svg?height=200&width=200',
            '/placeholder.svg?height=200&width=200',
        ],
    },
];
