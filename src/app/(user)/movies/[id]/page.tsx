'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { movieApi } from '@/lib/api/user/movie';
import { Movie } from '@/types/movie';
import { Clock, Calendar, Star, Film, ShoppingCart, Play, Info } from 'lucide-react';
import { storage } from '@/lib/auth/storage';
import { Button } from '@/components/common/Button';

export default function MovieDetailPage() {
    const params = useParams();
    const router = useRouter();
    const movieId = Number(params.id);

    const [movie, setMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMovie = async () => {
            setIsLoading(true);
            try {
                const res = await movieApi.getMovieById(movieId);
                setMovie(res.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Không thể tải thông tin phim');
            } finally {
                setIsLoading(false);
            }
        };
        fetchMovie();
    }, [movieId]);

    const handleBuyTicket = () => {
        const token = storage.getToken();
        if (!token) {
            // Alert user before redirecting
            alert('Vui lòng đăng nhập để tiếp tục đặt vé!');
            // Redirect to login with return URL
            router.push(`/login?redirect=/booking/${movieId}`);
        } else {
            // Navigate to booking flow
            router.push(`/booking/${movieId}`);
        }
    };

    if (isLoading) {
        return (
            <div className="-mt-8 space-y-8 animate-in fade-in duration-500">
                <div className="relative w-full h-[60vh] md:h-[70vh] bg-muted animate-pulse"></div>
                <div className="container mx-auto px-4">
                    <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-1/4 mb-8"></div>
                    <div className="h-32 bg-muted rounded"></div>
                </div>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Film className="mx-auto h-16 w-16 text-gray-600 mb-4" />
                    <p className="text-gray-400 text-lg">{error || 'Không tìm thấy phim'}</p>
                </div>
            </div>
        );
    }

    const canBuyTicket = movie.status === 'NOW_SHOWING';

    const formatDate = (dateString: string) => {
        try {
            // Handle DD-MM-YYYY format specifically
            if (dateString.includes('-') && dateString.split('-')[2]?.length === 4) {
                const [d, m, y] = dateString.split('-');
                return new Date(`${y}-${m}-${d}`).toLocaleDateString('vi-VN');
            }
            // Fallback for ISO or other valid formats
            return new Date(dateString).toLocaleDateString('vi-VN');
        } catch {
            return dateString;
        }
    };

    return (
        <div className="-mt-8 space-y-8 animate-in fade-in duration-500">
            {/* Banner / Backdrop */}
            <div className="relative w-full h-[60vh] md:h-[70vh]">
                <div className="absolute inset-0">
                    {movie.posterUrl ? (
                        <>
                            <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
                        </>
                    ) : (
                        <div className="w-full h-full bg-muted"></div>
                    )}
                </div>

                <div className="container mx-auto px-4 h-full relative flex items-end pb-12">
                    <div className="flex flex-col md:flex-row gap-8 items-end">
                        {/* Poster floating */}
                        <div className="hidden md:block w-64 aspect-[2/3] relative rounded-xl overflow-hidden shadow-2xl border-4 border-card/50">
                            {movie.posterUrl ? (
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                    <Film className="h-16 w-16 text-gray-600" />
                                </div>
                            )}
                        </div>

                        {/* Info Text */}
                        <div className="space-y-4 max-w-2xl mb-4">
                            {movie.genres && movie.genres.length > 0 && (
                                <div className="flex flex-wrap gap-2 text-sm font-medium text-primary">
                                    {movie.genres.map((genreName, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20 backdrop-blur-sm"
                                        >
                                            {genreName}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <h1 className="text-4xl md:text-6xl font-extrabold text-white text-glow">
                                {movie.title}
                            </h1>

                            <div className="flex flex-wrap gap-6 text-gray-300 text-sm md:text-base items-center">
                                {movie.releaseDate && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-primary" />
                                        <span>{formatDate(movie.releaseDate)}</span>
                                    </div>
                                )}
                                {movie.durationMinutes && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-primary" />
                                        <span>{movie.durationMinutes} phút</span>
                                    </div>
                                )}
                                {movie.starNumber && (
                                    <div className="flex items-center gap-2">
                                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                        <span className="text-white font-bold">{movie.starNumber}/10</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 pt-4">
                                {canBuyTicket ? (
                                    <Button
                                        onClick={handleBuyTicket}
                                        size="lg"
                                        className="px-8 text-lg shadow-primary/25 shadow-xl"
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        Đặt Vé Ngay
                                    </Button>
                                ) : (
                                    <Button
                                        disabled
                                        size="lg"
                                        className="px-8 text-lg opacity-50 cursor-not-allowed"
                                        title="Phim chưa được chiếu"
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        Chưa mở bán
                                    </Button>
                                )}
                                {movie.trailerUrl && (
                                    <Link href={movie.trailerUrl} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="lg" className="px-6 gap-2">
                                            <Play className="w-5 h-5" /> Xem Trailer
                                        </Button>
                                    </Link>
                                )}
                            </div>
                            {!canBuyTicket && (
                                <p className="text-sm text-gray-400">
                                    Phim sẽ sớm được chiếu. Vui lòng quay lại sau!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    {movie.description && (
                        <section className="space-y-4">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <Info className="text-primary" />
                                Nội Dung Phim
                            </h3>
                            <p className="text-gray-300 leading-relaxed text-lg">{movie.description}</p>
                        </section>
                    )}

                    {/* Trailer section removed as per request */}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card rounded-xl p-6 border border-border">
                        <h3 className="text-xl font-bold mb-4">Thông Tin Phim</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex justify-between">
                                <span className="text-gray-400">Trạng thái</span>
                                <span className={movie.status === 'NOW_SHOWING' ? 'text-green-500' : 'text-yellow-500'}>
                                    {movie.status === 'NOW_SHOWING' ? 'Đang chiếu' : 'Sắp chiếu'}
                                </span>
                            </li>
                            {movie.releaseDate && (
                                <li className="flex justify-between">
                                    <span className="text-gray-400">Ngày phát hành</span>
                                    <span>{formatDate(movie.releaseDate)}</span>
                                </li>
                            )}
                            {movie.durationMinutes && (
                                <li className="flex justify-between">
                                    <span className="text-gray-400">Thời lượng</span>
                                    <span>{movie.durationMinutes} phút</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
