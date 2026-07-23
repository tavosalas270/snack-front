import { trackPixelEvent } from '@/utils/analytics';
import { useLoginContext } from '@/components/signUpLogin/context';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Comments, PostComment, UserTokenData, Videos } from '../interfaces';
import { getComments, getPurchases, getUserTokenData, getVideos, postCommentService, postPayVideo } from '../services';

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
        mutationFn: ({ id }: { id: string; title: string }) => postPayVideo(id, accessToken),
        onSuccess: (_, { id, title }) => {
            // Disparar evento de Purchase cuando el video se compre exitosamente
            trackPixelEvent('both', 'Purchase', {
                content_name: title,
                content_id: id,
                content_type: 'video',
            });

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

export const useComments = (videoId: string) => {
    const { accessToken } = useLoginContext();

    return useQuery({
        queryKey: ['comments', videoId, accessToken],
        queryFn: () => getComments(videoId, accessToken),
        enabled: !!videoId,
        select: (data) => {
            if (!data) return [];
            const replyIds = new Set<number>();
            data.forEach(comment => {
                if (comment.replies && Array.isArray(comment.replies)) {
                    comment.replies.forEach(reply => {
                        replyIds.add(reply.id);
                    });
                }
            });
            return data.filter(comment => !replyIds.has(comment.id));
        }
    });
};


export const usePostComment = () => {
    const queryClient = useQueryClient();
    const { accessToken } = useLoginContext();

    return useMutation({
        mutationFn: (comment: PostComment) => postCommentService(comment, accessToken),
        onSuccess: (newComment) => {
            const videoId = newComment.video;

            // Enviar evento de Pixel al publicar comentario
            trackPixelEvent('both', 'PostComment', {
                content_id: videoId.toString(),
                content_type: 'video',
                comment_text: newComment.content,
                is_reply: !!newComment.parent
            });

            queryClient.setQueryData(['comments', videoId], (oldComments: Comments[] | undefined) => {
                if (!oldComments) return [newComment];

                if (newComment.parent) {
                    return oldComments.map(comment => {
                        if (comment.id === newComment.parent) {
                            return {
                                ...comment,
                                replies_count: (comment.replies_count || 0) + 1,
                                replies: [...(comment.replies || []), newComment]
                            };
                        }
                        return comment;
                    });
                } else {
                    return [newComment, ...oldComments];
                }
            });
            queryClient.invalidateQueries({ queryKey: ['comments', videoId, accessToken] });
        }
    });
};