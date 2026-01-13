import { fetcher } from '@/lib/api/fetcher';
import { Voucher } from '@/types/voucher';
import { ApiResponse } from '@/types/genre';

const BASE_PATH = '/vouchers';

export const voucherApi = {
    // Get all vouchers (public)
    getVouchers: async (): Promise<ApiResponse<Voucher[]>> => {
        return fetcher<ApiResponse<Voucher[]>>(BASE_PATH, {
            method: 'GET',
        });
    },

    // Get voucher by ID (public)
    getVoucherById: async (id: number): Promise<ApiResponse<Voucher>> => {
        return fetcher<ApiResponse<Voucher>>(`${BASE_PATH}/${id}`, {
            method: 'GET',
        });
    },
};
