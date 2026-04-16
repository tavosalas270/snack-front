import { useInfiniteQuery } from '@tanstack/react-query';
import { Videos } from '../interfaces';
import { getVideos } from '../services';

export const useVideos = (serie: number, initialPage: number = 1, enabled: boolean = true) => {
    const query = useInfiniteQuery({
        queryKey: ['videos', serie],
        initialPageParam: initialPage,
        queryFn: async ({ pageParam }): Promise<Videos[]> => {
            try {
                return await getVideos(pageParam as number, serie);
            } catch {
                return [];
            }
        },
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            if (!lastPage || lastPage.length < 5) return undefined;
            return (lastPageParam as number) + 1;
        },
        enabled,
    });

    return query;
};
