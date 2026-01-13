import { Movie } from './movie';
import { Auditorium } from './auditorium';

export interface Showtime {
    id: number;
    movieId: number;
    auditoriumId: number;
    movieName: string; // Backend returns movie name directly
    basePrice: number;
    startTime: string; // ISO-8601 format
    createdAt: string;
    updatedAt: string;
    // Optional expanded relations (may not be populated)
    movie?: Movie;
    auditorium?: Auditorium;
}

// Bulk creation request (new requirement)
export interface CreateShowtimeRequest {
    movieId: number;
    auditoriumId: number;
    basePrice: number;
    startTimes: string[]; // Array of ISO-8601 datetime strings
}

// Legacy single showtime request (keep for backward compatibility)
export interface ShowtimeRequest {
    movieId: number;
    auditoriumId: number;
    basePrice: number;
    startTime: string;
}
