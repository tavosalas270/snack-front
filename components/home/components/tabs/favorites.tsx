import { PlayVideo } from '@/components/home/components/tabs/play';
import { useAddFavorite, useFavorites, usePayVideo, useUserTokenData } from '@/components/home/hooks';
import { Favorites, Videos } from '@/components/home/interfaces';
import { AntDesign } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL ?? '';

export const FavoritesTab = () => {
    const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isLoading } = useFavorites();
    const { mutate: payVideo } = usePayVideo();
    const { data: userData } = useUserTokenData();
    const { mutate: addFavorite } = useAddFavorite();
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    const handlePurchase = (video: Videos) => {
        const userTokens = userData?.tokens ?? 0;

        if (userTokens < video.cost) {
            Alert.alert(
                "Saldo Insuficiente",
                "No tiene saldo suficiente para adquirir este video."
            );
            return;
        }

        Alert.alert(
            "Comprar Video",
            `¿Desea comprar este video por ${video.cost}?`,
            [
                { text: "No", style: "cancel" },
                {
                    text: "Si",
                    onPress: () => payVideo(video.id.toString())
                }
            ]
        );
    };

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

        const isPurchased = (video.is_unlocked ?? false) || (video.cost === 0);

        return (
            <Pressable
                className="mb-6 px-4"
                onPress={() => {
                    if (isPurchased) {
                        videoPath ? setSelectedVideo(videoPath) : null;
                    } else {
                        handlePurchase(video);
                    }
                }}
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
                    <Pressable
                        onPress={() => addFavorite(video.id.toString())}
                        style={styles.favoriteButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <AntDesign name="star" size={14} color="#D63AF9" />
                    </Pressable>
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
                    {!isPurchased && video.cost > 0 && (
                        <View style={styles.costBadge}>
                            <Image
                                source={{ uri: 'https://openmoji.org/data/color/svg/1FA99.svg' }}
                                style={{ width: 14, height: 14 }}
                            />
                            <Text style={styles.costText}>{video.cost}</Text>
                        </View>
                    )}
                </View>
            </Pressable>
        );
    };

    return (
        <View className="flex-1">
            <FlatList
                data={favorites}
                keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
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
    },
    favoriteButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 4,
        borderRadius: 12,
    },
    costBadge: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.7)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        gap: 4,
    },
    costText: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: 'bold',
    }
});
