import { fetcher } from '@/lib/api/fetcher';
import { Voucher } from '@/types/voucher';
import { ApiResponse } from '@/types/genre';

const BASE_PATH = '/vouchers';

export const voucherApi = {
    getVouchers: async (): Promise<ApiResponse<Voucher[]>> => {
        return fetcher<ApiResponse<Voucher[]>>(BASE_PATH, {
            method: 'GET',
        });
    },

    getVoucherById: async (id: number): Promise<ApiResponse<Voucher>> => {
        return fetcher<ApiResponse<Voucher>>(`${BASE_PATH}/${id}`, {
            method: 'GET',
        });
    },
};
