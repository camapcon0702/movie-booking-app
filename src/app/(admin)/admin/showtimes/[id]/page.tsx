'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { showtimeApi } from '@/lib/api/admin/showtime';
import { movieApi } from '@/lib/api/admin/movie';
import { auditoriumApi } from '@/lib/api/admin/auditorium';
import { Movie } from '@/types/movie';
import { Auditorium } from '@/types/auditorium';

export default function EditShowtimePage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const [form, setForm] = useState({ 
        movieId: 0, 
        auditoriumId: 0, 
        basePrice: 0, 
        startTime: '' 
    });
    
    const [movies, setMovies] = useState<Movie[]>([]);
    const [auditoriums, setAuditoriums] = useState<Auditorium[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                // Fetch dependencies first or in parallel
                const [showtimeRes, movieRes, audiRes] = await Promise.all([
                    showtimeApi.getShowtimeById(id),
                    movieApi.getMovies(),
                    auditoriumApi.getAuditoriums()
                ]);

                setMovies(movieRes.data || []);
                setAuditoriums(audiRes.data || []);
                
                // Format datetime for input type="datetime-local" (YYYY-MM-DDThh:mm)
                const date = new Date(showtimeRes.data.startTime);
                // Adjust to local ISO string (manual formatting to avoid timezone issues with toISOString)
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                const formattedDate = date.toISOString().slice(0, 16);

                setForm({
                    movieId: showtimeRes.data.movieId,
                    auditoriumId: showtimeRes.data.auditoriumId,
                    basePrice: showtimeRes.data.basePrice,
                    startTime: formattedDate,
                });
            } catch (err: any) {
                setError(err.message || 'Không thể tải thông tin suất chiếu');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
         if (form.movieId === 0) {
            setError('Vui lòng chọn phim');
            return;
        }
        if (form.auditoriumId === 0) {
            setError('Vui lòng chọn phòng chiếu');
            return;
        }

        setIsSaving(true);

        try {
            const payload = {
                ...form,
                startTime: new Date(form.startTime).toISOString(),
            };
            await showtimeApi.updateShowtime(id, payload);
            router.push('/admin/showtimes');
        } catch (err: any) {
            setError(err.message || 'Cập nhật thất bại');
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
                <div className="space-y-4 max-w-xl">
                    <div className="h-10 bg-muted rounded animate-pulse"></div>
                    <div className="h-10 bg-muted rounded animate-pulse"></div>
                    <div className="h-10 bg-muted rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">
             <div className="flex items-center space-x-4">
                <Link href="/admin/showtimes">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa suất chiếu</h1>
                    <p className="text-gray-400">ID: {id}</p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 border border-gray-800 rounded-lg p-6 bg-card">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Chọn Phim</label>
                    <select 
                        className="flex h-11 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={form.movieId}
                        onChange={e => setForm({...form, movieId: Number(e.target.value)})}
                        required
                        disabled={isSaving}
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
                        value={form.auditoriumId}
                        onChange={e => setForm({...form, auditoriumId: Number(e.target.value)})}
                        required
                        disabled={isSaving}
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
                    value={form.startTime}
                    onChange={e => setForm({...form, startTime: e.target.value})}
                    required
                    disabled={isSaving}
                />

                <Input
                    label="Giá vé cơ bản (VNĐ)"
                    type="number"
                    min="0"
                    value={form.basePrice}
                    onChange={e => setForm({...form, basePrice: Number(e.target.value)})}
                    required
                    disabled={isSaving}
                />

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-800">
                    <Link href="/admin/showtimes">
                        <Button type="button" variant="ghost">
                            Hủy bỏ
                        </Button>
                    </Link>
                    <Button type="submit" isLoading={isSaving} className="min-w-[120px]">
                        <Save className="mr-2 h-4 w-4" />
                        Lưu thay đổi
                    </Button>
                </div>
            </form>
        </div>
    );
}
