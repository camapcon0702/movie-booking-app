import { storage } from '@/lib/auth/storage';
import { getBaseUrl } from './config';

interface FetchOptions extends RequestInit {
    params?: Record<string, string>;
}

export async function fetcher<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...init } = options;

    const url = new URL(`${getBaseUrl()}${endpoint}`);
    if (params) {
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    const token = storage.getToken();

    const headers = new Headers(init.headers);
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    if (!headers.has('Content-Type') && !(init.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    try {
        const response = await fetch(url.toString(), {
            ...init,
            headers,
        });

        if (response.status === 401) {
            storage.clearAuth();
            window.location.href = '/login';
            throw new Error('Unauthorized');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API Error');
        }

        return data as T;
    } catch (error) {
        throw error;
    }
}
