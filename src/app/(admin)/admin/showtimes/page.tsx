'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { Monitor, AlertTriangle, CalendarClock, Trash2, Plus, X, Edit } from 'lucide-react';
import { showtimeApi } from '@/lib/api/admin/showtime';
import { movieApi } from '@/lib/api/admin/movie';
import { auditoriumApi } from '@/lib/api/admin/auditorium';
import { Showtime } from '@/types/showtime';
import { Movie } from '@/types/movie';
import { Auditorium } from '@/types/auditorium';
import { UpdateShowtimeModal } from '@/components/admin/showtimes/UpdateShowtimeModal';

export default function ShowtimeManagementPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const auditoriumId = searchParams.get('auditoriumId') ? Number(searchParams.get('auditoriumId')) : null;

    // Data states
    const [auditoriums, setAuditoriums] = useState<Auditorium[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);

    // Loading states
    const [isLoadingAuditoriums, setIsLoadingAuditoriums] = useState(true);
    const [isLoadingShowtimes, setIsLoadingShowtimes] = useState(false);
    const [isLoadingMovies, setIsLoadingMovies] = useState(false);

    // Form states
    const [selectedMovieId, setSelectedMovieId] = useState<number>(0);
    const [basePrice, setBasePrice] = useState<number>(0);
    const [startTimes, setStartTimes] = useState<string[]>(['']);
    const [isCreating, setIsCreating] = useState(false);

    // Error states
    const [error, setError] = useState('');
    const [createError, setCreateError] = useState('');

    // Delete state
    const [itemToDelete, setItemToDelete] = useState<Showtime | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Edit state
    const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);

    // Fetch auditoriums on mount
    useEffect(() => {
        const fetchAuditoriums = async () => {
            try {
                const res = await auditoriumApi.getAuditoriums();
                setAuditoriums(res.data);
                setError('');
            } catch {
                setError('Không thể tải danh sách phòng chiếu');
            } finally {
                setIsLoadingAuditoriums(false);
            }
        };
        fetchAuditoriums();
    }, []);

    // Fetch movies when auditorium is selected
    useEffect(() => {
        if (auditoriumId) {
            const fetchMovies = async () => {
                setIsLoadingMovies(true);
                try {
                    const res = await movieApi.getMovies();
                    setMovies(res.data || []);
                } catch {
                    setError('Không thể tải danh sách phim');
                } finally {
                    setIsLoadingMovies(false);
                }
            };
            fetchMovies();
        }
    }, [auditoriumId]);

    // Fetch showtimes when auditorium is selected
    useEffect(() => {
        if (auditoriumId) {
            fetchShowtimes(auditoriumId);
        } else {
            setShowtimes([]);
        }
    }, [auditoriumId]);

    const fetchShowtimes = async (id: number) => {
        setIsLoadingShowtimes(true);
        try {
            const res = await showtimeApi.getShowtimesByAuditorium(id);
            setShowtimes(res.data);
            setError('');
        } catch (err: any) {
            setError(err instanceof Error ? err.message : 'Không thể tải danh sách suất chiếu');
        } finally {
            setIsLoadingShowtimes(false);
        }
    };

    const handleAuditoriumSelect = (id: number) => {
        router.push(`/admin/showtimes?auditoriumId=${id}`);
        // Reset form
        setSelectedMovieId(0);
        setBasePrice(0);
        setStartTimes(['']);
        setCreateError('');
    };

    const handleAddTimeSlot = () => {
        setStartTimes([...startTimes, '']);
    };

    const handleRemoveTimeSlot = (index: number) => {
        if (startTimes.length > 1) {
            setStartTimes(startTimes.filter((_, i) => i !== index));
        }
    };

    const handleTimeChange = (index: number, value: string) => {
        const newTimes = [...startTimes];
        newTimes[index] = value;
        setStartTimes(newTimes);
    };

    const handleCreateShowtimes = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError('');

        // Validation
        if (!auditoriumId) {
            setCreateError('Vui lòng chọn phòng chiếu');
            return;
        }
        if (selectedMovieId === 0) {
            setCreateError('Vui lòng chọn phim');
            return;
        }

        const validTimes = startTimes.filter(t => t.trim() !== '');
        if (validTimes.length === 0) {
            setCreateError('Vui lòng nhập ít nhất một thời gian chiếu');
            return;
        }

        // Check for future times
        const now = new Date();
        const invalidTimes = validTimes.filter(t => new Date(t) < now);
        if (invalidTimes.length > 0) {
            setCreateError('Tất cả thời gian chiếu phải ở tương lai');
            return;
        }

        setIsCreating(true);

        try {
            const payload = {
                movieId: selectedMovieId,
                auditoriumId: auditoriumId,
                basePrice: basePrice,
                // Send datetime-local format directly (YYYY-MM-DDTHH:mm:ss) without UTC conversion
                startTimes: validTimes.map(t => t + ':00') // Add seconds if not present
            };

            await showtimeApi.createShowtimes(payload);

            // Reset form
            setSelectedMovieId(0);
            setBasePrice(0);
            setStartTimes(['']);

            // Refresh showtimes
            fetchShowtimes(auditoriumId);
        } catch (err: any) {
            // Check for conflict error (404 with specific message)
            if (err.message && err.message.includes('Trùng thời gian')) {
                setCreateError(err.message);
            } else {
                setCreateError(err.message || 'Tạo suất chiếu thất bại');
            }
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete || !auditoriumId) return;
        setIsDeleting(true);
        try {
            await showtimeApi.deleteShowtime(itemToDelete.id);
            setItemToDelete(null);
            fetchShowtimes(auditoriumId);
        } catch (err: any) {
            alert(err.message || 'Xóa thất bại');
        } finally {
            setIsDeleting(false);
        }
    };

    const currentAuditorium = auditoriums.find(a => a.id === auditoriumId);
    const selectedMovie = movies.find(m => m.id === selectedMovieId);

    // State 1: No auditorium selected
    if (!auditoriumId) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý Suất Chiếu</h1>
                    <p className="text-gray-400">Chọn phòng chiếu để bắt đầu</p>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 flex items-center">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        {error}
                    </div>
                )}

                {isLoadingAuditoriums ? (
                    <div className="p-8 text-center text-gray-400">Đang tải danh sách phòng...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {auditoriums.map(aud => (
                            <button
                                key={aud.id}
                                onClick={() => handleAuditoriumSelect(aud.id)}
                                className="flex flex-col items-center p-8 bg-card border border-border rounded-lg hover:border-primary transition-all group text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <Monitor className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-white">{aud.name}</h3>
                                <p className="text-sm text-gray-400 mt-2">Nhấn để quản lý suất chiếu</p>
                            </button>
                        ))}
                        {auditoriums.length === 0 && (
                            <div className="col-span-3 text-center p-8 text-gray-500">
                                Chưa có phòng chiếu nào. Hãy tạo phòng chiếu trước.
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // State 2: Auditorium selected - Show showtimes and creation form
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/admin/showtimes')}
                        className="text-gray-400 hover:text-white"
                    >
                        Thay đổi phòng
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center">
                            <Monitor className="mr-2 h-6 w-6 text-primary" />
                            {currentAuditorium ? currentAuditorium.name : `Phòng ${auditoriumId}`}
                        </h1>
                        <p className="text-sm text-gray-400">Quản lý suất chiếu</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Existing Showtimes */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-semibold flex items-center">
                        <CalendarClock className="mr-2 h-5 w-5 text-primary" />
                        Suất chiếu hiện tại
                    </h2>

                    {isLoadingShowtimes ? (
                        <div className="p-8 text-center text-gray-400 border border-border rounded-lg">
                            Đang tải danh sách suất chiếu...
                        </div>
                    ) : showtimes.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 border border-border rounded-lg">
                            Chưa có suất chiếu nào
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {showtimes.map(showtime => (
                                <div
                                    key={showtime.id}
                                    className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
                                >
                                    <div>
                                        <p className="font-semibold text-white">
                                            {showtime.movieName || `Phim #${showtime.movieId}`}
                                        </p>
                                        <p className="text-sm text-primary">
                                            {new Date(showtime.startTime).toLocaleString('vi-VN', {
                                                dateStyle: 'short',
                                                timeStyle: 'short'
                                            })}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Giá cơ bản: {new Intl.NumberFormat('vi-VN').format(showtime.basePrice)}đ
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                                            onClick={() => setEditingShowtime(showtime)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                            onClick={() => setItemToDelete(showtime)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Showtime Form */}
                <div className="lg:col-span-1">
                    <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
                        <h2 className="text-xl font-semibold mb-4">Thêm suất chiếu mới</h2>

                        {createError && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">
                                <AlertTriangle className="inline mr-2 h-4 w-4" />
                                {createError}
                            </div>
                        )}

                        <form onSubmit={handleCreateShowtimes} className="space-y-4">
                            {/* Movie Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Chọn Phim *</label>
                                {isLoadingMovies ? (
                                    <div className="text-sm text-gray-400">Đang tải...</div>
                                ) : (
                                    <select
                                        className="flex h-11 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                        value={selectedMovieId}
                                        onChange={e => setSelectedMovieId(Number(e.target.value))}
                                        required
                                        title="Chọn phim"
                                    >
                                        <option value={0}>-- Chọn phim --</option>
                                        {movies.map(m => (
                                            <option key={m.id} value={m.id}>{m.title}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Base Price */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Giá vé cơ bản (VNĐ) *</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1000"
                                    className="flex h-11 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                    value={basePrice}
                                    onChange={e => setBasePrice(Number(e.target.value))}
                                    required
                                />
                            </div>

                            {/* Start Times */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Thời gian chiếu *</label>
                                {startTimes.map((time, index) => (
                                    <div key={index} className="flex space-x-2">
                                        <input
                                            type="datetime-local"
                                            className="flex h-11 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                            value={time}
                                            onChange={e => handleTimeChange(index, e.target.value)}
                                            required
                                        />
                                        {startTimes.length > 1 && (
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-500 hover:text-red-600"
                                                onClick={() => handleRemoveTimeSlot(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleAddTimeSlot}
                                    className="w-full"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Thêm thời gian
                                </Button>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={isCreating}
                                disabled={selectedMovieId === 0 || isCreating}
                            >
                                Tạo suất chiếu
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {itemToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-sm rounded-lg border border-border shadow-lg p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                                Xóa suất chiếu
                            </h3>
                            <button onClick={() => setItemToDelete(null)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-gray-300 mb-6">
                            Bạn có chắc muốn xóa suất chiếu lúc{' '}
                            <span className="font-bold text-white">
                                {new Date(itemToDelete.startTime).toLocaleString('vi-VN')}
                            </span>
                            ?<br />
                            Hành động này không thể hoàn tác.
                        </p>

                        <div className="flex justify-end space-x-3">
                            <Button variant="ghost" onClick={() => setItemToDelete(null)}>
                                Hủy
                            </Button>
                            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
                                Xóa
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Modal */}
            {editingShowtime && (
                <UpdateShowtimeModal
                    showtime={editingShowtime}
                    movies={movies}
                    onClose={() => setEditingShowtime(null)}
                    onSuccess={() => {
                        setEditingShowtime(null);
                        if (auditoriumId) fetchShowtimes(auditoriumId);
                    }}
                />
            )}
        </div>
    );
}
