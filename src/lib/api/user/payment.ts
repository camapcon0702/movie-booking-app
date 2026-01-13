import { fetcher } from '@/lib/api/fetcher';

interface PaymentResponse {
    success: boolean;
    payUrl?: string;
    result?: number;
    message: string;
}

export const paymentApi = {
    payWithMomo: async (bookingId: number): Promise<PaymentResponse> => {
        return fetcher<PaymentResponse>(`/booking/${bookingId}/momo`, {
            method: 'POST',
        });
    },

    payWithCash: async (bookingId: number): Promise<PaymentResponse> => {
        return fetcher<PaymentResponse>(`/booking/${bookingId}/Cash`, {
            method: 'POST',
        });
    },
};
