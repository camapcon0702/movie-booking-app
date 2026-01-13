import { fetcher } from '@/lib/api/fetcher';
import { Movie, MovieStatus } from '@/types/movie';
import { ApiResponse } from '@/types/genre';

const BASE_PATH = '/movies';

export const movieApi = {
    getMovies: async (): Promise<ApiResponse<Movie[]>> => {
        return fetcher<ApiResponse<Movie[]>>(BASE_PATH, {
            method: 'GET',
        });
    },

    getMoviesByStatus: async (status: MovieStatus): Promise<ApiResponse<Movie[]>> => {
        return fetcher<ApiResponse<Movie[]>>(`${BASE_PATH}/status`, {
            method: 'GET',
            params: { status },
        });
    },

    searchMovies: async (keyword: string): Promise<ApiResponse<Movie[]>> => {
        return fetcher<ApiResponse<Movie[]>>(`${BASE_PATH}/search`, {
            method: 'GET',
            params: { keyword },
        });
    },

    getMoviesByGenre: async (genreId: number): Promise<ApiResponse<Movie[]>> => {
        return fetcher<ApiResponse<Movie[]>>(`${BASE_PATH}/genre/${genreId}`, {
            method: 'GET',
        });
    },

    getMovieById: async (id: number): Promise<ApiResponse<Movie>> => {
        return fetcher<ApiResponse<Movie>>(`${BASE_PATH}/${id}`, {
            method: 'GET',
        });
    },
};
