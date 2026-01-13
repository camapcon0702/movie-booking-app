import { fetcher } from '@/lib/api/fetcher';
import { Seat, CreateSeatRequest } from '@/types/seat';
import { ApiResponse } from '@/types/genre'; // Reusing generic ApiResponse

const BASE_PATH = '/admin/seats';

export const seatApi = {
    getSeatsByAuditorium: async (auditoriumId: number): Promise<ApiResponse<Seat[]>> => {
        return fetcher<ApiResponse<Seat[]>>(`${BASE_PATH}/auditorium/${auditoriumId}`, {
            method: 'GET',
        });
    },

    createSeats: async (data: CreateSeatRequest): Promise<ApiResponse<Seat[]>> => {
        return fetcher<ApiResponse<Seat[]>>(BASE_PATH, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateSeatStatus: async (seatId: number, status: boolean): Promise<ApiResponse<Seat>> => {
        return fetcher<ApiResponse<Seat>>(`${BASE_PATH}/${seatId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },

    updateSeatType: async (seatId: number, typeId: number): Promise<ApiResponse<Seat>> => {
        return fetcher<ApiResponse<Seat>>(`${BASE_PATH}/${seatId}/type`, {
            method: 'PUT',
            params: { typeId: typeId.toString() }
        });
    },

    updateSeat: async (seatId: number, data: Partial<{ seatPriceId: number; status: boolean }>): Promise<ApiResponse<Seat>> => {
        if (data.seatPriceId) {
            return seatApi.updateSeatType(seatId, data.seatPriceId);
        }
        return fetcher<ApiResponse<Seat>>(`${BASE_PATH}/${seatId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteSeat: async (seatId: number): Promise<ApiResponse<null>> => {
        return fetcher<ApiResponse<null>>(`${BASE_PATH}/${seatId}`, {
            method: 'DELETE',
        });
    },
};
