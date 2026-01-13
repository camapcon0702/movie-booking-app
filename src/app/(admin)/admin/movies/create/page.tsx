'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowLeft, Save, AlertTriangle, Upload } from 'lucide-react';
import { movieApi } from '@/lib/api/admin/movie';
import { genreApi } from '@/lib/api/admin/genre';
import { Genre } from '@/types/genre';
import { MovieStatus } from '@/types/movie';

export default function CreateMoviePage() {
    const router = useRouter();
    const [genres, setGenres] = useState<Genre[]>([]);
    
    // Form State
    const [form, setForm] = useState({
        title: '',
        description: '',
        durationMinutes: 0,
        releaseDate: '',
        trailerUrl: '',
        status: 'NOW_SHOWING' as MovieStatus,
        starNumber: 5,
        genreIds: [] as number[],
    });

    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string>('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch Genres
        const fetchGenres = async () => {
             try {
                const res = await genreApi.getGenres();
                setGenres(res.data);
            } catch (err) {
                console.error("Failed to fetch genres", err);
            }
        };
        fetchGenres();
    }, []);

    const handleGenreToggle = (genreId: number) => {
        setForm(prev => {
            const exists = prev.genreIds.includes(genreId);
            if (exists) {
                return { ...prev, genreIds: prev.genreIds.filter(id => id !== genreId) };
            } else {
                return { ...prev, genreIds: [...prev.genreIds, genreId] };
            }
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPosterFile(file);
            setPosterPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (form.genreIds.length === 0) {
            setError('Vui lòng chọn ít nhất một thể loại');
            return;
        }

        setIsLoading(true);

        try {
            // Step 1: Create Movie
            // Backend expects "DD-MM-YYYY" for releaseDate based on user prompt? 
            // The user provided JSON example shows "22-12-2025". Input type="date" gives YYYY-MM-DD.
            // Let's reformat it.
            const [y, m, d] = form.releaseDate.split('-');
            const formattedDate = `${d}-${m}-${y}`; // DD-MM-YYYY

            const payload = {
                ...form,
                releaseDate: formattedDate,
            };

            const res = await movieApi.createMovie(payload);
            const movieId = res.data.id;

            // Step 2: Upload Poster (if selected)
            if (posterFile) {
                await movieApi.uploadMoviePoster(movieId, posterFile);
            }

            router.push('/admin/movies');
        } catch (err: any) {
            setError(err.message || 'Tạo phim thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
             <div className="flex items-center space-x-4">
                <Link href="/admin/movies">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Thêm Phim Mới</h1>
                    <p className="text-gray-400">Nhập thông tin phim đầy đủ</p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Poster & Status */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
                        <label className="block text-sm font-medium text-gray-300">Poster Phim</label>
                        <div className="aspect-[2/3] w-full bg-muted rounded-lg border-2 border-dashed border-gray-700 flex flex-col items-center justify-center relative overflow-hidden group">
                            {posterPreview ? (
                                <img src={posterPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-4">
                                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                    <p className="text-xs text-gray-500">Kéo thả hoặc click để chọn ảnh</p>
                                </div>
                            )}
                            <input 
                                type="file" 
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
                        <label className="text-sm font-medium text-gray-300">Trạng Thái</label>
                        <select
                            className="flex h-11 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            value={form.status}
                            onChange={e => setForm({...form, status: e.target.value as MovieStatus})}
                        >
                            <option value="NOW_SHOWING">Đang Chiếu (Now Showing)</option>
                            <option value="COMING_SOON">Sắp Chiếu (Coming Soon)</option>
                            <option value="STOP_SHOWING">Ngừng Chiếu (Stop Showing)</option>
                        </select>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="md:col-span-2 space-y-6 bg-card border border-border rounded-lg p-6">
                    <Input
                        label="Tên Phim"
                        value={form.title}
                        onChange={e => setForm({...form, title: e.target.value})}
                        required
                        placeholder="Nhập tên phim..."
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Mô tả phim</label>
                        <textarea
                            className="flex min-h-[120px] w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            value={form.description}
                            onChange={e => setForm({...form, description: e.target.value})}
                            required
                            placeholder="Nội dung tóm tắt của phim..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Ngày Khởi Chiếu"
                            type="date"
                            value={form.releaseDate}
                            onChange={e => setForm({...form, releaseDate: e.target.value})}
                            required
                        />
                        <Input
                            label="Thời lượng (phút)"
                            type="number"
                            min="1"
                            value={form.durationMinutes}
                            onChange={e => setForm({...form, durationMinutes: Number(e.target.value)})}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Điểm đánh giá (1-10)"
                            type="number"
                            min="1"
                            max="10"
                            value={form.starNumber}
                            onChange={e => setForm({...form, starNumber: Number(e.target.value)})}
                            required
                        />
                         <Input
                            label="Trailer URL"
                            value={form.trailerUrl}
                            onChange={e => setForm({...form, trailerUrl: e.target.value})}
                            placeholder="https://youtube.com/..."
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-300">Thể loại</label>
                        {genres.length === 0 ? (
                            <p className="text-sm text-gray-500">Không có thể loại nào.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {genres.map(genre => {
                                    const isSelected = form.genreIds.includes(genre.id);
                                    return (
                                        <button
                                            key={genre.id}
                                            type="button"
                                            onClick={() => handleGenreToggle(genre.id)}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                                                isSelected 
                                                ? 'bg-primary text-white border-primary' 
                                                : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500'
                                            }`}
                                        >
                                            {genre.name}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-gray-800 flex justify-end space-x-3">
                        <Link href="/admin/movies">
                            <Button type="button" variant="ghost">Hủy</Button>
                        </Link>
                        <Button type="submit" isLoading={isLoading}>
                            <Save className="mr-2 h-4 w-4" />
                            Tạo phim mới
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
