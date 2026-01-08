import React from 'react';
import { MovieCard } from '@/components/movie/MovieCard';
import { Movie } from '@/types/movie';
import { Button } from '@/components/common/Button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Mock Data
const MOCK_NOW_SHOWING: Movie[] = [
  {
    id: '1',
    title: 'Mai',
    posterUrl: 'https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg', // Placeholder
    description: 'Mai is a 2024 Vietnamese romantic drama film...',
    durationMinutes: 131,
    releaseDate: '2024-02-10',
    rating: 8.5,
    genres: ['Romance', 'Drama'],
    status: 'NOW_SHOWING',
  },
  {
    id: '2',
    title: 'Dune: Part Two',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    description: 'Paul Atreides unites with Chani and the Fremen...',
    durationMinutes: 166,
    releaseDate: '2024-03-01',
    rating: 9.0,
    genres: ['Sci-Fi', 'Adventure'],
    status: 'NOW_SHOWING',
  },
  {
    id: '3',
    title: 'Kung Fu Panda 4',
    posterUrl: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
    description: 'Po is gearing up to become the spiritual leader...',
    durationMinutes: 94,
    releaseDate: '2024-03-08',
    rating: 7.8,
    genres: ['Animation', 'Action'],
    status: 'NOW_SHOWING',
  },
  {
    id: '4',
    title: 'Godzilla x Kong: The New Empire',
    posterUrl: 'https://image.tmdb.org/t/p/w500/tMefBSflR6PGQLv7WvFPpKLZkyk.jpg',
    description: 'Godzilla and King Kong must fight to protect their existence.',
    durationMinutes: 115,
    releaseDate: '2024-03-29',
    rating: 7.5,
    genres: ['Action', 'Sci-Fi'],
    status: 'NOW_SHOWING',
  }
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section / Banner implementation could go here */}
      
      {/* Now Showing Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
             <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Phim Đang Chiếu
            </h2>
            <div className="h-1 w-20 bg-primary mt-2 rounded-full"></div>
          </div>
          <Link href="/now-showing">
            <Button variant="ghost" className="text-primary hover:text-primary-hover">
              Xem tất cả <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {MOCK_NOW_SHOWING.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
      
       {/* Upcoming Section Preview */}
       <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
             <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Phim Sắp Chiếu
            </h2>
            <div className="h-1 w-20 bg-primary mt-2 rounded-full"></div>
          </div>
          <Link href="/upcoming">
            <Button variant="ghost" className="text-primary hover:text-primary-hover">
              Xem tất cả <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        {/* Potentially a carousel or list here, reusing MovieCard */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 opacity-80">
           {/* Reusing mocks for demo purposes, logically would be different movies */}
           {MOCK_NOW_SHOWING.slice(0, 3).map((movie) => (
            <MovieCard key={`up-${movie.id}`} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
}
