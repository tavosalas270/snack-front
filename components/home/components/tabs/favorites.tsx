import { Image } from 'expo-image';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFavorites } from '@/components/home/hooks';
import { PlayVideo } from '@/components/home/components/tabs/play';
import { Favorites } from '@/components/home/interfaces';

const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL ?? '';

export const FavoritesTab = () => {
    const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isLoading } = useFavorites();
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    // Aplanar páginas y filtrar items undefined/null de forma segura
    const favorites: Favorites[] = data?.pages.flat().filter((item): item is Favorites => item != null) ?? [];

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

    const renderItem = ({ item }: { item: Favorites }) => {
        const video = item.video_details;
        // Dependiendo de cómo llegue el modelo (por los campos opcionales)
        const thumbnailPath = video?.thumbnail_path || video?.thumbnail;
        const videoPath = video?.video_path || video?.video_file;

        return (
            <Pressable 
                className="mb-6 px-4"
                onPress={() => videoPath ? setSelectedVideo(videoPath) : null}
            >
                <View className="rounded-2xl overflow-hidden aspect-video bg-black relative">
                    {thumbnailPath ? (
                        <Image
                            source={{ uri: `${BASE_URL}/media/${thumbnailPath}` }}
                            style={styles.thumbnail}
                            contentFit="cover"
                        />
                    ) : (
                        <View style={styles.thumbnail} />
                    )}
                    <View className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-black/85" />
                    <View className="absolute bottom-3.5 inset-x-3.5">
                        <Text
                            className="text-white text-lg font-bold tracking-[0.5px]"
                            style={{
                                textShadowColor: 'rgba(0,0,0,0.8)',
                                textShadowOffset: { width: 0, height: 1 },
                                textShadowRadius: 4,
                            }}
                            numberOfLines={1}
                        >
                            {video?.title || 'Sin título'}
                        </Text>
                        {video?.description ? (
                            <Text className="text-white/80 text-sm mt-1" numberOfLines={2}>
                                {video.description}
                            </Text>
                        ) : null}
                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <View className="flex-1">
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center py-10">
                        <Text className="text-white/60 text-base">No tienes videos favoritos aún.</Text>
                    </View>
                }
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
    thumbnail: {
        width: '100%',
        height: '100%'
    }
});
