'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { MainNav } from '@/components/main-nav';
import { DashboardNav } from '@/components/dashboard-nav';
import { SiteFooter } from '@/components/site-footer';
import { UserNav } from '@/components/user-nav';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronLeft,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthProvider } from '@/contexts/auth-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <DashboardLayoutContent>{children}</DashboardLayoutContent>
            </AuthProvider>
        </QueryClientProvider>
    );
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (!mounted || isLoading) {
        return (
            <div className="flex min-h-screen flex-col">
                <header className="sticky top-0 z-50 border-b bg-background">
                    <div className="container flex h-16 items-center justify-between py-4">
                        <Skeleton className="h-8 w-40" />
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    </div>
                </header>
                <div className="flex flex-1 relative">
                    <div className="fixed left-0 top-16 bottom-0 z-30 border-r bg-background w-[240px]">
                        <div className="h-full py-6 px-2">
                            <div className="space-y-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Skeleton key={i} className="h-10 w-full" />
                                ))}
                            </div>
                        </div>
                    </div>
                    <main className="flex-1 ml-[256px]">
                        <div className="container py-6">
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-64" />
                                <Skeleton className="h-32 w-full" />
                                <Skeleton className="h-32 w-full" />
                            </div>
                        </div>
                    </main>
                </div>
                <SiteFooter className="border-t" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 border-b bg-background">
                <div className="container flex h-16 items-center justify-between py-4">
                    <MainNav />
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <UserNav />
                    </div>
                </div>
            </header>
            <div className="flex flex-1 relative">
                <div
                    className={cn(
                        'fixed left-0 top-16 bottom-0 z-30 border-r bg-background transition-all duration-300 ease-in-out',
                        sidebarCollapsed ? 'w-[60px]' : 'w-[240px]',
                    )}
                >
                    <div className="h-full py-6 px-2">
                        <DashboardNav collapsed={sidebarCollapsed} />
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -right-4 top-60 z-40 flex h-8 w-8 items-center justify-center rounded-full border bg-background shadow-sm"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    >
                        {sidebarCollapsed ? (
                            <FontAwesomeIcon
                                icon={faChevronRight}
                                className="h-3 w-3"
                            />
                        ) : (
                            <FontAwesomeIcon
                                icon={faChevronLeft}
                                className="h-3 w-3"
                            />
                        )}
                    </Button>
                </div>
                <main
                    className={cn(
                        'flex-1 transition-all duration-300 ease-in-out',
                        sidebarCollapsed ? 'ml-[76px]' : 'ml-[256px]',
                    )}
                >
                    <div className="container py-6">{children}</div>
                </main>
            </div>
            <SiteFooter className="border-t" />
        </div>
    );
}
