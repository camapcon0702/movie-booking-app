import { fetcher } from '@/lib/api/fetcher';
import { Genre } from '@/types/genre';
import { ApiResponse } from '@/types/genre';

const BASE_PATH = '/genres';

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
};
