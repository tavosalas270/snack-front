import { useComments, useLikeVideo, usePostComment, useUserTokenData, useVideoPlay } from '@/components/home/hooks';
import { Videos } from '@/components/home/interfaces';
import { useLoginContext } from '@/components/signUpLogin/context';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface PlayVideoProps {
    video: Videos;
    onClose: () => void;
}

const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL ?? '';

const getAvatarUri = (avatar: string | null | undefined) => {
    if (!avatar) return 'https://openmoji.org/data/color/svg/1F464.svg';
    if (avatar.startsWith('http')) return avatar;
    const cleanAvatar = avatar.startsWith('/') ? avatar.slice(1) : avatar;
    if (cleanAvatar.startsWith('media/')) {
        return `${BASE_URL}/${cleanAvatar}`;
    }
    return `${BASE_URL}/media/${cleanAvatar}`;
};

export const PlayVideo = ({ video, onClose }: PlayVideoProps) => {
    const videoViewRef = useRef<VideoView>(null);

    const { mutate: likeVideo } = useLikeVideo();
    const { data: comments = [], isLoading: isLoadingComments } = useComments(video?.id?.toString() ?? '');
    const { mutate: postComment, isPending: isPosting } = usePostComment();
    const { data: userData } = useUserTokenData();
    const { data: playData, isLoading: isLoadingPlay, isSuccess: isPlayReady } = useVideoPlay(video, userData?.id);
    const { accessToken } = useLoginContext();

    const videoUri = isPlayReady && playData?.video_path ? `${BASE_URL}${playData.video_path}` : null;

    const videoSource = React.useMemo(() => {
        if (!videoUri) return null;
        return {
            uri: videoUri,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };
    }, [videoUri, accessToken]);

    const [commentsModalVisible, setCommentsModalVisible] = useState(false);
    const [newCommentText, setNewCommentText] = useState('');
    const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});

    // Inicializamos el video player.
    const player = useVideoPlayer(videoSource, (p) => {
        p.loop = false;
        p.play();
    });

    // Escuchamos cambios de estado para ver si hay errores (ej: 401 por el token)
    React.useEffect(() => {
        const subscription = player.addListener('statusChange', (event) => {
            if (event.status === 'error') {
                console.error("Error reproduciendo el video:", event.error);
            }
        });
        return () => {
            subscription.remove();
        };
    }, [player]);

    const hasLiked = video?.user_has_liked ?? false;
    const likesCount = video?.likes_count ?? 0;

    const handleSendMainComment = () => {
        if (!newCommentText.trim() || !video?.id) return;
        postComment({
            video: video.id.toString(),
            user: userData?.id || '1',
            user_username: userData?.username || 'Usuario',
            content: newCommentText.trim()
        }, {
            onSuccess: () => {
                setNewCommentText('');
            }
        });
    };

    const handleSendReply = (parentId: number) => {
        const content = replyTexts[parentId]?.trim();
        if (!content || !video?.id) return;
        postComment({
            video: video.id.toString(),
            user: userData?.id || '1',
            user_username: userData?.username || 'Usuario',
            content,
            parent: parentId
        }, {
            onSuccess: () => {
                setReplyTexts(prev => ({ ...prev, [parentId]: '' }));
            }
        });
    };

    return (
        <View style={StyleSheet.absoluteFill} className="bg-black z-50">
            {isLoadingPlay ? (
                <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
                    <ActivityIndicator size="large" color="#BF0FB4" />
                </View>
            ) : (
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
            )}

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
                {/* Botón de Likes */}
                <Pressable
                    onPress={() => {
                        if (video?.id) {
                            likeVideo({ id: video.id.toString(), title: video.title });
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

                {/* Botón de Comentarios */}
                <Pressable
                    onPress={() => setCommentsModalVisible(true)}
                    style={({ pressed }) => [
                        styles.commentButton,
                        pressed && { transform: [{ scale: 0.88 }] }
                    ]}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                    <Ionicons
                        name="chatbubble-ellipses-outline"
                        size={33}
                        color="white"
                        style={styles.iconShadow}
                    />
                </Pressable>
                <Text style={styles.likesCountText}>
                    {comments.length}
                </Text>
            </View>

            {/* Modal de Comentarios */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={commentsModalVisible}
                onRequestClose={() => setCommentsModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <View className="flex-1 justify-end">
                        {/* Backdrop */}
                        <Pressable
                            className="absolute inset-0 bg-black/60"
                            onPress={() => setCommentsModalVisible(false)}
                        />

                        {/* Bottom Sheet */}
                        <View className="bg-[#1A1A1A] rounded-t-3xl overflow-hidden mt-20 max-h-[85%] border-t border-gray-800">
                            {/* Handle */}
                            <View className="w-full items-center py-3">
                                <View className="w-12 h-1 bg-gray-600 rounded-full" />
                            </View>

                            <ScrollView
                                className="px-5 pb-8"
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                            >
                                {/* Header */}
                                <View className="flex-row items-center justify-between relative mb-4">
                                    <View className="w-8" />
                                    <Text className="text-white font-jost-bold text-base tracking-wider uppercase">
                                        Comentarios ({comments.length})
                                    </Text>
                                    <Pressable
                                        onPress={() => setCommentsModalVisible(false)}
                                        className="w-8 h-8 rounded-full bg-white/10 items-center justify-center"
                                    >
                                        <AntDesign name="close" size={15} color="#BF0FB4" />
                                    </Pressable>
                                </View>


                                {/* Comments List */}
                                {isLoadingComments ? (
                                    <View className="py-10 items-center justify-center">
                                        <ActivityIndicator size="large" color="#BF0FB4" />
                                    </View>
                                ) : comments.length === 0 ? (
                                    <View className="py-10 items-center justify-center">
                                        <Text className="text-gray-500 font-jost text-sm">No hay comentarios aún. ¡Sé el primero en comentar!</Text>
                                    </View>
                                ) : (
                                    <View className="gap-5">
                                        {comments.map((comment) => (
                                            <View key={comment.id} className="flex-row gap-3 border-b border-gray-800/80 pb-4">
                                                {/* Avatar */}
                                                <Image
                                                    source={{ uri: getAvatarUri(comment.user_avatar) }}
                                                    style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#333' }}
                                                    contentFit="cover"
                                                />
                                                {/* Content Container */}
                                                <View className="flex-1">
                                                    <Text className="text-gray-400 font-jost font-semibold text-xs mb-1">
                                                        @{comment.user_username || 'usuario'}
                                                    </Text>
                                                    <Text className="text-white font-jost text-sm leading-5 mb-2">
                                                        {comment.content}
                                                    </Text>

                                                    {/* Sublista de replies */}
                                                    {comment.replies && comment.replies.length > 0 && (
                                                        <View className="mt-1 border-l-2 border-[#BF0FB4]/30 pl-3 gap-3 mb-3">
                                                            {comment.replies.map((reply) => (
                                                                <View key={reply.id} className="flex-row gap-2.5 mt-1">
                                                                    <Image
                                                                        source={{ uri: getAvatarUri(reply.user_avatar) }}
                                                                        style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: '#333' }}
                                                                        contentFit="cover"
                                                                    />
                                                                    <View className="flex-1">
                                                                        <Text className="text-gray-400 font-jost font-semibold text-[11px] mb-0.5">
                                                                            @{reply.user_username || 'usuario'}
                                                                        </Text>
                                                                        <Text className="text-gray-200 font-jost text-xs leading-4">
                                                                            {reply.content}
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            ))}
                                                        </View>
                                                    )}

                                                    {/* Textfield para responder a cada comentario */}
                                                    <View className="flex-row items-center bg-[#222] rounded-full px-3 py-0.5 border border-gray-800 mt-1">
                                                        <TextInput
                                                            placeholder={`Responder a @${comment.user_username || 'usuario'}...`}
                                                            placeholderTextColor="#666"
                                                            style={{ flex: 1, color: 'white', fontSize: 12, paddingVertical: 4 }}
                                                            value={replyTexts[comment.id] || ''}
                                                            onChangeText={(text) => setReplyTexts((prev) => ({ ...prev, [comment.id]: text }))}
                                                        />
                                                        <Pressable
                                                            onPress={() => handleSendReply(comment.id)}
                                                            disabled={isPosting || !(replyTexts[comment.id] || '').trim()}
                                                            className="ml-2"
                                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                                        >
                                                            <Ionicons
                                                                name="send"
                                                                size={13}
                                                                color={(replyTexts[comment.id] || '').trim() ? '#BF0FB4' : '#444'}
                                                            />
                                                        </Pressable>
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </ScrollView>

                            {/* Main comment input - Fixed at bottom */}
                            <View className="px-5 py-4 bg-[#1A1A1A] border-t border-gray-800">
                                <View className="flex-row items-center bg-[#2A2A2A] rounded-2xl px-4 py-1.5 border border-gray-700">
                                    <TextInput
                                        placeholder="Añadir comentario..."
                                        placeholderTextColor="#888"
                                        style={{ flex: 1, color: 'white', fontSize: 13, minHeight: 36 }}
                                        value={newCommentText}
                                        onChangeText={setNewCommentText}
                                        multiline
                                    />
                                    <Pressable
                                        onPress={handleSendMainComment}
                                        disabled={isPosting || !newCommentText.trim()}
                                        className="ml-3 w-8 h-8 rounded-full bg-[#BF0FB4] items-center justify-center"
                                    >
                                        {isPosting ? (
                                            <ActivityIndicator size="small" color="white" />
                                        ) : (
                                            <Ionicons name="arrow-up" size={18} color="white" />
                                        )}
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
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
    commentButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
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
