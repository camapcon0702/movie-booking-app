import { fetcher } from '@/lib/api/fetcher';
import { Booking, CreateBookingRequest } from '@/types/booking';
import { ApiResponse } from '@/types/genre';

const BASE_PATH = '/bookings';

export const bookingApi = {
    createBooking: async (data: CreateBookingRequest): Promise<ApiResponse<Booking>> => {
        return fetcher<ApiResponse<Booking>>(BASE_PATH, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getMyBookings: async (): Promise<ApiResponse<Booking[]>> => {
        return fetcher<ApiResponse<Booking[]>>(`${BASE_PATH}/me`, {
            method: 'GET',
        });
    },

    getBookingById: async (id: number): Promise<ApiResponse<Booking>> => {
        return fetcher<ApiResponse<Booking>>(`${BASE_PATH}/${id}`, {
            method: 'GET',
        });
    },
};
