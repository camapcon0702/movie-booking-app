import { fetcher } from '@/lib/api/fetcher';
import { Genre } from '@/types/genre';
import { ApiResponse } from '@/types/genre';

const BASE_PATH = '/genres';

export const genreApi = {
    // Get all genres (public)
    getGenres: async (): Promise<ApiResponse<Genre[]>> => {
        return fetcher<ApiResponse<Genre[]>>(BASE_PATH, {
            method: 'GET',
        });
    },

    // Get genre by ID (public)
    getGenreById: async (id: number): Promise<ApiResponse<Genre>> => {
        return fetcher<ApiResponse<Genre>>(`${BASE_PATH}/${id}`, {
            method: 'GET',
        });
    },
};
