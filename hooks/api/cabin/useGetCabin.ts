import { useAuth } from '@/contexts/auth-context';
import { useQuery } from '@tanstack/react-query';
import { Cabin } from '@/types/models';

export function useGetCabin(id: string | undefined) {
    const { apiRequest } = useAuth();

    return useQuery<Cabin>({
        queryKey: ['cabin', id],
        queryFn: () => apiRequest(`/cabin/${id}`),
        enabled: !!id,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
}
