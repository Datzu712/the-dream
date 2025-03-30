'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGear,
    faRightFromBracket,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/contexts/auth-context';

export function UserNav() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="Avatar" />
                        <AvatarFallback>
                            {user?.name?.substring(0, 2).toUpperCase() || 'UN'}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user?.name || 'Usuario'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email || 'usuario@ejemplo.com'}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <FontAwesomeIcon icon={faUser} className="mr-2 h-4 w-4" />
                    Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <FontAwesomeIcon icon={faGear} className="mr-2 h-4 w-4" />
                    Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <FontAwesomeIcon
                        icon={faRightFromBracket}
                        className="mr-2 h-4 w-4"
                    />
                    Cerrar Sesión
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
