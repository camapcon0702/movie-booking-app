export type SeatType = "COUPLE" | "NORMAL" | "VIP";

export interface SeatPrice {
    id: number;
    seatType: SeatType;
    price: number;
    createdAt: string;
    updatedAt: string;
}

export interface SeatPriceRequest {
    seatType: SeatType;
    price: number;
}
