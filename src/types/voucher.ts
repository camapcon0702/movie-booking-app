export interface Voucher {
    id: number;
    code: string;
    discountAmount?: number;
    discountPercentage?: number;
    discountMax?: number;
    expiryDate: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface VoucherRequest {
    code: string;
    discountAmount?: number;
    discountPercentage?: number;
    discountMax?: number;
    expiryDate: string;
    active: boolean;
}
