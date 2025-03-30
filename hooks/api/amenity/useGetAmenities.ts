import { useAuth } from '@/contexts/auth-context';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export function useGetAmenities() {
    const { apiRequest } = useAuth();

    return useQuery({
        queryKey: ['amenities'],
        queryFn: () => apiRequest('/amenity'),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
