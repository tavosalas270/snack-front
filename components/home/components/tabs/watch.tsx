import { useSeries } from '@/components/home/hooks';
import { Series } from '@/components/home/interfaces';
import { Image } from 'expo-image';
import React, { useCallback } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL ?? '';

const VideoThumbnail = ({ uri }: { uri: string }) => (
    <Image
        source={{ uri: `${BASE_URL}/media/${uri}` }}
        style={styles.thumbnail}
        contentFit="cover"
    />
);

const SeriesCard = ({ item }: { item: Series }) => (
    <View style={styles.card}>
        {/* Poster */}
        <View style={styles.posterContainer}>
            <Image
                source={{ uri: `${BASE_URL}/media/${item.poster}` }}
                style={styles.poster}
                contentFit="contain"
            />
            <View style={styles.posterOverlay} />
            <Text style={styles.seriesTitle}>{item.title}</Text>
        </View>

        {/* Video thumbnails row */}
        {(item.videos?.length ?? 0) > 0 && (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbnailRow}
            >
                {item.videos?.map((video) => (
                    <VideoThumbnail key={video?.id} uri={video?.thumbnail_path ?? ''} />
                ))}
            </ScrollView>
        )}
    </View>
);

export const WatchTab = () => {
    const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isLoading } = useSeries();

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
            <View style={styles.loader}>
                <ActivityIndicator size="small" color="#D63AF9" />
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#D63AF9" />
            </View>
        );
    }

    return (
        <FlatList
            data={series}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <SeriesCard item={item} />}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        paddingVertical: 16,
        backgroundColor: '#0D0D0D',
    },
    card: {
        marginBottom: 28,
    },
    posterContainer: {
        marginHorizontal: 16,
        borderRadius: 16,
        overflow: 'hidden',
        aspectRatio: 16 / 9,
        backgroundColor: '#000',
    },
    poster: {
        width: '100%',
        height: '100%',
    },
    posterOverlay: {
        ...StyleSheet.absoluteFillObject,
        background: 'transparent',
        backgroundImage: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%)',
    },
    seriesTitle: {
        position: 'absolute',
        bottom: 14,
        left: 14,
        right: 14,
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    thumbnailRow: {
        paddingHorizontal: 16,
        paddingTop: 10,
        gap: 8,
    },
    thumbnail: {
        width: 110,
        height: 65,
        borderRadius: 8,
        backgroundColor: '#1A1A1A',
    },
    loader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0D0D0D',
    },
});
