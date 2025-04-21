import { useAuth } from '@/contexts/auth-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CabinImage } from '@/types/models';

export function useUploadCabinImages() {
    const { apiRequest } = useAuth();
    const queryClient = useQueryClient();

    return useMutation<CabinImage[], Error, { cabinId: string; files: File[] }>(
        {
            mutationFn: async ({ cabinId, files }) => {
                const formData = new FormData();

                // Agregar cada archivo al FormData
                files.forEach((file) => {
                    formData.append('files', file);
                });

                // Usar fetch directamente para tener más control sobre el tipo de contenido
                return await apiRequest(`/cabin/${cabinId}/images`, {
                    method: 'POST',
                    body: formData,
                    // No agregamos Content-Type aquí porque fetch lo añade automáticamente con el boundary correcto
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
            },
            onSuccess: (_, variables) => {
                // Invalidar consultas relacionadas
                queryClient.invalidateQueries({ queryKey: ['cabins'] });
                queryClient.invalidateQueries({
                    queryKey: ['cabin', variables.cabinId],
                });
            },
        },
    );
}
