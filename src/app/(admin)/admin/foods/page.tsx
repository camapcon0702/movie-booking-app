'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Plus, Edit, Trash2, X, AlertTriangle, Utensils } from 'lucide-react';
import { foodApi } from '@/lib/api/admin/food';
import { Food } from '@/types/food';

export default function FoodListPage() {
    const [foods, setFoods] = useState<Food[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Create Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState({ name: '', price: 0, imgUrl: '' });
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState('');

    // Delete Modal State
    const [itemToDelete, setItemToDelete] = useState<Food | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchFoods = async () => {
        setIsLoading(true);
        try {
            const res = await foodApi.getFoods();
            setFoods(res.data);
            setError('');
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách đồ ăn');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError('');
        setIsCreating(true);

        try {
            await foodApi.createFood(createForm);
            setIsCreateOpen(false);
            setCreateForm({ name: '', price: 0, imgUrl: '' });
            fetchFoods(); 
        } catch (err: any) {
            setCreateError(err.message || 'Tạo đồ ăn thất bại');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            await foodApi.deleteFood(itemToDelete.id);
            setItemToDelete(null);
            fetchFoods(); 
        } catch (err: any) {
            alert(err.message || 'Xóa thất bại'); 
        } finally {
            setIsDeleting(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý Đồ Ăn & Nước</h1>
                    <p className="text-gray-400">Danh sách các món ăn và đồ uống</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm món mới
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
                                <th className="px-6 py-4">Hình ảnh</th>
                                <th className="px-6 py-4">Tên món</th>
                                <th className="px-6 py-4">Giá bán</th>
                                <th className="px-6 py-4">Ngày tạo</th>
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
                            ) : foods.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                        Chưa có món nào.
                                    </td>
                                </tr>
                            ) : (
                                foods.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-medium">{item.id}</td>
                                        <td className="px-6 py-4">
                                            {item.imgUrl ? (
                                                <img src={item.imgUrl} alt={item.name} className="w-12 h-12 rounded object-cover" />
                                            ) : (
                                                <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                                                    <Utensils className="w-6 h-6 text-gray-400" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-white">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-primary">
                                            {formatPrice(item.price)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Link href={`/admin/foods/${item.id}`}>
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
                            <h3 className="text-lg font-semibold">Thêm món mới</h3>
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
                                label="Tên món"
                                placeholder="Ví dụ: Bắp rang bơ"
                                value={createForm.name}
                                onChange={e => setCreateForm({...createForm, name: e.target.value})}
                                required
                            />
                            <Input
                                label="Giá bán (VNĐ)"
                                type="number"
                                placeholder="0"
                                min="0"
                                value={createForm.price}
                                onChange={e => setCreateForm({...createForm, price: Number(e.target.value)})}
                                required
                            />
                            <div className="space-y-2">
                                <Input
                                    label="Link hình ảnh"
                                    placeholder="https://..."
                                    value={createForm.imgUrl}
                                    onChange={e => setCreateForm({...createForm, imgUrl: e.target.value})}
                                    required
                                />
                                {createForm.imgUrl && (
                                    <div className="mt-2 h-32 w-full rounded border border-gray-800 bg-black/20 flex items-center justify-center overflow-hidden">
                                        <img src={createForm.imgUrl} alt="Preview" className="h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                    </div>
                                )}
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
            {itemToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-sm rounded-lg border border-border shadow-lg p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                                Xóa món ăn
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
