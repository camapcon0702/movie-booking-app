import { fetcher } from '@/lib/api/fetcher';
import { Showtime, ShowtimeRequest, CreateShowtimeRequest } from '@/types/showtime';
import { ApiResponse } from '@/types/genre';

const BASE_PATH = '/admin/showtimes';

export const showtimeApi = {
    getShowtimes: async (): Promise<ApiResponse<Showtime[]>> => {
        return fetcher<ApiResponse<Showtime[]>>(BASE_PATH, {
            method: 'GET',
        });
    },
    getShowtimesByAuditorium: async (auditoriumId: number): Promise<ApiResponse<Showtime[]>> => {
        return fetcher<ApiResponse<Showtime[]>>(`${BASE_PATH}/auditorium/${auditoriumId}`, {
            method: 'GET',
        });
    },

    getShowtimeById: async (id: number): Promise<ApiResponse<Showtime>> => {
        return fetcher<ApiResponse<Showtime>>(`${BASE_PATH}/${id}`, {
            method: 'GET',
        });
    },

    createShowtimes: async (data: CreateShowtimeRequest): Promise<ApiResponse<Showtime[]>> => {
        return fetcher<ApiResponse<Showtime[]>>(BASE_PATH, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    createShowtime: async (data: ShowtimeRequest): Promise<ApiResponse<Showtime>> => {
        return fetcher<ApiResponse<Showtime>>(BASE_PATH, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateShowtime: async (id: number, data: ShowtimeRequest): Promise<ApiResponse<Showtime>> => {
        return fetcher<ApiResponse<Showtime>>(`${BASE_PATH}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteShowtime: async (id: number): Promise<ApiResponse<null>> => {
        return fetcher<ApiResponse<null>>(`${BASE_PATH}/${id}`, {
            method: 'DELETE',
        });
    },
};
