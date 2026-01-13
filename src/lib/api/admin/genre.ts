import { fetcher } from '@/lib/api/fetcher';
import { Genre, GenreRequest, ApiResponse } from '@/types/genre';

const BASE_PATH = '/admin/genres';

export const genreApi = {
    getGenres: async (): Promise<ApiResponse<Genre[]>> => {
        return fetcher<ApiResponse<Genre[]>>(BASE_PATH, {
            method: 'GET',
        });
    },

    getGenreById: async (id: number): Promise<ApiResponse<Genre>> => {
        return fetcher<ApiResponse<Genre>>(`${BASE_PATH}/${id}`, {
            method: 'GET',
        });
    },

    createGenre: async (data: GenreRequest): Promise<ApiResponse<Genre>> => {
        return fetcher<ApiResponse<Genre>>(BASE_PATH, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateGenre: async (id: number, data: GenreRequest): Promise<ApiResponse<Genre>> => {
        return fetcher<ApiResponse<Genre>>(`${BASE_PATH}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteGenre: async (id: number): Promise<ApiResponse<null>> => {
        return fetcher<ApiResponse<null>>(`${BASE_PATH}/${id}`, {
            method: 'DELETE',
        });
    },
    
};
