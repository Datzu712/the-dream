'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/contexts/auth-context';

const formSchema = z
    .object({
        name: z.string().min(2, {
            message: 'El nombre debe tener al menos 2 caracteres.',
        }),
        email: z.string().email({
            message: 'Por favor ingrese un correo electrónico válido.',
        }),
        password: z.string().min(6, {
            message: 'La contraseña debe tener al menos 6 caracteres.',
        }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

export function SignupForm() {
    const { register } = useAuth();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);

        try {
            const result = await register(
                values.name,
                values.email,
                values.password,
            );
            if (result.success) {
                router.push('/dashboard');
            } else {
                setError(result.message || 'Error al registrarse');
            }
        } catch (error) {
            console.error(error);
            setError(
                'Ocurrió un error inesperado. Por favor, inténtelo de nuevo.',
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
                <CardDescription>
                    Regístrese para acceder a todas las funciones
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            className="h-4 w-4 mr-2"
                        />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Juan Peña"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo Electrónico</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="juan@meddyg.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirmar Contraseña</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Registrando...' : 'Registrarse'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <div className="text-sm text-center w-full">
                    ¿Ya tiene una cuenta?{' '}
                    <Link
                        href="/login"
                        className="text-primary hover:underline"
                    >
                        Iniciar Sesión
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
