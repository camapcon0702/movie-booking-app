import { fetcher } from '@/lib/api/fetcher';
import { Seat } from '@/types/seat';
import { ApiResponse } from '@/types/genre';

const BASE_PATH = '/seats';

export const seatApi = {
    // Get seats by auditorium (public)
    getSeatsByAuditorium: async (auditoriumId: number): Promise<ApiResponse<Seat[]>> => {
        return fetcher<ApiResponse<Seat[]>>(`${BASE_PATH}/auditorium/${auditoriumId}`, {
            method: 'GET',
        });
    },

    // Get seat by ID (public)
    getSeatById: async (id: number): Promise<ApiResponse<Seat>> => {
        return fetcher<ApiResponse<Seat>>(`${BASE_PATH}/${id}`, {
            method: 'GET',
        });
    },
    // Get seats by showtime (public)
    getSeatsByShowtime: async (showtimeId: number): Promise<ApiResponse<Seat[]>> => {
        return fetcher<ApiResponse<Seat[]>>(`${BASE_PATH}/showtime/${showtimeId}`, {
            method: 'GET',
        });
    },
};
