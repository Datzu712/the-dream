import { useAuth } from '@/contexts/auth-context';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Amenity } from '@/types/models';

export function useGetAmenities<T = Amenity[]>() {
    const { apiRequest } = useAuth();

    return useQuery<T>({
        queryKey: ['amenities'],
        queryFn: () => apiRequest('/amenity'),
        staleTime: 1000 * 60 * 10, // 10 minutos (más tiempo ya que las amenidades cambian con poca frecuencia)
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
}
