import { AuthLayout } from '@/components/auth/auth-layout';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Recuperar Contraseña | El Sueño CR',
    description: 'Recupere su contraseña de El Sueño CR',
};

export default function ForgotPasswordPage() {
    return (
        <AuthLayout>
            <ForgotPasswordForm />
        </AuthLayout>
    );
}
