import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/common/Button';
import { Calendar, Clock, Star, Play, Info } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Mock Data Fetcher (simulate API)
const getMovieById = (id: string) => {
  // Return dummy data based on ID
  return {
    id,
    title: 'Mai',
    posterUrl: 'https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/4bf37R07t17tCccV6Z5g5L2a6e.jpg', // Placeholder banner
    description: 'Mai is a 2024 Vietnamese romantic drama film directed by Trấn Thành. The film revolves around the life of Mai, a nearly 40-year-old woman who encounters an old neighbor named Dương. Shows the complexities of love, family, and societal expectations in modern Vietnam.',
    durationMinutes: 131,
    releaseDate: '2024-02-10',
    rating: 8.5,
    genres: ['Romance', 'Drama'],
    director: 'Trấn Thành',
    cast: ['Phương Anh Đào', 'Tuấn Trần', 'Trấn Thành'],
    status: 'NOW_SHOWING',
    trailerUrl: 'https://www.youtube.com/watch?v=VO0Tjk868Bk',
  };
};

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = getMovieById(id);

  if (!movie) {
    not_found();
  }

  return (
    <div className="-mt-8 space-y-8 animate-in fade-in duration-500">
      {/* Banner / Backdrop */}
      <div className="relative w-full h-[60vh] md:h-[70vh]">
        <div className="absolute inset-0">
          <Image
            src={movie.bannerUrl || movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 h-full relative flex items-end pb-12">
            <div className="flex flex-col md:flex-row gap-8 items-end">
                {/* Poster floating */}
                <div className="hidden md:block w-64 aspect-[2/3] relative rounded-xl overflow-hidden shadow-2xl border-4 border-card/50">
                    <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    />
                </div>

                {/* Info Text */}
                <div className="space-y-4 max-w-2xl mb-4">
                    <div className="flex flex-wrap gap-2 text-sm font-medium text-primary">
                        {movie.genres.map(g => (
                            <span key={g} className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20 backdrop-blur-sm">
                                {g}
                            </span>
                        ))}
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white text-glow">
                        {movie.title}
                    </h1>

                    <div className="flex flex-wrap gap-6 text-gray-300 text-sm md:text-base items-center">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span>{movie.releaseDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            <span>{movie.durationMinutes} phút</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            <span className="text-white font-bold">{movie.rating}/10</span>
                        </div>
                    </div>

                     <div className="flex gap-4 pt-4">
                        <Link href={`/booking?movieId=${movie.id}`}>
                            <Button size="lg" className="px-8 text-lg shadow-primary/25 shadow-xl">
                                Đặt Vé Ngay
                            </Button>
                        </Link>
                        {movie.trailerUrl && (
                             <Button variant="outline" size="lg" className="px-6 gap-2">
                                <Play className="w-5 h-5" /> Xem Trailer
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
              <section className="space-y-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                      <Info className="text-primary" />
                      Nội Dung Phim
                   </h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                      {movie.description}
                  </p>
              </section>

              <section className="space-y-4">
                   <h3 className="text-2xl font-bold">Diễn Viên & Đạo Diễn</h3>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       <div className="p-4 rounded-lg bg-card border border-border">
                           <p className="text-sm text-gray-500 mb-1">Đạo Diễn</p>
                           <p className="font-medium">{movie.director}</p>
                       </div>
                       {movie.cast?.map((actor) => (
                           <div key={actor} className="p-4 rounded-lg bg-card border border-border">
                               <p className="text-sm text-gray-500 mb-1">Diễn Viên</p>
                               <p className="font-medium">{actor}</p>
                           </div>
                       ))}
                   </div>
              </section>
          </div>

          {/* Sidebar (Optional: Could be showtimes or related movies) */}
          <div className="lg:col-span-1 space-y-6">
               <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="text-xl font-bold mb-4">Thông Tin Thêm</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex justify-between">
                            <span className="text-gray-400">Kiểm duyệt</span>
                            <span>T16</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-gray-400">Ngôn ngữ</span>
                            <span>Tiếng Việt</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-gray-400">Định dạng</span>
                            <span>2D, 3D, IMAX</span>
                        </li>
                    </ul>
               </div>
          </div>
      </div>
    </div>
  );
}
