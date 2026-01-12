'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowLeft, Save, AlertTriangle, Upload, Loader2, Film } from 'lucide-react';
import { movieApi } from '@/lib/api/admin/movie';
import { genreApi } from '@/lib/api/admin/genre';
import { Genre } from '@/types/genre';
import { MovieStatus } from '@/types/movie';

export default function EditMoviePage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const [genres, setGenres] = useState<Genre[]>([]);
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

    const [currentPoster, setCurrentPoster] = useState('');
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string>('');
    const [isUploadingPoster, setIsUploadingPoster] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    useEffect(() => {
        const fetchData = async () => {
             if (!id) return;
             try {
                const [movieRes, genreRes] = await Promise.all([
                    movieApi.getMovieById(id),
                    genreApi.getGenres(),
                ]);

                setGenres(genreRes.data);
                
                const m = movieRes.data;
                // Parse date "DD-MM-YYYY" to YYYY-MM-DD for input
                let formattedReleaseDate = '';
                if (m.releaseDate) {
                     // Check if it's already ISO or DD-MM-YYYY.
                     // The backend might return standard string. If it returns DD-MM-YYYY as saved:
                     const parts = m.releaseDate.split('-');
                     if (parts[2]?.length === 4) { // DD-MM-YYYY
                        formattedReleaseDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                     } else {
                        formattedReleaseDate = m.releaseDate; // hope input accepts it
                     }
                }

                setForm({
                    title: m.title,
                    description: m.description,
                    durationMinutes: m.durationMinutes,
                    releaseDate: formattedReleaseDate,
                    trailerUrl: m.trailerUrl || '',
                    status: m.status,
                    starNumber: m.starNumber,
                    // The backend returns genre names "genres": ["Tình cảm"].
                    // But to edit properly, we typically need IDs.
                    // If the GET Detail API doesn't return IDs, we have a problem.
                    // Assuming for now we can't pre-fill IDs perfectly if API only gives names,
                    // OR we map names to IDs if names are unique.
                    // Let's safe-guard: if we can map, we do.
                    genreIds: [], 
                });
                
                // Hacky map for UI if API only gives names:
                if (m.genres && m.genres.length > 0 && genreRes.data.length > 0) {
                     const ids = genreRes.data
                        .filter(g => m.genres.includes(g.name))
                        .map(g => g.id);
                     setForm(prev => ({...prev, genreIds: ids}));
                }

                setCurrentPoster(m.posterUrl || '');
             } catch (err: any) {
                setError(err.message || 'Không thể tải thông tin phim');
             } finally {
                setIsLoading(false);
             }
        };

        fetchData();
    }, [id]);

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

     const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPosterFile(file);
            setPosterPreview(URL.createObjectURL(file));
            
            // Auto/Manual upload logic? 
            // The prompt says "Preview poster" then "Save changes".
            // But also "Poster upload is independent API call".
            // UX choice: Let's upload immediately or on specific button? 
            // "Disable upload while in progress" suggests an explicit action or immediate trigger.
            // Let's provide a specific "Upload New Poster" button to separate concerns safely.
        }
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsSaving(true);

        try {
            // Upload poster if exists
            

            const [y, m, d] = form.releaseDate.split('-');
            const formattedDate = `${d}-${m}-${y}`; // DD-MM-YYYY

            const payload = {
                ...form,
                releaseDate: formattedDate,
            };

            await movieApi.updateMovie(id, payload);

            if (posterFile) {
                await movieApi.uploadMoviePoster(id, posterFile);
            }

            setSuccessMessage('Cập nhật thông tin thành công!');
            // Optional: redirect or stay
            // router.push('/admin/movies');

            router.push('/admin/movies');
        } catch (err: any) {
            setError(err.message || 'Cập nhật thất bại');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-400">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
             <div className="flex items-center space-x-4">
                <Link href="/admin/movies">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Chỉnh Sửa Phim</h1>
                    <p className="text-gray-400">ID: {id}</p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    {error}
                </div>
            )}
             {successMessage && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500">
                    {successMessage}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {/* Left Column: Poster Management */}
                 <div className="space-y-6">
                    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
                        <label className="block text-sm font-medium text-gray-300">Poster Phim</label>
                        <div className="aspect-[2/3] w-full bg-muted rounded-lg border-2 border-dashed border-gray-700 flex flex-col items-center justify-center relative overflow-hidden">
                             {posterPreview ? (
                                <img src={posterPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                            ) : currentPoster ? (
                                <img src={currentPoster} alt="Current Poster" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <Film className="h-12 w-12 text-gray-500" />
                            )}
                            
                            {/* Overlay for upload */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white text-sm font-medium">Chọn ảnh mới</p>
                            </div>
                             <input 
                                type="file" 
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                        </div>

                         {posterFile && (
                            <div className="text-center text-sm text-yellow-500 font-medium">
                                * Ảnh sẽ được upload khi bạn nhấn Lưu thay đổi
                            </div>
                        )}
                         {posterFile && (
                            <button 
                                type="button"
                                onClick={() => { setPosterFile(null); setPosterPreview(''); }}
                                className="w-full text-xs text-red-400 hover:text-red-300"
                            > 
                                Hủy chọn 
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6 bg-card border border-border rounded-lg p-6">
                     <Input
                        label="Tên Phim"
                        value={form.title}
                        onChange={e => setForm({...form, title: e.target.value})}
                        required
                        disabled={isSaving}
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Mô tả phim</label>
                        <textarea
                            className="flex min-h-[120px] w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            value={form.description}
                            onChange={e => setForm({...form, description: e.target.value})}
                            required
                            disabled={isSaving}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Trạng Thái</label>
                            <select
                                className="flex h-11 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                value={form.status}
                                onChange={e => setForm({...form, status: e.target.value as MovieStatus})}
                                disabled={isSaving}
                            >
                                <option value="NOW_SHOWING">Đang Chiếu</option>
                                <option value="COMING_SOON">Sắp Chiếu</option>
                                <option value="STOP_SHOWING">Ngừng Chiếu</option>
                            </select>
                        </div>
                         <Input
                            label="Ngày Khởi Chiếu"
                            type="date"
                            value={form.releaseDate}
                            onChange={e => setForm({...form, releaseDate: e.target.value})}
                            required
                            disabled={isSaving}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Thời lượng (phút)"
                            type="number"
                            min="1"
                            value={form.durationMinutes}
                            onChange={e => setForm({...form, durationMinutes: Number(e.target.value)})}
                            required
                            disabled={isSaving}
                        />
                         <Input
                            label="Điểm đánh giá"
                            type="number"
                            min="1"
                            max="5"
                            value={form.starNumber}
                            onChange={e => setForm({...form, starNumber: Number(e.target.value)})}
                            required
                            disabled={isSaving}
                        />
                    </div>

                     <Input
                            label="Trailer URL"
                            value={form.trailerUrl}
                            onChange={e => setForm({...form, trailerUrl: e.target.value})}
                            disabled={isSaving}
                        />

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-300">Thể loại</label>
                        <div className="flex flex-wrap gap-2">
                             {genres.map(genre => {
                                const isSelected = form.genreIds.includes(genre.id);
                                return (
                                    <button
                                        key={genre.id}
                                        type="button"
                                        disabled={isSaving}
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
                    </div>

                    <div className="pt-4 border-t border-gray-800 flex justify-end space-x-3">
                         <Link href="/admin/movies">
                            <Button type="button" variant="ghost">Hủy</Button>
                        </Link>
                        <Button type="submit" isLoading={isSaving}>
                            <Save className="mr-2 h-4 w-4" />
                            Lưu thay đổi
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
