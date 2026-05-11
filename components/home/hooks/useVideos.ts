import { useLoginContext } from '@/components/signUpLogin/context';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserTokenData, Videos } from '../interfaces';
import { getPurchases, getUserTokenData, getVideos, postPayVideo } from '../services';

export const useVideos = (serie: number, initialPage: number = 1, enabled: boolean = true) => {
    const { accessToken } = useLoginContext();

    const query = useInfiniteQuery({
        queryKey: ['videos', serie, accessToken],
        initialPageParam: initialPage,
        queryFn: async ({ pageParam }): Promise<Videos[]> => {
            try {
                return await getVideos(pageParam as number, serie, accessToken);
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

export const usePayVideo = () => {
    const { accessToken } = useLoginContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (videoId: string) => postPayVideo(videoId, accessToken),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userTokenData'] });
            queryClient.invalidateQueries({ queryKey: ['series'] });
            queryClient.invalidateQueries({ queryKey: ['videos'] });
            queryClient.invalidateQueries({ queryKey: ['searchVideos'] });
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        },
    });
};

export const usePurchases = () => {
    const { accessToken } = useLoginContext();

    return useQuery({
        queryKey: ['purchases', accessToken],
        queryFn: async (): Promise<Videos[]> => {
            if (!accessToken) return [];
            try {
                return await getPurchases(accessToken);
            } catch {
                return [];
            }
        },
        enabled: !!accessToken,
    });
};

export const useUserTokenData = () => {
    const { accessToken } = useLoginContext();

    return useQuery({
        queryKey: ['userTokenData', accessToken],
        queryFn: async (): Promise<UserTokenData | null> => {
            if (!accessToken) return null;
            try {
                return await getUserTokenData(accessToken);
            } catch {
                return null;
            }
        },
        enabled: !!accessToken,
    });
};
