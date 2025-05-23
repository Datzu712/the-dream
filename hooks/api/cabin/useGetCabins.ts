import { useAuth } from '@/contexts/auth-context';
import { useQuery } from '@tanstack/react-query';
import { Cabin } from '@/types/models';

export function useGetCabins() {
    const { apiRequest } = useAuth();

    return useQuery<Cabin[]>({
        queryKey: ['cabins'],
        queryFn: () => apiRequest('/cabin'),
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
}
