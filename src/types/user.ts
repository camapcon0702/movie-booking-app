export type UserRole = 'ADMIN' | 'USER';

export interface User {
    id: number;
    email: string;
    fullName: string;
    roleName: UserRole;
    createAt: string;
    avatar?: string; // Optional relative to backend extension
}

export interface AuthResponse {
    status: number;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterResponse {
    status: number;
    message: string;
    data: User;
}
