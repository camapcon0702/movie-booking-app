'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Plus, Edit, Trash2, X, AlertTriangle, Monitor } from 'lucide-react';
import { auditoriumApi } from '@/lib/api/admin/auditorium';
import { Auditorium } from '@/types/auditorium';

export default function AuditoriumListPage() {
    const [auditoriums, setAuditoriums] = useState<Auditorium[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Create Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState({ name: '' });
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState('');

    // Delete Modal State
    const [itemToDelete, setItemToDelete] = useState<Auditorium | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchAuditoriums = async () => {
        setIsLoading(true);
        try {
            const res = await auditoriumApi.getAuditoriums();
            setAuditoriums(res.data);
            setError('');
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách phòng chiếu');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAuditoriums();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError('');
        setIsCreating(true);

        try {
            await auditoriumApi.createAuditorium(createForm);
            setIsCreateOpen(false);
            setCreateForm({ name: '' });
            fetchAuditoriums(); 
        } catch (err: any) {
            setCreateError(err.message || 'Tạo phòng chiếu thất bại');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            await auditoriumApi.deleteAuditorium(itemToDelete.id);
            setItemToDelete(null);
            fetchAuditoriums(); 
        } catch (err: any) {
            alert(err.message || 'Xóa thất bại'); 
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý Phòng Chiếu</h1>
                    <p className="text-gray-400">Danh sách các phòng chiếu trong hệ thống</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm phòng chiếu
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
                                <th className="px-6 py-4">Tên phòng chiếu</th>
                                <th className="px-6 py-4">Ngày tạo</th>
                                <th className="px-6 py-4 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : auditoriums.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                        Chưa có phòng chiếu nào.
                                    </td>
                                </tr>
                            ) : (
                                auditoriums.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-medium">{item.id}</td>
                                        <td className="px-6 py-4 font-semibold text-white flex items-center">
                                            <Monitor className="w-4 h-4 mr-2 text-primary" />
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Link href={`/admin/auditoriums/${item.id}`}>
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
                            <h3 className="text-lg font-semibold">Thêm phòng chiếu mới</h3>
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
                                label="Tên phòng chiếu"
                                placeholder="Ví dụ: Rạp 01, IMAX..."
                                value={createForm.name}
                                onChange={e => setCreateForm({...createForm, name: e.target.value})}
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
                                Xóa phòng chiếu
                            </h3>
                            <button onClick={() => setItemToDelete(null)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <p className="text-gray-300 mb-6">
                            Bạn có chắc chắn muốn xóa <span className="font-bold text-white">{itemToDelete.name}</span>?
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
