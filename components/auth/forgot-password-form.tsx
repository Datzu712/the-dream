'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import {
    faCheckCircle,
    faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

const formSchema = z.object({
    email: z.string().email({
        message: 'Por favor ingrese un correo electrónico válido.',
    }),
});

export function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Simulamos una petición a la API
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Simulamos una respuesta exitosa
            setSuccess(true);
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
                <CardTitle className="text-2xl">Recuperar Contraseña</CardTitle>
                <CardDescription>
                    Ingrese su correo electrónico para recibir instrucciones
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

                {success ? (
                    <Alert className="mb-4 bg-primary/10 border-primary/20">
                        <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="h-4 w-4 mr-2 text-primary"
                        />
                        <AlertDescription>
                            Se han enviado instrucciones para restablecer su
                            contraseña a su correo electrónico.
                        </AlertDescription>
                    </Alert>
                ) : (
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
                                        <FormLabel>
                                            Correo Electrónico
                                        </FormLabel>
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
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? 'Enviando...'
                                    : 'Enviar Instrucciones'}
                            </Button>
                        </form>
                    </Form>
                )}
            </CardContent>
            <CardFooter>
                <div className="text-sm text-center w-full">
                    <Link
                        href="/login"
                        className="text-primary hover:underline"
                    >
                        Volver a Iniciar Sesión
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
