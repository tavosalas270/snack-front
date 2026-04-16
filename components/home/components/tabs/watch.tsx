import { PlayVideo } from '@/components/home/components/tabs/play';
import { useSeries, useVideos } from '@/components/home/hooks';
import { Series } from '@/components/home/interfaces';
import { Image } from 'expo-image';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL ?? '';

const VideoThumbnail = ({ uri, onPress }: { uri: string; onPress: () => void }) => (
    <Pressable onPress={onPress}>
        {uri ? (
            <Image
                source={{ uri: `${BASE_URL}/media/${uri}` }}
                style={styles.thumbnail}
                contentFit="cover"
            />
        ) : (
            <View style={styles.thumbnail} />
        )}
    </Pressable>
);

const SeriesCard = ({ item, onVideoSelect }: { item: Series; onVideoSelect: (path: string) => void }) => {
    const [loadMore, setLoadMore] = useState(false);
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useVideos(item.id, 2, loadMore);

    const extraVideos = data?.pages.flat() ?? [];
    const allVideos = [...(item.videos ?? []), ...extraVideos];

    const onEndReached = useCallback(() => {
        if (!loadMore) {
            // Solo empezamos a cargar más si la primera página ya tiene al menos 5 elementos
            if ((item.videos?.length ?? 0) >= 5) {
                setLoadMore(true);
            }
        } else if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [loadMore, hasNextPage, isFetchingNextPage, fetchNextPage, item.videos]);

    const renderFooter = () => {
        if (!isFetchingNextPage) return null;
        return (
            <View className='pl-2 justify-center'>
                <ActivityIndicator size="small" color="#D63AF9" />
            </View>
        );
    };

    return (
        <View className='mb-7'>
            {/* Poster */}
            <View className="mx-4 rounded-2xl overflow-hidden aspect-video bg-black">
                {item.poster ? (
                    <Image
                        source={{ uri: `${BASE_URL}/media/${item.poster}` }}
                        style={styles.poster}
                        contentFit="contain"
                    />
                ) : (
                    <View style={styles.poster} />
                )}
                <View className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-black/85" />
                <Text
                    className="absolute bottom-3.5 inset-x-3.5 text-white text-lg font-bold tracking-[0.5px]"
                    style={{
                        textShadowColor: 'rgba(0,0,0,0.8)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 4,
                    }}
                >
                    {item.title}
                </Text>
            </View>

            {/* Video thumbnails row */}
            {allVideos.length > 0 && (
                <FlatList
                    horizontal
                    data={allVideos}
                    keyExtractor={(video) => video.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, gap: 8 }}
                    renderItem={({ item: video }) => (
                        <VideoThumbnail
                            uri={video?.thumbnail_path ?? ''}
                            onPress={() => onVideoSelect(video?.video_path ?? '')}
                        />
                    )}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                />
            )}
        </View>
    );
};

export const WatchTab = () => {
    const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isLoading } = useSeries();
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    // Aplanar páginas y filtrar items undefined/null de forma segura
    const series: Series[] = data?.pages.flat().filter((item): item is Series => item != null) ?? [];

    const onEndReached = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const renderFooter = () => {
        if (!isFetchingNextPage) return null;
        return (
            <View className='py-5 items-center'>
                <ActivityIndicator size="small" color="#D63AF9" />
            </View>
        );
    };

    if (isLoading) {
        return (
            <View className='flex-1 items-center justify-center'>
                <ActivityIndicator size="large" color="#D63AF9" />
            </View>
        );
    }

    return (
        <View className="flex-1">
            <FlatList
                data={series}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <SeriesCard item={item} onVideoSelect={setSelectedVideo} />}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
            {selectedVideo && (
                <PlayVideo
                    videoPath={selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    list: {
        paddingVertical: 16
    },
    poster: {
        width: '100%',
        height: '100%'
    },
    thumbnail: {
        width: 110,
        height: 65,
        borderRadius: 8,
        backgroundColor: '#1A1A1A'
    }
});
