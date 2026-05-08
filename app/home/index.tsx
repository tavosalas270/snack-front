import { WatchTab } from '@/components/home/components/tabs/watch';
import { FavoritesTab } from '@/components/home/components/tabs/favorites';
import { useUserTokenData } from '@/components/home/hooks';
import { AntDesign } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Tab = 'WATCH' | 'FAVORITES' | 'PLAY' | 'TRADE' | 'HANG';

const TABS: Tab[] = ['WATCH', 'FAVORITES', 'PLAY', 'TRADE', 'HANG'];

const renderContent = (tab: Tab) => {
    switch (tab) {
        case 'WATCH':
            return <WatchTab />;
        case 'FAVORITES':
            return <FavoritesTab />;
        default:
            return <View style={styles.empty} />;
    }
};

export default function HomeScreen() {
    const [activeTab, setActiveTab] = useState<Tab>('WATCH');

    return (
        <View style={styles.container}>
            {/* Background */}
            <Image
                source={require('@/assets/images/FondoUno.png')}
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Tab bar */}
                <View style={styles.tabBar}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tabBarInner}
                    >
                        {TABS.map((tab) => {
                            const isActive = tab === activeTab;
                            return (
                                <Pressable
                                    key={tab}
                                    onPress={() => setActiveTab(tab)}
                                    style={[styles.tab, isActive && styles.tabActive]}
                                >
                                    <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                                        {tab}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {renderContent(activeTab)}
                </View>

                {/* Tokens Counter */}
                <TokenCounter />
            </SafeAreaView>
        </View>
    );
}

const TokenCounter = () => {
    const { data } = useUserTokenData();
    if (!data) return null;

    return (
        <View style={styles.tokenCounter}>
            <Image
                source={{ uri: 'https://openmoji.org/data/color/svg/1FA99.svg' }}
                style={{ width: 20, height: 20 }}
            />
            <Text style={styles.tokenText}>{data.tokens ?? 0}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D', // Fallback color
    },
    safeArea: {
        flex: 1,
    },
    tabBar: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
    },
    tabBarInner: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 999,
    },
    tabActive: {
        backgroundColor: '#D63AF9',
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.8,
        color: 'rgba(255,255,255,0.45)',
    },
    tabLabelActive: {
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
    },
    empty: {
        flex: 1,
    },
    tokenCounter: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.8)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.3)',
    },
    tokenText: {
        color: '#FFD700',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
