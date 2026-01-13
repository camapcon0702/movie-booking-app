import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Film } from 'lucide-react';
import { Movie } from '@/types/movie';
import { cn } from '@/lib/utils/cn';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export const MovieCard = ({ movie, className }: MovieCardProps) => {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className={cn("group relative block rounded-xl overflow-hidden bg-card transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/20", className)}
    >
      <div className="aspect-[2/3] relative w-full overflow-hidden">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Film className="h-16 w-16 text-gray-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full py-2 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-hover">
            Đặt Vé Ngay
          </button>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-bold text-lg truncate text-white group-hover:text-primary transition-colors">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-white font-medium">{movie.starNumber || 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{movie.durationMinutes || 0}p</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 truncate">
          {movie.genres?.join(', ') || 'N/A'}
        </div>
      </div>
    </Link>
  );
};
