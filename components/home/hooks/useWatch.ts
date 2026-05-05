import { useLoginContext } from '@/components/signUpLogin/context';
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Favorites, Series, Videos } from '../interfaces';
import { addFavorite, getFavorites, getSeries, searchVideos } from '../services';

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

export const useSearchVideos = (value: string) => {
    const query = useQuery({
        queryKey: ['searchVideos', value],
        queryFn: async (): Promise<Videos[]> => {
            try {
                return await searchVideos(value);
            } catch {
                return [];
            }
        },
        enabled: value.length > 0,
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
        onSuccess: (newFavorite) => {
            queryClient.setQueryData<InfiniteData<Favorites[]>>(['favorites', accessToken], (oldData) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return {
                        pages: [[newFavorite]],
                        pageParams: [1],
                    };
                }

                return {
                    ...oldData,
                    pages: [
                        [newFavorite, ...oldData.pages[0]],
                        ...oldData.pages.slice(1),
                    ],
                };
            });
        },
    });
};
