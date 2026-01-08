// Imports removed as they were referenced only by ID in the interfaces below

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

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface Booking {
    id: string;
    userId: string;
    showtimeId: string;
    bookingTime: string;
    status: BookingStatus;
    totalAmount: number;

    // Denormalized details
    movieTitle: string;
    moviePoster: string;
    showtimeStart: string;
    seats: string[]; // "A1", "A2"
    qrCode?: string;
}

export interface Voucher {
    id: string;
    code: string;
    discountPercentage?: number;
    discountAmount?: number;
    minSpend?: number;
    validUntil: string;
}
