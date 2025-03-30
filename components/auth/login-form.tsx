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

const formSchema = z.object({
    email: z.string().email({
        message: 'Por favor ingrese un correo electrónico válido.',
    }),
    password: z.string().min(6, {
        message: 'La contraseña debe tener al menos 6 caracteres.',
    }),
});

export function LoginForm() {
    const { login } = useAuth();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);

        try {
            const result = await login(values.email, values.password);
            if (result.success) {
                router.push('/dashboard');
            } else {
                setError(result.message || 'Error al iniciar sesión');
            }
        } catch (error) {
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
                <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
                <CardDescription>
                    Ingrese sus credenciales para acceder a su cuenta
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo Electrónico</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="correo@ejemplo.com"
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
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? 'Iniciando sesión...'
                                : 'Iniciar Sesión'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
                <div className="text-sm text-center">
                    ¿No tiene una cuenta?{' '}
                    <Link
                        href="/signup"
                        className="text-primary hover:underline"
                    >
                        Regístrese
                    </Link>
                </div>
                <div className="text-sm text-center">
                    <Link
                        href="/forgot-password"
                        className="text-muted-foreground hover:underline"
                    >
                        ¿Olvidó su contraseña?
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
