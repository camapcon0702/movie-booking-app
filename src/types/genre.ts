export interface Genre {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface GenreRequest {
    name: string;
    description: string;
}

export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}
