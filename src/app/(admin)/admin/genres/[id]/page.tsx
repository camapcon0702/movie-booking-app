'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { genreApi } from '@/lib/api/admin/genre';

export default function EditGenrePage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const [form, setForm] = useState({ name: '', description: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGenre = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const res = await genreApi.getGenreById(id);
                setForm({
                    name: res.data.name,
                    description: res.data.description || '',
                });
            } catch (err: any) {
                setError(err.message || 'Không thể tải thông tin thể loại');
            } finally {
                setIsLoading(false);
            }
        };

        fetchGenre();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSaving(true);

        try {
            await genreApi.updateGenre(id, form);
            router.push('/admin/genres');
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
                    <div className="h-32 bg-muted rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center space-x-4">
                <Link href="/admin/genres">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa thể loại</h1>
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
                <Input
                    label="Tên thể loại"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    disabled={isSaving}
                />

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Mô tả</label>
                    <textarea 
                        className="flex w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px]"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        disabled={isSaving}
                    />
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-800">
                    <Link href="/admin/genres">
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
