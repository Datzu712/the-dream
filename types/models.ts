// Definición de interfaces para modelos de datos

export interface CabinImage {
    id: number;
    cabin_id: number;
    imageUrl: string;
    is_main: boolean;
    created_at: string;
}

export interface Amenity {
    id: number;
    name: string;
    icon: string | null;
    created_at: string;
}

export interface Cabin {
    id: number;
    name: string;
    capacity: number;
    price: number;
    status: 'Disponible' | 'Ocupada' | 'Mantenimiento';
    location: string;
    description: string;
    created_at: string;
    updated_at: string;
    amenities: Amenity[];
    images: CabinImage[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    phone: string | null;
    address: string | null;
    dni: string | null;
    created_at: string;
    updated_at: string;
}

export interface Booking {
    id: number;
    cabin_id: number;
    customer_id: number;
    start_date: string;
    end_date: string;
    nights: number;
    guests: number;
    total_amount: number;
    status: 'Confirmada' | 'Pendiente' | 'Cancelada';
    observations: string | null;
    created_by: number | null;
    created_at: string;
    updated_at: string;
    cabin?: Cabin;
    customer?: User;
}

export interface Payment {
    id: number;
    booking_id: number;
    amount: number;
    payment_method: string;
    payment_status: 'Pagado' | 'Pendiente' | 'Reembolsado' | 'Fallido';
    transaction_id: string | null;
    payment_date: string | null;
    created_at: string;
    updated_at: string;
    booking?: Booking;
}

export interface ServicioAdicional {
    idServiciosAdicionales: number;
    nombreServicio: string;
    descripcion: string;
    precio: number;
    imagen: string | null;
    disponible: boolean;
}

// DTOs (Data Transfer Objects) para operaciones
export interface CabinFormData {
    name: string;
    capacity: number;
    price: number;
    status: string;
    location: string;
    description: string;
    amenities?: string[];
    images?: any[];
}
