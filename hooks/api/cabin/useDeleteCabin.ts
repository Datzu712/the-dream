import { useAuth } from '@/contexts/auth-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteCabin() {
    const { apiRequest } = useAuth();
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: async (id: string) =>
            await apiRequest(`/cabin/${id}`, {
                method: 'DELETE',
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cabins'] });
        },
    });
}
