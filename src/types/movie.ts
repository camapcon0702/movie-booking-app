export interface Movie {
    id: string;
    title: string;
    posterUrl: string;
    bannerUrl?: string; // Large landscape image
    description: string;
    durationMinutes: number;
    releaseDate: string;
    rating?: number;
    trailerUrl?: string;
    genres: string[];
    director?: string;
    cast?: string[];
    status: 'NOW_SHOWING' | 'COMING_SOON' | 'ENDED';
}

export interface Genre {
    id: string;
    name: string;
}

export interface Auditorium {
    id: string;
    name: string; // e.g. "Cinema 1"
    totalSeats: number;
    rows: number;
    columns: number;
}

export interface Showtime {
    id: string;
    movieId: string;
    auditoriumId: string;
    auditoriumName: string; // denormalized for convenience
    startTime: string; // ISO 8601
    endTime: string;
    priceCheck: number; // Base price
}
