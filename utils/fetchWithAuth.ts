import * as SecureStore from 'expo-secure-store';
import { DeviceEventEmitter } from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL ?? '';

/**
 * A wrapper around native fetch that automatically injects the Bearer token
 * and handles token refresh on 401 Unauthorized responses.
 */
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    let accessToken = await SecureStore.getItemAsync('accessToken');

    // Construir headers y añadir Authorization si hay un token
    const headers = new Headers(options.headers || {});
    if (accessToken && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    // Petición original
    let response = await fetch(url, { ...options, headers });

    // Si el backend dice que el token caducó (401)
    if (response.status === 401 && accessToken) {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        
        if (refreshToken) {
            try {
                // Pedir un nuevo accessToken
                const refreshResponse = await fetch(`${BASE_URL}/api/token/refresh/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh: refreshToken }),
                });

                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    const newAccessToken = data.access;
                    const newRefreshToken = data.refresh;

                    // Actualizar SecureStore
                    await SecureStore.setItemAsync('accessToken', newAccessToken);
                    if (newRefreshToken) {
                        await SecureStore.setItemAsync('refreshToken', newRefreshToken);
                    }
                    
                    // Avisar a React (LoginContext) que el token cambió
                    DeviceEventEmitter.emit('onTokenRefresh', {
                        access: newAccessToken,
                        refresh: newRefreshToken
                    });

                    // Reintentar la petición original con el NUEVO token
                    headers.set('Authorization', `Bearer ${newAccessToken}`);
                    response = await fetch(url, { ...options, headers });
                } else {
                    // El refreshToken también caducó o es inválido
                    throw new Error('Refresh token invalid');
                }
            } catch (error) {
                // Limpiar todo y forzar cierre de sesión
                await SecureStore.deleteItemAsync('accessToken');
                await SecureStore.deleteItemAsync('refreshToken');
                DeviceEventEmitter.emit('onLogout');
            }
        } else {
            // No hay refresh token, forzar cierre de sesión
            await SecureStore.deleteItemAsync('accessToken');
            DeviceEventEmitter.emit('onLogout');
        }
    }

    return response;
};
