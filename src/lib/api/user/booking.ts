import { fetcher } from '@/lib/api/fetcher';
import { Booking, CreateBookingRequest } from '@/types/booking';
import { ApiResponse } from '@/types/genre';

const BASE_PATH = '/bookings';

export const bookingApi = {
    // Create booking (requires auth)
    createBooking: async (data: CreateBookingRequest): Promise<ApiResponse<Booking>> => {
        return fetcher<ApiResponse<Booking>>(BASE_PATH, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Get user's bookings (requires auth)
    getMyBookings: async (): Promise<ApiResponse<Booking[]>> => {
        return fetcher<ApiResponse<Booking[]>>(`${BASE_PATH}/me`, {
            method: 'GET',
        });
    },

    // Get booking by ID (requires auth)
    getBookingById: async (id: number): Promise<ApiResponse<Booking>> => {
        return fetcher<ApiResponse<Booking>>(`${BASE_PATH}/${id}`, {
            method: 'GET',
        });
    },
};
