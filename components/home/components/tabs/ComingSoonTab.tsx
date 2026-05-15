import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

export const ComingSoonTab = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('@/antigravity/resources/ComingSoon.png')}
                style={styles.image}
                contentFit="cover"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
    },
});
