'use client';

import type React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { AuthProvider } from '@/contexts/auth-context';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <AuthProvider>
            <div className="min-h-screen flex flex-col">
                <header className="border-b bg-background">
                    <div className="container flex h-16 items-center justify-between py-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <FontAwesomeIcon
                                icon={faHouseChimney}
                                className="h-6 w-6"
                            />
                            <span className="font-bold">El Sueño CR</span>
                        </Link>
                        <ThemeToggle />
                    </div>
                </header>
                <main className="flex-1 flex items-center justify-center p-4">
                    {children}
                </main>
                <footer className="border-t py-6 text-center text-sm text-muted-foreground">
                    <div className="container">
                        &copy; {new Date().getFullYear()} El Sueño CR. Todos los
                        derechos reservados.
                    </div>
                </footer>
            </div>
        </AuthProvider>
    );
}
