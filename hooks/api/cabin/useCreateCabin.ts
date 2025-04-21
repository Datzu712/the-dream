import { useAuth } from '@/contexts/auth-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Cabin, CabinFormData } from '@/types/models';

export function useCreateCabin() {
    const { apiRequest } = useAuth();
    const queryClient = useQueryClient();

    return useMutation<Cabin, Error, CabinFormData>({
        mutationFn: (data: CabinFormData) =>
            apiRequest('/cabin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cabins'] });
        },
    });
}
