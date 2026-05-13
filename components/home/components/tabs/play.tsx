import { useLikeVideo } from '@/components/home/hooks';
import { Videos } from '@/components/home/interfaces';
import { AntDesign } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL ?? '';

interface PlayVideoProps {
    video: Videos;
    onClose: () => void;
}

export const PlayVideo = ({ video, onClose }: PlayVideoProps) => {
    // Construir la URL completa del video usando la misma lógica de los thumbnails
    const videoPath = video?.video_path || video?.video_file || '';
    const videoUri = `${BASE_URL}/media/${videoPath}`;
    const videoViewRef = useRef<VideoView>(null);

    const { mutate: likeVideo } = useLikeVideo();

    // Inicializamos el video player. Automáticamente se le indica hacer play.
    const player = useVideoPlayer(videoUri, (p) => {
        p.loop = false;
        p.play();
    });

    const hasLiked = video?.user_has_liked ?? false;
    const likesCount = video?.likes_count ?? 0;

    return (
        <View style={StyleSheet.absoluteFill} className="bg-black z-50">
            <VideoView 
                ref={videoViewRef}
                style={StyleSheet.absoluteFill} 
                player={player} 
                fullscreenOptions={{ enable: true }}
                allowsPictureInPicture={false}
                nativeControls={true}
                // Al salir de la pantalla completa nativa, cerramos nuestra vista.
                onFullscreenExit={onClose}
            />

            {/* Botón superior de cierre para vista inline */}
            <Pressable 
                onPress={onClose} 
                style={styles.closeButton}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
                <AntDesign name="close" size={22} color="white" />
            </Pressable>

            {/* Contenedor flotante a la derecha similar a TikTok */}
            <View style={styles.rightOverlay}>
                <Pressable
                    onPress={() => {
                        if (video?.id) {
                            likeVideo(video.id.toString());
                        }
                    }}
                    style={({ pressed }) => [
                        styles.heartButton,
                        pressed && { transform: [{ scale: 0.88 }] }
                    ]}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                    <AntDesign 
                        name="heart" 
                        size={35} 
                        color={hasLiked ? '#BF0FB4' : 'white'} 
                        style={styles.iconShadow}
                    />
                </Pressable>
                <Text style={styles.likesCountText}>
                    {likesCount}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        top: 45,
        left: 16,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 25,
        zIndex: 1000,
    },
    rightOverlay: {
        position: 'absolute',
        right: 16,
        bottom: 140,
        alignItems: 'center',
        zIndex: 1000,
    },
    heartButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    iconShadow: {
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },
    likesCountText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
        marginTop: 2,
    }
});
