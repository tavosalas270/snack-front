import { useInfiniteQuery } from '@tanstack/react-query';
import { Videos } from '../interfaces';
import { getVideos } from '../services';

export const useVideos = () => {
    const query = useInfiniteQuery({
        queryKey: ['videos'],
        initialPageParam: 1,
        queryFn: async ({ pageParam }): Promise<Videos[]> => {
            try {
                return await getVideos(pageParam);
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
