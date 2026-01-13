'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Plus, Edit, Trash2, X, AlertTriangle, CalendarClock } from 'lucide-react';
import { showtimeApi } from '@/lib/api/admin/showtime';
import { movieApi } from '@/lib/api/admin/movie';
import { auditoriumApi } from '@/lib/api/admin/auditorium';
import { Showtime } from '@/types/showtime';
import { Movie } from '@/types/movie';
import { Auditorium } from '@/types/auditorium';

export default function ShowtimeListPage() {
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Dependencies
    const [movies, setMovies] = useState<Movie[]>([]);
    const [auditoriums, setAuditoriums] = useState<Auditorium[]>([]);

    // Create Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState({ 
        movieId: 0, 
        auditoriumId: 0, 
        basePrice: 0, 
        startTime: '' 
    });
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState('');

    // Delete Modal State
    const [itemToDelete, setItemToDelete] = useState<Showtime | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [showtimeRes, movieRes, audiRes] = await Promise.all([
                showtimeApi.getShowtimes(),
                movieApi.getMovies(),
                auditoriumApi.getAuditoriums()
            ]);
            setShowtimes(showtimeRes.data);
            setMovies(movieRes.data || []); // Handle potential mock usage or backend null
            setAuditoriums(audiRes.data || []);
            setError('');
        } catch (err: any) {
            setError(err.message || 'Không thể tải dữ liệu');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError('');
        
        // Basic validation
        if (createForm.movieId === 0) {
            setCreateError('Vui lòng chọn phim');
            return;
        }
        if (createForm.auditoriumId === 0) {
            setCreateError('Vui lòng chọn phòng chiếu');
            return;
        }
        if (new Date(createForm.startTime) < new Date()) {
            setCreateError('Thời gian chiếu phải ở tương lai');
            return;
        }

        setIsCreating(true);

        try {
            // Convert to backend expectation if needed, currently sending as string (datetime-local format usually works or needs ISO conversion)
            const payload = {
                ...createForm,
                startTime: new Date(createForm.startTime).toISOString(),
            };

            await showtimeApi.createShowtime(payload);
            setIsCreateOpen(false);
            setCreateForm({ movieId: 0, auditoriumId: 0, basePrice: 0, startTime: '' });
            
            // Refresh showtimes only
            const res = await showtimeApi.getShowtimes();
            setShowtimes(res.data);
        } catch (err: any) {
            setCreateError(err.message || 'Tạo suất chiếu thất bại');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            await showtimeApi.deleteShowtime(itemToDelete.id);
            setItemToDelete(null);
            const res = await showtimeApi.getShowtimes();
            setShowtimes(res.data);
        } catch (err: any) {
            alert(err.message || 'Xóa thất bại'); 
        } finally {
            setIsDeleting(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const getMovieName = (id: number) => movies.find(m => m.id === id)?.title || `Phim #${id}`;
    const getAudiName = (id: number) => auditoriums.find(a => a.id === id)?.name || `Rạp #${id}`;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý Suất Chiếu</h1>
                    <p className="text-gray-400">Lịch chiếu phim tại các rạp</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm suất chiếu
                </Button>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    {error}
                </div>
            )}

            <div className="rounded-md border border-gray-800 bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-muted/50">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Phim</th>
                                <th className="px-6 py-4">Phòng chiếu</th>
                                <th className="px-6 py-4">Thời gian</th>
                                <th className="px-6 py-4">Giá vé cơ bản</th>
                                <th className="px-6 py-4 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : showtimes.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                        Chưa có suất chiếu nào.
                                    </td>
                                </tr>
                            ) : (
                                showtimes.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-medium">{item.id}</td>
                                        <td className="px-6 py-4 font-semibold text-white">
                                            {item.movie?.title || getMovieName(item.movieId)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {item.auditorium?.name || getAudiName(item.auditoriumId)}
                                        </td>
                                        <td className="px-6 py-4 text-primary">
                                            {new Date(item.startTime).toLocaleString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 font-mono">
                                            {formatPrice(item.basePrice)}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Link href={`/admin/showtimes/${item.id}`}>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                                onClick={() => setItemToDelete(item)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

             {/* Create Modal */}
             {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-md rounded-lg border border-border shadow-lg p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Thêm suất chiếu mới</h3>
                            <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {createError && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">
                                {createError}
                            </div>
                        )}

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Chọn Phim</label>
                                <select 
                                    className="flex h-11 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={createForm.movieId}
                                    onChange={e => setCreateForm({...createForm, movieId: Number(e.target.value)})}
                                    required
                                >
                                    <option value={0}>-- Chọn phim --</option>
                                    {movies.map(m => (
                                        <option key={m.id} value={m.id}>{m.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Chọn Phòng Chiếu</label>
                                <select 
                                    className="flex h-11 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={createForm.auditoriumId}
                                    onChange={e => setCreateForm({...createForm, auditoriumId: Number(e.target.value)})}
                                    required
                                >
                                    <option value={0}>-- Chọn phòng --</option>
                                    {auditoriums.map(a => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                    ))}
                                </select>
                            </div>

                            <Input
                                label="Thời gian chiếu"
                                type="datetime-local"
                                value={createForm.startTime}
                                onChange={e => setCreateForm({...createForm, startTime: e.target.value})}
                                required
                            />

                            <Input
                                label="Giá vé cơ bản (VNĐ)"
                                type="number"
                                min="0"
                                value={createForm.basePrice}
                                onChange={e => setCreateForm({...createForm, basePrice: Number(e.target.value)})}
                                required
                            />

                            <div className="flex justify-end space-x-3 pt-2">
                                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
                                    Hủy
                                </Button>
                                <Button type="submit" isLoading={isCreating}>
                                    Tạo mới
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                            Bạn có chắc chắn muốn xóa suất chiếu này?<br/>
                            ID: <span className="font-bold text-white">{itemToDelete.id}</span>
                            <br/>Hành động này không thể hoàn tác.
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
        </div>
    );
}
