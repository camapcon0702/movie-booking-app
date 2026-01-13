import { fetcher } from '@/lib/api/fetcher';
import { Seat } from '@/types/seat';
import { ApiResponse } from '@/types/genre';

const BASE_PATH = '/seats';

export const seatApi = {
    getSeatsByAuditorium: async (auditoriumId: number): Promise<ApiResponse<Seat[]>> => {
        return fetcher<ApiResponse<Seat[]>>(`${BASE_PATH}/auditorium/${auditoriumId}`, {
            method: 'GET',
        });
    },

    getSeatById: async (id: number): Promise<ApiResponse<Seat>> => {
        return fetcher<ApiResponse<Seat>>(`${BASE_PATH}/${id}`, {
            method: 'GET',
        });
    },
    getSeatsByShowtime: async (showtimeId: number): Promise<ApiResponse<Seat[]>> => {
        return fetcher<ApiResponse<Seat[]>>(`${BASE_PATH}/showtime/${showtimeId}`, {
            method: 'GET',
        });
    },
};
