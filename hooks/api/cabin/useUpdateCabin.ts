import { useAuth } from '@/contexts/auth-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Cabin, CabinFormData } from '@/types/models';

interface UpdateCabinParams {
    id: string;
    data: CabinFormData;
}

export function useUpdateCabin() {
    const { apiRequest } = useAuth();
    const queryClient = useQueryClient();

    return useMutation<Cabin, Error, UpdateCabinParams>({
        mutationFn: ({ id, data }: UpdateCabinParams) =>
            apiRequest(`/cabin/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }),
        onSuccess: (_, variables) => {
            // Invalidar consultas relacionadas
            queryClient.invalidateQueries({ queryKey: ['cabins'] });
            queryClient.invalidateQueries({
                queryKey: ['cabin', variables.id],
            });
        },
    });
}
