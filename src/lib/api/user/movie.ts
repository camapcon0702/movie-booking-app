import { fetcher } from '@/lib/api/fetcher';
import { Movie, MovieStatus } from '@/types/movie';
import { ApiResponse } from '@/types/genre';

const BASE_PATH = '/movies';

export const movieApi = {
    // Get all movies (public)
    getMovies: async (): Promise<ApiResponse<Movie[]>> => {
        return fetcher<ApiResponse<Movie[]>>(BASE_PATH, {
            method: 'GET',
        });
    },

    // Get movies by status (public)
    getMoviesByStatus: async (status: MovieStatus): Promise<ApiResponse<Movie[]>> => {
        return fetcher<ApiResponse<Movie[]>>(`${BASE_PATH}/status`, {
            method: 'GET',
            params: { status },
        });
    },

    // Search movies (public)
    searchMovies: async (keyword: string): Promise<ApiResponse<Movie[]>> => {
        return fetcher<ApiResponse<Movie[]>>(`${BASE_PATH}/search`, {
            method: 'GET',
            params: { keyword },
        });
    },

    // Get movies by genre (public)
    getMoviesByGenre: async (genreId: number): Promise<ApiResponse<Movie[]>> => {
        return fetcher<ApiResponse<Movie[]>>(`${BASE_PATH}/genre/${genreId}`, {
            method: 'GET',
        });
    },

    // Get movie by ID (public)
    getMovieById: async (id: number): Promise<ApiResponse<Movie>> => {
        return fetcher<ApiResponse<Movie>>(`${BASE_PATH}/${id}`, {
            method: 'GET',
        });
    },
};
