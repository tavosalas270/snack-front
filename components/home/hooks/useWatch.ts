import { useLoginContext } from '@/components/signUpLogin/context';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Categories, Favorites, Series, Videos } from '../interfaces';
import { addFavorite, getCategories, getFavorites, getSeries, searchVideos } from '../services';

export const useSeries = () => {
    const { accessToken } = useLoginContext();

    const query = useInfiniteQuery({
        queryKey: ['series', accessToken],
        initialPageParam: 1,
        queryFn: async ({ pageParam }): Promise<Series[]> => {
            try {
                return await getSeries(pageParam, accessToken);
            } catch {
                return [];
            }
        },
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            if (!lastPage || lastPage.length === 0) return undefined;
            return lastPageParam + 1;
        },
    });
    return query;
};

export const useCategories = () => {
    const query = useQuery({
        queryKey: ['categories'],
        queryFn: async (): Promise<Categories[]> => {
            try {
                return await getCategories();
            } catch {
                return [];
            }
        },
    });

    return query;
};

export const useSearchVideos = (value: string, category?: string) => {
    const { accessToken } = useLoginContext();

    const query = useQuery({
        queryKey: ['searchVideos', value, category, accessToken],
        queryFn: async (): Promise<Videos[]> => {
            try {
                return await searchVideos(value, category, accessToken);
            } catch {
                return [];
            }
        },
        enabled: value.length > 0 || (category ? category.length > 0 : false)
    });

    return query;
};

export const useFavorites = () => {
    const { accessToken } = useLoginContext();

    const query = useInfiniteQuery({
        queryKey: ['favorites', accessToken],
        initialPageParam: 1,
        queryFn: async ({ pageParam }): Promise<Favorites[]> => {
            try {
                return await getFavorites(pageParam, accessToken);
            } catch {
                return [];
            }
        },
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            if (!lastPage || lastPage.length === 0) return undefined;
            return lastPageParam + 1;
        },
    });

    return query;
};

export const useAddFavorite = () => {
    const queryClient = useQueryClient();
    const { accessToken } = useLoginContext();

    return useMutation({
        mutationFn: (video: string) => addFavorite(video, accessToken),
        onSuccess: (response, videoId) => {
            const isFav = response.is_favorite;

            // Actualizar caché de series
            queryClient.setQueriesData({ queryKey: ['series'] }, (oldData: any) => {
                if (!oldData?.pages) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: Series[]) =>
                        page.map((serie: Series) => ({
                            ...serie,
                            videos: serie.videos?.map((v: Videos) => v.id.toString() === videoId.toString() ? { ...v, is_favorite: isFav } : v)
                        }))
                    )
                };
            });

            // Actualizar caché de videos (paginación)
            queryClient.setQueriesData({ queryKey: ['videos'] }, (oldData: any) => {
                if (!oldData?.pages) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: Videos[]) =>
                        page.map((v: Videos) => v.id.toString() === videoId.toString() ? { ...v, is_favorite: isFav } : v)
                    )
                };
            });

            // Actualizar caché de búsqueda (searchVideos)
            queryClient.setQueriesData({ queryKey: ['searchVideos'] }, (oldData: any) => {
                if (!oldData) return oldData;
                if (Array.isArray(oldData)) {
                    return oldData.map((v: Videos) => v.id.toString() === videoId.toString() ? { ...v, is_favorite: isFav } : v);
                }
                return oldData;
            });

            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            queryClient.invalidateQueries({ queryKey: ['series'] });
            queryClient.invalidateQueries({ queryKey: ['videos'] });
            queryClient.invalidateQueries({ queryKey: ['searchVideos'] });
        },
    });
};
