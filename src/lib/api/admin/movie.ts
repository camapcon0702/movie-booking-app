import { fetcher } from '@/lib/api/fetcher';
import { getBaseUrl } from '@/lib/api/config';
import { Movie, MovieRequest } from '@/types/movie';
import { ApiResponse } from '@/types/genre';
import { storage } from '@/lib/auth/storage';

const BASE_PATH = '/admin/movies';

export const movieApi = {
    getAllMovies: async (): Promise<ApiResponse<Movie[]>> => {
        return fetcher<ApiResponse<Movie[]>>(BASE_PATH, {
            method: 'GET',
        });
    },

    getMovieById: async (id: number): Promise<ApiResponse<Movie>> => {
        return fetcher<ApiResponse<Movie>>(`${BASE_PATH}/${id}`, {
            method: 'GET',
        });
    },

    createMovie: async (data: MovieRequest): Promise<ApiResponse<Movie>> => {
        return fetcher<ApiResponse<Movie>>(BASE_PATH, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateMovie: async (id: number, data: MovieRequest): Promise<ApiResponse<Movie>> => {
        return fetcher<ApiResponse<Movie>>(`${BASE_PATH}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteMovie: async (id: number): Promise<ApiResponse<null>> => {
        return fetcher<ApiResponse<null>>(`${BASE_PATH}/${id}`, {
            method: 'DELETE',
        });
    },

    uploadMoviePoster: async (movieId: number, file: File): Promise<ApiResponse<Movie>> => {
        const formData = new FormData();
        formData.append('file', file);

        // We CANNOT use the common fetcher here effectively because we need to NOT set Content-Type
        // so the browser sets the multipart boundary.
        // But we DO need the Auth token.
        const token = storage.getToken();

        const res = await fetch(`${getBaseUrl()}${BASE_PATH}/${movieId}/poster`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                // No Content-Type header; browser sets it for FormData
            },
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Upload poster thất bại');
        }

        return data;
    },

    // Legacy support if needed for Showtimes dropdown which used getMovies
    getMovies: async (): Promise<ApiResponse<Movie[]>> => {
        return fetcher<ApiResponse<Movie[]>>(BASE_PATH, {
            method: 'GET',
        });
    }
};
