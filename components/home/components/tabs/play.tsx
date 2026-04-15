import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL ?? '';

interface PlayVideoProps {
    videoPath: string;
    onClose: () => void;
}

export const PlayVideo = ({ videoPath, onClose }: PlayVideoProps) => {
    // Construir la URL completa del video usando la misma lógica de los thumbnails
    const videoUri = `${BASE_URL}/media/${videoPath}`;
    const videoViewRef = useRef<VideoView>(null);

    // Inicializamos el video player. Automáticamente se le indica hacer play.
    const player = useVideoPlayer(videoUri, (p) => {
        p.loop = false;
        p.play();
    });

    useEffect(() => {
        // Iniciar el modo inmersivo a pantalla completa nativo automáticamente
        const timer = setTimeout(() => {
            videoViewRef.current?.enterFullscreen();
        }, 150);
        return () => clearTimeout(timer);
    }, []);

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
        </View>
    );
};
