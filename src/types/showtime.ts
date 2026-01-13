import { Movie } from './movie';
import { Auditorium } from './auditorium';

export interface Showtime {
    id: number;
    movieId: number;
    auditoriumId: number;
    basePrice: number;
    startTime: string;
    createdAt: string;
    updatedAt: string;
    // Optional expanded matching backend response usually?
    // But based on strict types request:
    movie?: Movie;
    auditorium?: Auditorium;
}

export interface ShowtimeRequest {
    movieId: number;
    auditoriumId: number;
    basePrice: number;
    startTime: string;
}
