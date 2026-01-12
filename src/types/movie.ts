export type MovieStatus = "NOW_SHOWING" | "COMING_SOON" | "STOP_SHOWING";

export interface Movie {
    id: number;
    title: string;
    description: string;
    durationMinutes: number;
    releaseDate: string;
    posterUrl?: string;
    trailerUrl?: string;
    status: MovieStatus;
    starNumber: number;
    genres: string[];
}

export interface MovieRequest {
    title: string;
    description: string;
    durationMinutes: number;
    releaseDate: string;
    trailerUrl?: string;
    status: MovieStatus;
    starNumber: number;
    genreIds: number[];
}
