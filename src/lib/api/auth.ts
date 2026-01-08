import { getBaseUrl } from './config';
import { AuthResponse, RegisterRequest, RegisterResponse } from '@/types/user';


interface LoginCredentials {
    email: string;
    password: string;
}

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await fetch(`${getBaseUrl()}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (response.status !== 200 || !response.ok) {
            throw new Error(data.message || 'Đăng nhập thất bại');
        }

        return data;
    },

    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await fetch(`${getBaseUrl()}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const resData = await response.json();

        if (!response.ok && response.status !== 201) {
            throw new Error(resData.message || 'Đăng ký thất bại');
        }

        return resData;
    },

    activateAccount: async (email: string, code: string) => {
        const response = await fetch(`${getBaseUrl()}/auth/activate?email=${email}&code=${code}`, {
            method: 'POST',
        });

        const resData = await response.json();

        if (!response.ok) {
            throw new Error(resData.message || 'Kích hoạt thất bại');
        }

        return resData;
    },

    resendActivationCode: async (email: string) => {
        const response = await fetch(`${getBaseUrl()}/auth/resend-code?email=${email}`, {
            method: 'POST',
        });

        const resData = await response.json();

        if (!response.ok) {
            throw new Error(resData.message || 'Gửi lại mã thất bại');
        }

        return resData;
    }
};
