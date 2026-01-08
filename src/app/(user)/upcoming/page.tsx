import React from 'react';
import { MovieCard } from '@/components/movie/MovieCard';

// Using same mock type for simplicity
const MOCK_UPCOMING = [
  {
    id: '5',
    title: 'Civil War',
    posterUrl: 'https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg', // Placeholder
    description: 'A journey across a dystopian future America.',
    durationMinutes: 109,
    releaseDate: '2024-04-12',
    rating: 0,
    genres: ['Action', 'Thriller'],
    status: 'COMING_SOON',
  },
  {
    id: '6',
    title: 'Furiosa: A Mad Max Saga',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    description: 'The origin story of renegade warrior Furiosa.',
    durationMinutes: 120,
    releaseDate: '2024-05-24',
    rating: 0,
    genres: ['Action', 'Sci-Fi'],
    status: 'COMING_SOON',
  }
];

export default function UpcomingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Phim Sắp Chiếu
        </h1>
        <p className="text-gray-400 mt-2">Đặt vé sớm để nhận nhiều ưu đãi</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {/* @ts-expect-error Mock data type alignment */}
          {MOCK_UPCOMING.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
      </div>
    </div>
  );
}
