'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Plus, Edit, Trash2, X, AlertTriangle } from 'lucide-react';
import { genreApi } from '@/lib/api/admin/genre';
import { Genre } from '@/types/genre';

export default function GenreListPage() {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Create Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState({ name: '', description: '' });
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState('');

    // Delete Modal State
    const [genreToDelete, setGenreToDelete] = useState<Genre | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchGenres = async () => {
        setIsLoading(true);
        try {
            const res = await genreApi.getGenres();
            setGenres(res.data);
            setError('');
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách thể loại');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGenres();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError('');
        setIsCreating(true);

        try {
            await genreApi.createGenre(createForm);
            setIsCreateOpen(false);
            setCreateForm({ name: '', description: '' });
            fetchGenres(); // Refresh list
        } catch (err: any) {
            setCreateError(err.message || 'Tạo thể loại thất bại');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async () => {
        if (!genreToDelete) return;
        setIsDeleting(true);
        try {
            await genreApi.deleteGenre(genreToDelete.id);
            setGenreToDelete(null);
            fetchGenres(); // Refresh list
        } catch (err: any) {
            alert(err.message || 'Xóa thất bại'); // Simple alert for delete error or could use toast/state
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý thể loại</h1>
                    <p className="text-gray-400">Danh sách các thể loại phim trong hệ thống</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm thể loại
                </Button>
            </div>

            {/* Error State */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="rounded-md border border-gray-800 bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-muted/50">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Tên thể loại</th>
                                <th className="px-6 py-4">Mô tả</th>
                                <th className="px-6 py-4">Ngày tạo</th>
                                <th className="px-6 py-4 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : genres.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                        Chưa có thể loại nào.
                                    </td>
                                </tr>
                            ) : (
                                genres.map((genre) => (
                                    <tr key={genre.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-medium">{genre.id}</td>
                                        <td className="px-6 py-4 font-semibold text-white">{genre.name}</td>
                                        <td className="px-6 py-4 text-gray-400 max-w-xs truncate">{genre.description || '-'}</td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {new Date(genre.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Link href={`/admin/genres/${genre.id}`}>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                                onClick={() => setGenreToDelete(genre)}
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
                            <h3 className="text-lg font-semibold">Thêm thể loại mới</h3>
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
                            <Input
                                label="Tên thể loại"
                                placeholder="Ví dụ: Hành động"
                                value={createForm.name}
                                onChange={e => setCreateForm({...createForm, name: e.target.value})}
                                required
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Mô tả</label>
                                <textarea 
                                    className="flex w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                                    placeholder="Mô tả ngắn về thể loại..."
                                    value={createForm.description}
                                    onChange={e => setCreateForm({...createForm, description: e.target.value})}
                                />
                            </div>
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
            {genreToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-sm rounded-lg border border-border shadow-lg p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                                Xóa thể loại
                            </h3>
                            <button onClick={() => setGenreToDelete(null)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <p className="text-gray-300 mb-6">
                            Bạn có chắc chắn muốn xóa thể loại <span className="font-bold text-white">{genreToDelete.name}</span>?
                            <br/>Hành động này không thể hoàn tác.
                        </p>

                        <div className="flex justify-end space-x-3">
                            <Button variant="ghost" onClick={() => setGenreToDelete(null)}>
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
