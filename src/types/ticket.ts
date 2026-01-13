import { Seat } from "./seat";
import { Booking } from "./booking";

// Adjust based on actual backend response if needed
export interface Ticket {
    id: number;
    bookingId: number;
    seatId: number;
    price: number;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    // Relationships likely included
    seat: Seat;
    booking: Booking & {
        showtime: {
            id: number;
            startTime: string;
            endTime: string;
            movie: {
                id: number;
                title: string;
                posterUrl?: string;
                ageRating?: string;
                durationMinutes?: number;
            };
            auditorium: {
                id: number;
                name: string;
                cinema: {
                    name: string;
                    address: string;
                };
            };
        };
    };
}
