import { AuthLayout } from '@/components/auth/auth-layout';
import { LoginForm } from '@/components/auth/login-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Iniciar Sesión | El Sueño CR',
    description: 'Inicie sesión en su cuenta de El Sueño CR',
};

export default function LoginPage() {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
}
