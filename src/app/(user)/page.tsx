'use client';

import React, { useEffect, useState } from 'react';
import { MovieCard } from '@/components/movie/MovieCard';
import { Movie } from '@/types/movie';
import { Button } from '@/components/common/Button';
import { ArrowRight, Film } from 'lucide-react';
import Link from 'next/link';
import { movieApi } from '@/lib/api/user/movie';

export default function HomePage() {
  const [nowShowingMovies, setNowShowingMovies] = useState<Movie[]>([]);
  const [comingSoonMovies, setComingSoonMovies] = useState<Movie[]>([]);
  const [isLoadingNowShowing, setIsLoadingNowShowing] = useState(true);
  const [isLoadingComingSoon, setIsLoadingComingSoon] = useState(true);

  useEffect(() => {
    // Fetch Now Showing movies
    const fetchNowShowing = async () => {
      setIsLoadingNowShowing(true);
      try {
        const res = await movieApi.getMoviesByStatus('NOW_SHOWING');
        setNowShowingMovies(res.data.slice(0, 5)); // Limit to 5 for homepage
      } catch (err) {
        console.error('Failed to fetch now showing movies:', err);
      } finally {
        setIsLoadingNowShowing(false);
      }
    };

    // Fetch Coming Soon movies
    const fetchComingSoon = async () => {
      setIsLoadingComingSoon(true);
      try {
        const res = await movieApi.getMoviesByStatus('COMING_SOON');
        setComingSoonMovies(res.data.slice(0, 5)); // Limit to 5 for homepage
      } catch (err) {
        console.error('Failed to fetch coming soon movies:', err);
      } finally {
        setIsLoadingComingSoon(false);
      }
    };

    fetchNowShowing();
    fetchComingSoon();
  }, []);

  return (
    <div className="space-y-12">
      {/* Now Showing Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Phim Đang Chiếu
            </h2>
            <div className="h-1 w-20 bg-primary mt-2 rounded-full"></div>
          </div>
          <Link href="/movies">
            <Button variant="ghost" className="text-primary hover:text-primary-hover">
              Xem tất cả <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoadingNowShowing ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-muted rounded-lg mb-3"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : nowShowingMovies.length === 0 ? (
          <div className="text-center py-12">
            <Film className="mx-auto h-12 w-12 text-gray-600 mb-3" />
            <p className="text-gray-400">Chưa có phim đang chiếu</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {nowShowingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
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
          <Link href="/movies">
            <Button variant="ghost" className="text-primary hover:text-primary-hover">
              Xem tất cả <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoadingComingSoon ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-muted rounded-lg mb-3"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : comingSoonMovies.length === 0 ? (
          <div className="text-center py-12">
            <Film className="mx-auto h-12 w-12 text-gray-600 mb-3" />
            <p className="text-gray-400">Chưa có phim sắp chiếu</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 opacity-80">
            {comingSoonMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
