import { API_URL } from '@/constants/constants';
import { ApiResponse } from '@/types/apiResponse';
import type { User } from '@/types/user';

const handleApiError = (error: any): { success: false; message: string } => {
    console.error('API request failed:', error);
    if (error instanceof TypeError && error.message.includes('NetworkError')) {
        return {
            success: false,
            message: 'Error de red, comprueba tu conexión',
        };
    }
    return { success: false, message: 'Error al conectar con el servidor' };
};

export async function loginUser(
    email: string,
    password: string,
): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = (await response
            .json()
            .catch(() => ({}))) as ApiResponse<User>;

        if (!response.ok) {
            return {
                success: false,
                message:
                    data.message ||
                    `Error (${response.status}): ${response.statusText}`,
            };
        }

        return { success: true, user: data.data };
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            return {
                success: false,
                message: 'La solicitud ha excedido el tiempo de espera',
            };
        }
        return handleApiError(error);
    }
}

export async function registerUser(
    name: string,
    email: string,
    password: string,
): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
            credentials: 'include',
        });

        const data = (await response.json()) as ApiResponse<User>;

        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Error al registrarse',
            };
        }

        return { success: true, user: data.data };
    } catch (error) {
        return handleApiError(error);
    }
}

export async function logoutUser(): Promise<{ success: boolean }> {
    try {
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            return { success: false };
        }

        return { success: true };
    } catch (error) {
        console.error('Error during logout:', error);
        return { success: false };
    }
}

export async function getCurrentUser(): Promise<User | null> {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            credentials: 'include',
        });

        if (!response.ok) {
            return null;
        }

        const data = (await response.json()) as User;

        return data;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
}
