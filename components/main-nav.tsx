'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

export function MainNav() {
    const pathname = usePathname();

    return (
        <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <FontAwesomeIcon icon={faHome} className="h-6 w-6" />
                <span className="hidden font-bold sm:inline-block">
                    El Sueño
                </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
                <Link
                    href="/dashboard"
                    className={cn(
                        'transition-colors hover:text-foreground/80',
                        pathname === '/dashboard'
                            ? 'text-foreground'
                            : 'text-foreground/60',
                    )}
                >
                    Panel
                </Link>
                <Link
                    href="/dashboard/cabins"
                    className={cn(
                        'transition-colors hover:text-foreground/80',
                        pathname?.startsWith('/dashboard/cabins')
                            ? 'text-foreground'
                            : 'text-foreground/60',
                    )}
                >
                    Cabañas
                </Link>
                <Link
                    href="/dashboard/bookings"
                    className={cn(
                        'transition-colors hover:text-foreground/80',
                        pathname?.startsWith('/dashboard/bookings')
                            ? 'text-foreground'
                            : 'text-foreground/60',
                    )}
                >
                    Reservas
                </Link>
                <Link
                    href="/dashboard/customers"
                    className={cn(
                        'transition-colors hover:text-foreground/80',
                        pathname?.startsWith('/dashboard/customers')
                            ? 'text-foreground'
                            : 'text-foreground/60',
                    )}
                >
                    Clientes
                </Link>
            </nav>
        </div>
    );
}
