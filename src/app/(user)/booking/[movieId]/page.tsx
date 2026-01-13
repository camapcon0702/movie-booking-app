'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { showtimeApi } from '@/lib/api/user/showtime';
import { movieApi } from '@/lib/api/user/movie';
import { Showtime } from '@/types/showtime';
import { Movie } from '@/types/movie';
import { Calendar, Clock, MapPin, ChevronRight, Film } from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function SelectShowtimePage() {
    const params = useParams();
    const router = useRouter();
    const movieId = Number(params.movieId);

    const [movie, setMovie] = useState<Movie | null>(null);
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch movie details and showtimes in parallel
                const [movieRes, showtimesRes] = await Promise.all([
                    movieApi.getMovieById(movieId),
                    showtimeApi.getShowtimesByMovie(movieId),
                ]);
                setMovie(movieRes.data);
                setShowtimes(showtimesRes.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Không thể tải thông tin');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [movieId]);

    // Group showtimes by date
    const showtimesByDate = showtimes.reduce((acc, showtime) => {
        const date = new Date(showtime.startTime).toLocaleDateString('vi-VN');
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(showtime);
        return acc;
    }, {} as Record<string, Showtime[]>);

    const handleSelectShowtime = (showtimeId: number) => {
        router.push(`/booking/${movieId}/showtime/${showtimeId}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-muted rounded w-1/3"></div>
                        <div className="h-32 bg-muted rounded"></div>
                        <div className="h-64 bg-muted rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Film className="mx-auto h-16 w-16 text-gray-600 mb-4" />
                    <p className="text-gray-400 text-lg">{error || 'Không tìm thấy phim'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Movie Info Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        {movie.posterUrl && (
                            <div className="w-24 h-36 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                {movie.durationMinutes && (
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{movie.durationMinutes} phút</span>
                                    </div>
                                )}
                                {movie.genres && movie.genres.length > 0 && (
                                    <span>{movie.genres.join(', ')}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Showtimes Section */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Chọn Suất Chiếu</h2>

                    {Object.keys(showtimesByDate).length === 0 ? (
                        <div className="text-center py-12 bg-card rounded-lg border border-border">
                            <Calendar className="mx-auto h-12 w-12 text-gray-600 mb-3" />
                            <p className="text-gray-400">Chưa có suất chiếu nào</p>
                        </div>
                    ) : (
                        Object.entries(showtimesByDate).map(([date, times]) => (
                            <div key={date} className="bg-card rounded-lg border border-border p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-semibold text-white">{date}</h3>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {times.map((showtime) => {
                                        const startTime = new Date(showtime.startTime);
                                        const timeString = startTime.toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        });

                                        return (
                                            <Button
                                                key={showtime.id}
                                                onClick={() => handleSelectShowtime(showtime.id)}
                                                variant="outline"
                                                className="flex flex-col items-center justify-center py-4 h-auto hover:bg-primary hover:text-white hover:border-primary transition-all"
                                            >
                                                <Clock className="h-4 w-4 mb-1" />
                                                <span className="font-semibold">{timeString}</span>
                                                {showtime.basePrice > 0 && (
                                                    <span className="text-xs mt-1 opacity-70">
                                                        {new Intl.NumberFormat('vi-VN').format(showtime.basePrice)}đ
                                                    </span>
                                                )}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Info Note */}
                <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-gray-300">
                            <p className="font-semibold mb-1">Lưu ý:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Vui lòng đến trước giờ chiếu 15 phút để làm thủ tục</li>
                                <li>Giá vé có thể thay đổi tùy theo loại ghế</li>
                                <li>Chọn suất chiếu để tiếp tục đặt vé</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
