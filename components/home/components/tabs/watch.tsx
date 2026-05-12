import { PlayVideo } from '@/components/home/components/tabs/play';
import { useAddFavorite, useCategories, usePayVideo, useSearchVideos, useSeries, useUserTokenData, useVideos } from '@/components/home/hooks';
import { Series, Videos } from '@/components/home/interfaces';
import { AntDesign } from '@expo/vector-icons';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL ?? '';

const VideoThumbnail = ({ uri, cost, isPurchased, isFavorite, onPress, onFavorite }: { uri: string; cost: number; isPurchased: boolean; isFavorite: boolean; onPress: () => void; onFavorite: () => void }) => (
    <Pressable onPress={onPress} style={{ position: 'relative' }}>
        {uri ? (
            <Image
                source={{ uri: `${BASE_URL}/media/${uri}` }}
                style={styles.thumbnail}
                contentFit="cover"
            />
        ) : (
            <View style={styles.thumbnail} />
        )}
        <Pressable
            onPress={onFavorite}
            style={styles.favoriteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <AntDesign name="star" size={14} color={isFavorite ? "#D63AF9" : "white"} />
        </Pressable>
        {!isPurchased && cost > 0 && (
            <View style={styles.costBadge}>
                <Image
                    source={{ uri: 'https://openmoji.org/data/color/svg/1FA99.svg' }}
                    style={{ width: 14, height: 14 }}
                />
                <Text style={styles.costText}>{cost}</Text>
            </View>
        )}
    </Pressable>
);

const SeriesCard = ({ item, onVideoSelect, onPurchase }: { item: Series; onVideoSelect: (path: string) => void; onPurchase: (video: Videos) => void }) => {
    const [loadMore, setLoadMore] = useState(false);
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useVideos(item.id, 2, loadMore);
    const { mutate: addFavorite } = useAddFavorite();

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
                            cost={video.cost}
                            isPurchased={(video.is_unlocked ?? false) || (video.cost === 0)}
                            isFavorite={video.is_favorite ?? false}
                            onPress={() => {
                                if ((video.is_unlocked ?? false) || (video.cost === 0)) {
                                    onVideoSelect(video?.video_path ?? '');
                                } else {
                                    onPurchase(video);
                                }
                            }}
                            onFavorite={() => addFavorite(video.id.toString())}
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
    const { data: categoriesData } = useCategories();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [dropdownItems, setDropdownItems] = useState<{ label: string, value: number }[]>([]);

    useEffect(() => {
        if (categoriesData) {
            setDropdownItems(categoriesData.map(c => ({ label: c.name, value: c.id })));
        }
    }, [categoriesData]);

    const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isLoading } = useSeries();
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [submittedQuery, setSubmittedQuery] = useState('');
    const [submittedCategoryName, setSubmittedCategoryName] = useState<string | undefined>(undefined);
    const [isSearching, setIsSearching] = useState(false);

    const { data: searchApiVideos, isFetching: isSearchFetching } = useSearchVideos(submittedQuery, submittedCategoryName);
    const { mutate: payVideo } = usePayVideo();
    const { data: userData } = useUserTokenData();

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
    const series: Series[] = data?.pages.flat().filter((item): item is Series => item != null) ?? [];

    const filteredVideos = useMemo(() => {
        if (!searchQuery && !selectedCategoryId) return [];

        const seriesData = queryClient.getQueriesData<InfiniteData<Series[]>>({ queryKey: ['series'] });
        let allVideos: Videos[] = [];

        seriesData.forEach(([key, data]) => {
            if (data && data.pages) {
                data.pages.flat().forEach(serie => {
                    if (serie && serie.videos) {
                        allVideos.push(...serie.videos);
                    }
                });
            }
        });

        const videosData = queryClient.getQueriesData<InfiniteData<Videos[]>>({ queryKey: ['videos'] });
        videosData.forEach(([key, data]) => {
            if (data && data.pages) {
                data.pages.flat().forEach(video => {
                    if (video) allVideos.push(video);
                });
            }
        });

        if (searchApiVideos) {
            allVideos.push(...searchApiVideos);
        }

        const uniqueVideos = Array.from(new Map(allVideos.map(v => [v.id, v])).values());
        const videosToSee = uniqueVideos.filter(v => {
            const matchesText = searchQuery
                ? v.title?.toLowerCase().includes(searchQuery.toLowerCase())
                : true;

            const matchesCategory = selectedCategoryId
                ? v.category_id === selectedCategoryId
                : true;

            return matchesText && matchesCategory;
        });
        return videosToSee
    }, [searchQuery, selectedCategoryId, queryClient, searchApiVideos]);

    const handleSearchCancel = () => {
        setIsSearching(false);
        setSearchQuery('');
        setSubmittedQuery('');
        setSelectedCategoryId(null);
        setSubmittedCategoryName(undefined);
    };

    const handleInputChange = (value: string) => {
        setIsSearching(true);
        setSearchQuery(value);
    }

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

    const renderSearchItem = ({ item: video }: { item: Videos }) => {
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
                            style={styles.poster}
                            contentFit="cover"
                        />
                    ) : (
                        <View style={styles.poster} />
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
                        {!isPurchased && video.cost > 0 && (
                            <View className="flex-row items-center mt-1">
                                <Image
                                    source={{ uri: 'https://openmoji.org/data/color/svg/1FA99.svg' }}
                                    style={{ width: 14, height: 14 }}
                                />
                                <Text className="text-[#FFD700] text-xs font-bold ml-1">{video.cost}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <View className="flex-1">
            <View className="px-4 pt-2 pb-4" style={{ zIndex: 10 }}>
                <View className="flex-row items-center">
                    <View style={styles.searchContainer}>
                        <TextInput
                            placeholder="Buscar..."
                            placeholderTextColor="rgba(255,255,255,0.5)"
                            style={styles.searchInput}
                            value={searchQuery}
                            onChangeText={(value) => handleInputChange(value)}
                            onFocus={() => setIsSearching(true)}
                        />
                        <Pressable onPress={() => {
                            setSubmittedQuery(searchQuery);
                            const catName = categoriesData?.find(c => c.id === selectedCategoryId)?.name;
                            setSubmittedCategoryName(catName);
                        }} style={styles.searchIcon}>
                            <AntDesign name="search" size={20} color="white" />
                        </Pressable>
                    </View>
                    {isSearching && (
                        <Pressable onPress={handleSearchCancel} className="ml-3">
                            <Text className="text-white">Cancelar</Text>
                        </Pressable>
                    )}
                </View>
                {isSearching && (
                    <DropDownPicker
                        open={dropdownOpen}
                        value={selectedCategoryId}
                        items={dropdownItems}
                        setOpen={setDropdownOpen}
                        setValue={setSelectedCategoryId}
                        setItems={setDropdownItems}
                        placeholder="Seleccionar categoría..."
                        theme="DARK"
                        style={{
                            backgroundColor: '#1A1A1A',
                            borderWidth: 0,
                            marginTop: 10,
                            minHeight: 40,
                        }}
                        dropDownContainerStyle={{
                            backgroundColor: '#2A2A2A',
                            borderWidth: 0,
                            marginTop: 10,
                        }}
                        onChangeValue={(val) => {
                            if (val !== null || searchQuery) {
                                setIsSearching(true);
                            }
                        }}
                        zIndex={3000}
                        zIndexInverse={1000}
                    />
                )}
            </View>

            {isSearching ? (
                <FlatList
                    data={filteredVideos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderSearchItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                />
            ) : (
                <FlatList
                    data={series}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <SeriesCard item={item} onVideoSelect={setSelectedVideo} onPurchase={handlePurchase} />}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
    },
    favoriteButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 4,
        borderRadius: 12,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 40,
    },
    searchInput: {
        flex: 1,
        color: 'white',
        fontSize: 14,
    },
    searchIcon: {
        marginLeft: 8,
    },
    costBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.7)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        gap: 4,
    },
    costText: {
        color: '#FFD700',
        fontSize: 10,
        fontWeight: 'bold',
    }
});
