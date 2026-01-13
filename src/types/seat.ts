export interface Seat {
    id: number;
    rowChart: string;
    seatNumber: string;
    status: boolean;
    auditoriumId: number;
    seatType: {
        id: number; // This is actually seatPriceId in many contexts, but backend might return object
        seatType: "NORMAL" | "VIP" | "COUPLE";
        price: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateSeatRequest {
    auditoriumId: number;
    rowChart: string; // "A", "B", etc.
    seatNumbers: number[]; // [1, 2, 3]
    seatPriceId: number;
}
