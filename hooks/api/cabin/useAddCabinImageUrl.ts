import { useAuth } from '@/contexts/auth-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CabinImage } from '@/types/models';

export function useAddCabinImageUrl() {
    const { apiRequest } = useAuth();
    const queryClient = useQueryClient();

    return useMutation<
        CabinImage,
        Error,
        { cabinId: string; imageUrl: string; isMain?: boolean }
    >({
        mutationFn: ({ cabinId, imageUrl, isMain = false }) =>
            apiRequest(`/cabin/${cabinId}/image-url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageUrl,
                    isMain,
                }),
            }),
        onSuccess: (_, variables) => {
            // Invalidar consultas relacionadas
            queryClient.invalidateQueries({ queryKey: ['cabins'] });
            queryClient.invalidateQueries({
                queryKey: ['cabin', variables.cabinId],
            });
        },
    });
}
