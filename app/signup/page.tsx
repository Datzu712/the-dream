import { AuthLayout } from '@/components/auth/auth-layout';
import { SignupForm } from '@/components/auth/signup-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Registrarse | El Sueño CR',
    description: 'Cree una nueva cuenta en El Sueño CR',
};

export default function SignupPage() {
    return (
        <AuthLayout>
            <SignupForm />
        </AuthLayout>
    );
}
