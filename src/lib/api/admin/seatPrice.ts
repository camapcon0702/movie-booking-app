import { fetcher } from '@/lib/api/fetcher';
import { SeatPrice, SeatPriceRequest } from '@/types/seat-price';
import { ApiResponse } from '@/types/genre'; // Reusing generic ApiResponse

const BASE_PATH = '/admin/seat-prices';

export const seatPriceApi = {
    getAllSeatPrices: async (): Promise<ApiResponse<SeatPrice[]>> => {
        return fetcher<ApiResponse<SeatPrice[]>>(BASE_PATH, {
            method: 'GET',
        });
    },

    getSeatPriceById: async (id: number): Promise<ApiResponse<SeatPrice>> => {
        return fetcher<ApiResponse<SeatPrice>>(`${BASE_PATH}/${id}`, {
            method: 'GET',
        });
    },

    createSeatPrice: async (data: SeatPriceRequest): Promise<ApiResponse<SeatPrice>> => {
        return fetcher<ApiResponse<SeatPrice>>(BASE_PATH, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateSeatPrice: async (id: number, data: SeatPriceRequest): Promise<ApiResponse<SeatPrice>> => {
        return fetcher<ApiResponse<SeatPrice>>(`${BASE_PATH}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteSeatPrice: async (id: number): Promise<ApiResponse<null>> => {
        return fetcher<ApiResponse<null>>(`${BASE_PATH}/${id}`, {
            method: 'DELETE',
        });
    },
};
