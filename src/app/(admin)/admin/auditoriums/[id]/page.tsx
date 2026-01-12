'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { auditoriumApi } from '@/lib/api/admin/auditorium';

export default function EditAuditoriumPage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const [form, setForm] = useState({ name: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const res = await auditoriumApi.getAuditoriumById(id);
                setForm({
                    name: res.data.name,
                });
            } catch (err: any) {
                setError(err.message || 'Không thể tải thông tin phòng chiếu');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSaving(true);

        try {
            await auditoriumApi.updateAuditorium(id, form);
            router.push('/admin/auditoriums');
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
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center space-x-4">
                <Link href="/admin/auditoriums">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa phòng chiếu</h1>
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
                    label="Tên phòng chiếu"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    disabled={isSaving}
                />

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-800">
                    <Link href="/admin/auditoriums">
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
