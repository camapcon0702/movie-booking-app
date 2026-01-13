import { User } from '@/types/user';

const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'auth_user';

// Helper to set cookie
const setCookie = (name: string, value: string, days: number = 7) => {
    if (typeof window === 'undefined') return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// Helper to delete cookie
const deleteCookie = (name: string) => {
    if (typeof window === 'undefined') return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};

export const storage = {
    getToken: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(TOKEN_KEY);
    },

    setToken: (token: string) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(TOKEN_KEY, token);
        // Also set in cookie for middleware access
        setCookie('token', token, 7);
    },

    getUser: (): User | null => {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem(USER_KEY);
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch {
            return null;
        }
    },

    setUser: (user: User) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    clearAuth: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        // Also clear cookie
        deleteCookie('token');
    },

    isAdmin: (): boolean => {
        const user = storage.getUser();
        return user?.roleName === 'ADMIN';
    }
};
