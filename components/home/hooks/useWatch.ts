import { useInfiniteQuery } from '@tanstack/react-query';
import { getSeries } from '../services';
import { Series } from '../interfaces';

export const useSeries = () => {
    const query = useInfiniteQuery({
        queryKey: ['series'],
        initialPageParam: 1,
        queryFn: async ({ pageParam }): Promise<Series[]> => {
            try {
                return await getSeries(pageParam);
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
