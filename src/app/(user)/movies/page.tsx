'use client';

import React, { useEffect, useState } from 'react';
import { movieApi } from '@/lib/api/user/movie';
import { genreApi } from '@/lib/api/user/genre';
import { Movie, MovieStatus } from '@/types/movie';
import { Genre } from '@/types/genre';
import { Search, Film } from 'lucide-react';
import Link from 'next/link';

export default function MoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [activeTab, setActiveTab] = useState<MovieStatus>('NOW_SHOWING');
    const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch genres on mount
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await genreApi.getGenres();
                setGenres(res.data);
            } catch (err) {
                console.error('Failed to fetch genres:', err);
            }
        };
        fetchGenres();
    }, []);

    // Fetch movies based on filters
    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            setError('');
            try {
                let res;
                if (searchKeyword) {
                    res = await movieApi.searchMovies(searchKeyword);
                } else if (selectedGenre) {
                    res = await movieApi.getMoviesByGenre(selectedGenre);
                } else {
                    res = await movieApi.getMoviesByStatus(activeTab);
                }
                setMovies(res.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Không thể tải danh sách phim');
            } finally {
                setIsLoading(false);
            }
        };
        fetchMovies();
    }, [activeTab, selectedGenre, searchKeyword]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const handleTabChange = (tab: MovieStatus) => {
        setActiveTab(tab);
        setSelectedGenre(null);
        setSearchKeyword('');
    };

    const handleGenreChange = (genreId: number | null) => {
        setSelectedGenre(genreId);
        setSearchKeyword('');
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Phim</h1>
                    <p className="text-gray-400">Khám phá những bộ phim đang chiếu và sắp chiếu</p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-6 border-b border-border">
                    <button
                        onClick={() => handleTabChange('NOW_SHOWING')}
                        className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'NOW_SHOWING'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Đang chiếu
                    </button>
                    <button
                        onClick={() => handleTabChange('COMING_SOON')}
                        className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'COMING_SOON'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Sắp chiếu
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm phim..."
                                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                            />
                        </div>
                    </form>

                    {/* Genre Filter */}
                    <select
                        className="px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        value={selectedGenre || ''}
                        onChange={(e) => handleGenreChange(e.target.value ? Number(e.target.value) : null)}
                        title="Lọc theo thể loại"
                    >
                        <option value="">Tất cả thể loại</option>
                        {genres.map((genre) => (
                            <option key={genre.id} value={genre.id}>
                                {genre.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Error */}
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 mb-6">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[2/3] bg-muted rounded-lg mb-3"></div>
                                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-muted rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : movies.length === 0 ? (
                    <div className="text-center py-16">
                        <Film className="mx-auto h-16 w-16 text-gray-600 mb-4" />
                        <p className="text-gray-400 text-lg">Không tìm thấy phim nào</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {movies.map((movie) => (
                            <Link
                                key={movie.id}
                                href={`/movies/${movie.id}`}
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3 bg-muted">
                                    {movie.posterUrl ? (
                                        <img
                                            src={movie.posterUrl}
                                            alt={movie.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Film className="h-16 w-16 text-gray-600" />
                                        </div>
                                    )}
                                    {/* Status Badge */}
                                    <div className="absolute top-2 right-2">
                                        <span
                                            className={`px-2 py-1 text-xs font-semibold rounded ${movie.status === 'NOW_SHOWING'
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-yellow-500 text-black'
                                                }`}
                                        >
                                            {movie.status === 'NOW_SHOWING' ? 'Đang chiếu' : 'Sắp chiếu'}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="font-semibold text-white group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                    {movie.title}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {movie.duration ? `${movie.duration} phút` : 'Chưa rõ'}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
