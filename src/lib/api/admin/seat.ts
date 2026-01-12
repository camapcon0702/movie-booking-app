import { fetcher } from '@/lib/api/fetcher';
import { Seat, CreateSeatRequest } from '@/types/seat';
import { ApiResponse } from '@/types/genre'; // Reusing generic ApiResponse

const BASE_PATH = '/admin/seats';

export const seatApi = {
    // 1. Get all seats by Auditorium ID
    getSeatsByAuditorium: async (auditoriumId: number): Promise<ApiResponse<Seat[]>> => {
        return fetcher<ApiResponse<Seat[]>>(`${BASE_PATH}/auditorium/${auditoriumId}`, {
            method: 'GET',
        });
    },

    // 2. Bulk Create Seats
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

    // 4. Update Seat Type
    updateSeatType: async (seatId: number, typeId: number): Promise<ApiResponse<Seat>> => {
        return fetcher<ApiResponse<Seat>>(`${BASE_PATH}/${seatId}/type`, {
            method: 'PUT',
            params: { typeId: typeId.toString() }
        });
    },

    // 5. Generic Update Seat (Deprecated for specific actions, keeping for reference if needed)
    updateSeat: async (seatId: number, data: Partial<{ seatPriceId: number; status: boolean }>): Promise<ApiResponse<Seat>> => {
        // Fallback or legacy support if needed, but preferable to use specific methods
        // User requested specific endpoint for type update.
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
