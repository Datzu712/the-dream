import { useAuth } from '@/contexts/auth-context';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export function useGetCabins() {
    const { apiRequest } = useAuth();

    return useQuery({
        queryKey: ['cabins'],
        queryFn: () => apiRequest('/cabin'),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
