'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { X, Save, AlertTriangle } from 'lucide-react';
import { Showtime } from '@/types/showtime';
import { Movie } from '@/types/movie';
import { showtimeApi } from '@/lib/api/admin/showtime';

interface UpdateShowtimeModalProps {
    showtime: Showtime;
    movies: Movie[];
    onClose: () => void;
    onSuccess: () => void;
}

export const UpdateShowtimeModal: React.FC<UpdateShowtimeModalProps> = ({ 
    showtime, 
    movies, 
    onClose, 
    onSuccess 
}) => {
    const [form, setForm] = useState({
        movieId: showtime.movieId,
        auditoriumId: showtime.auditoriumId,
        basePrice: showtime.basePrice,
        startTime: new Date(showtime.startTime).toISOString().slice(0, 16) // Format for datetime-local
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (new Date(form.startTime) < new Date()) {
            setError('Thời gian chiếu phải ở tương lai');
            return;
        }

        setIsLoading(true);

        try {
            await showtimeApi.updateShowtime(showtime.id, {
                ...form,
                // Send local datetime format with seconds
                startTime: form.startTime.includes(':') && form.startTime.split(':').length === 2 
                    ? form.startTime + ':00' 
                    : form.startTime
            });
            onSuccess();
            onClose();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Cập nhật thất bại');
            } else {
                setError('Cập nhật thất bại');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-md rounded-lg border border-border shadow-lg p-6 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                        Cập nhật suất chiếu
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" title="Đóng">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 flex items-center text-sm">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Movie Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Chọn Phim *</label>
                        <select
                            className="flex h-11 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            value={form.movieId}
                            onChange={e => setForm({...form, movieId: Number(e.target.value)})}
                            required
                            title="Chọn phim"
                        >
                            {movies.map(m => (
                                <option key={m.id} value={m.id}>{m.title}</option>
                            ))}
                        </select>
                    </div>

                    {/* Base Price */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Giá vé cơ bản (VNĐ) *</label>
                        <input
                            type="number"
                            min="0"
                            step="1000"
                            className="flex h-11 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            value={form.basePrice}
                            onChange={e => setForm({...form, basePrice: Number(e.target.value)})}
                            required
                        />
                    </div>

                    {/* Start Time */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Thời gian chiếu *</label>
                        <input
                            type="datetime-local"
                            className="flex h-11 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            value={form.startTime}
                            onChange={e => setForm({...form, startTime: e.target.value})}
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button type="submit" isLoading={isLoading}>
                            <Save className="mr-2 h-4 w-4" />
                            Lưu
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
