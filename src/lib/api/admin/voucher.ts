import { fetcher } from '@/lib/api/fetcher';
import { Voucher, VoucherRequest } from '@/types/voucher';
import { ApiResponse } from '@/types/genre';

const BASE_PATH = '/admin/vouchers';

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

    createVoucher: async (data: VoucherRequest): Promise<ApiResponse<Voucher>> => {
        return fetcher<ApiResponse<Voucher>>(BASE_PATH, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateVoucher: async (id: number, data: VoucherRequest): Promise<ApiResponse<Voucher>> => {
        return fetcher<ApiResponse<Voucher>>(`${BASE_PATH}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteVoucher: async (id: number): Promise<ApiResponse<null>> => {
        return fetcher<ApiResponse<null>>(`${BASE_PATH}/${id}`, {
            method: 'DELETE',
        });
    },
};
