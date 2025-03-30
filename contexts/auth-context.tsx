'use client';

import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import type { User } from '@/types/user';
import {
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
} from '@/lib/auth';
import { usePathname, useRouter } from 'next/navigation';
import { API_URL } from '@/constants/constants';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (
        email: string,
        password: string,
    ) => Promise<{ success: boolean; message?: string }>;
    register: (
        name: string,
        email: string,
        password: string,
    ) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    apiRequest: (url: string, options?: RequestInit) => Promise<Response>;
}

const publicRoutes = ['/login', '/signup'];
// Define the API URL
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            const checkAuth = async () => {
                try {
                    const currentUser = await getCurrentUser();
                    setUser(currentUser);
                } catch (error) {
                    console.error(
                        'Error al verificar la autenticación:',
                        error,
                    );
                } finally {
                    setIsLoading(false);
                }
            };

            checkAuth();
        }
    }, [mounted]);

    useEffect(() => {
        if (mounted && !isLoading && !publicRoutes.includes(pathname)) {
            const checkAuthOnRouteChange = async () => {
                try {
                    const currentUser = await getCurrentUser();

                    if (!currentUser) {
                        router.push('/login');
                    } else {
                        setUser(currentUser);
                    }
                } catch (error) {
                    console.error(
                        'Error al verificar autenticación en cambio de ruta:',
                        error,
                    );
                }
            };

            checkAuthOnRouteChange();
        }
    }, [pathname, mounted, isLoading, router]);

    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const result = await loginUser(email, password);
            if (result.success && result.user) {
                setUser(result.user);
                return { success: true };
            }
            return {
                success: false,
                message: result.message || 'Error al iniciar sesión',
            };
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            return { success: false, message: 'Error al iniciar sesión' };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = async (name: string, email: string, password: string) => {
        setIsLoading(true);
        try {
            const result = await registerUser(name, email, password);
            if (result.success && result.user) {
                setUser(result.user);
                return { success: true };
            }
            return {
                success: false,
                message: result.message || 'Error al registrarse',
            };
        } catch (error) {
            console.error('Error al registrarse:', error);
            return { success: false, message: 'Error al registrarse' };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await logoutUser();
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const apiRequest = useCallback(
        async (url: string, options?: RequestInit) => {
            const response = await fetch(`${API_URL}${url}`, {
                credentials: 'include',
                ...options,
            });
            if (!response.ok) {
                if (response.status === 401) {
                    logout();
                }
                throw new Error(`${response.status} HTTP error`, {
                    cause: response,
                });
            }
            return await response.json();
        },
        [],
    );

    return (
        <AuthContext.Provider
            value={{ user, isLoading, login, register, logout, apiRequest }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}
