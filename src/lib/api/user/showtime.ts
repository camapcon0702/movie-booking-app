import { fetcher } from '@/lib/api/fetcher';
import { Showtime } from '@/types/showtime';
import { ApiResponse } from '@/types/genre';

const BASE_PATH = '/showtime';

export const showtimeApi = {
    getShowtimesByMovie: async (movieId: number): Promise<ApiResponse<Showtime[]>> => {
        return fetcher<ApiResponse<Showtime[]>>(`${BASE_PATH}/movie/${movieId}`, {
            method: 'GET',
        });
    },

    getShowtimeById: async (id: number): Promise<ApiResponse<Showtime>> => {
        return fetcher<ApiResponse<Showtime>>(`${BASE_PATH}/${id}`, {
            method: 'GET',
        });
    },
};
