// Backend-compatible booking types for user API

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface BookingTicket {
    id: number;
    price: number;
    seatName: string;
    auditoriumName: string;
    status: string;
}

export interface OrderedFood {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

export interface FoodOrder {
    foodId: number;
    quantity: number;
}

export interface Booking {
    id: number;
    total: number;
    nameMovie: string;
    startTime: string;
    status: BookingStatus;
    tickets: BookingTicket[];
    orderedFoods: OrderedFood[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateBookingRequest {
    showtimeId: number;
    voucherId?: number;
    seatId: number[];
    orders: FoodOrder[];
}

// Legacy types (kept for compatibility if needed)
export type SeatType = 'STANDARD' | 'VIP' | 'COUPLE';
export type SeatStatus = 'AVAILABLE' | 'BOOKED' | 'LOCKED' | 'SELECTED';

export interface Seat {
    id: string;
    row: string; // A, B, C...
    number: number;
    type: SeatType;
    price: number;
    status: SeatStatus;
    x: number; // Grid coordinates for rendering if needed
    y: number;
}

export interface FoodItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
}

export interface SelectedFood {
    itemId: string;
    quantity: number;
    name: string;
    price: number;
}

export interface Voucher {
    id: string;
    code: string;
    discountPercentage?: number;
    discountAmount?: number;
    minSpend?: number;
    validUntil: string;
}
