'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { MainNav } from '@/components/main-nav';
import { DashboardNav } from '@/components/dashboard-nav';
import { UserNav } from '@/components/user-nav';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronLeft,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { ThemeToggle } from '@/components/theme-toggle';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Necesario para evitar problemas de hidratación con el tema
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
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
                        className="absolute -right-4 bottom-16 z-40 flex h-8 w-8 items-center justify-center rounded-full border bg-background shadow-sm"
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
            {/* <SiteFooter className="border-t" /> */}
        </div>
    );
}
