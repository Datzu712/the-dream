'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarDays,
    faGear,
    faHome,
    faHouseChimney,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';

interface DashboardNavProps {
    collapsed?: boolean;
}

const navItems = [
    {
        href: '/dashboard',
        icon: faHome,
        label: 'Panel',
    },
    {
        href: '/dashboard/cabins',
        icon: faHouseChimney,
        label: 'Cabañas',
    },
    {
        href: '/dashboard/bookings',
        icon: faCalendarDays,
        label: 'Reservas',
    },
    {
        href: '/dashboard/customers',
        icon: faUsers,
        label: 'Clientes',
    },
    {
        href: '/dashboard/settings',
        icon: faGear,
        label: 'Configuración',
    },
];

export function DashboardNav({ collapsed = false }: DashboardNavProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === href;
        }
        return pathname === href || pathname?.startsWith(href + '/');
    };

    if (collapsed) {
        return (
            <TooltipProvider delayDuration={0}>
                <div className="grid items-start gap-2">
                    {navItems.map((item) => (
                        <Tooltip key={item.href} delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Link href={item.href}>
                                    <Button
                                        variant={
                                            isActive(item.href)
                                                ? 'default'
                                                : 'ghost'
                                        }
                                        className="w-full justify-center p-0 h-10 w-10"
                                    >
                                        <FontAwesomeIcon
                                            icon={item.icon}
                                            className="h-4 w-4"
                                        />
                                        <span className="sr-only">
                                            {item.label}
                                        </span>
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent
                                side="right"
                                className="font-normal"
                            >
                                {item.label}
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </TooltipProvider>
        );
    }

    return (
        <nav className="grid items-start gap-2">
            {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                    <Button
                        variant={isActive(item.href) ? 'default' : 'ghost'}
                        className="w-full justify-start"
                    >
                        <FontAwesomeIcon
                            icon={item.icon}
                            className="mr-2 h-4 w-4"
                        />
                        {item.label}
                    </Button>
                </Link>
            ))}
        </nav>
    );
}
