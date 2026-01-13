'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Plus, Edit, Trash2, X, AlertTriangle, Ticket } from 'lucide-react';
import { voucherApi } from '@/lib/api/admin/voucher';
import { Voucher } from '@/types/voucher';

export default function VoucherListPage() {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Create Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState({ 
        code: '', 
        discountAmount: '', // Handle as string for input, convert to number or null
        discountPercentage: '', 
        discountMax: '',
        expiryDate: '',
        active: true 
    });
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState('');

    // Delete Modal State
    const [itemToDelete, setItemToDelete] = useState<Voucher | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchVouchers = async () => {
        setIsLoading(true);
        try {
            const res = await voucherApi.getVouchers();
            setVouchers(res.data);
            setError('');
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách voucher');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError('');

        // Logic check: Either amount OR percentage
        const hasAmount = !!createForm.discountAmount && Number(createForm.discountAmount) > 0;
        const hasPercentage = !!createForm.discountPercentage && Number(createForm.discountPercentage) > 0;

        if (!hasAmount && !hasPercentage) {
            setCreateError('Phải nhập số tiền giảm HOẶC phần trăm giảm');
            return;
        }
        if (hasAmount && hasPercentage) {
            setCreateError('Chỉ được chọn một loại giảm giá (tiền hoặc phần trăm)');
            return;
        }
        if (new Date(createForm.expiryDate) < new Date()) {
            setCreateError('Ngày hết hạn phải ở tương lai');
            return;
        }

        setIsCreating(true);

        try {
            const payload = {
                code: createForm.code,
                expiryDate: new Date(createForm.expiryDate).toISOString(),
                active: createForm.active,
                // Only include defined values
                discountAmount: hasAmount ? Number(createForm.discountAmount) : undefined,
                discountPercentage: hasPercentage ? Number(createForm.discountPercentage) : undefined,
                discountMax: createForm.discountMax ? Number(createForm.discountMax) : undefined,
            };

            await voucherApi.createVoucher(payload);
            setIsCreateOpen(false);
            setCreateForm({ code: '', discountAmount: '', discountPercentage: '', discountMax: '', expiryDate: '', active: true });
            fetchVouchers(); 
        } catch (err: any) {
            setCreateError(err.message || 'Tạo voucher thất bại');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            await voucherApi.deleteVoucher(itemToDelete.id);
            setItemToDelete(null);
            fetchVouchers(); 
        } catch (err: any) {
            alert(err.message || 'Xóa thất bại'); 
        } finally {
            setIsDeleting(false);
        }
    };

    const formatCurrency = (val?: number) => val ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val) : '';
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý Voucher</h1>
                    <p className="text-gray-400">Mã giảm giá và khuyến mãi</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm voucher
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
                                <th className="px-6 py-4">Mã Code</th>
                                <th className="px-6 py-4">Giảm giá</th>
                                <th className="px-6 py-4">Tối đa</th>
                                <th className="px-6 py-4">Hết hạn</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : vouchers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                                        Chưa có voucher nào.
                                    </td>
                                </tr>
                            ) : (
                                vouchers.map((item) => {
                                    const isExpired = new Date(item.expiryDate) < new Date();
                                    return (
                                        <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4 font-medium">{item.id}</td>
                                            <td className="px-6 py-4 font-mono font-bold text-primary text-base">
                                                {item.code}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-white">
                                                {item.discountPercentage ? `${item.discountPercentage}%` : formatCurrency(item.discountAmount)}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">
                                                {formatCurrency(item.discountMax) || '-'}
                                            </td>
                                            <td className={`px-6 py-4 ${isExpired ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                                                {new Date(item.expiryDate).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${item.active && !isExpired ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {item.active && !isExpired ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <Link href={`/admin/vouchers/${item.id}`}>
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
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-md rounded-lg border border-border shadow-lg p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Tạo Voucher Mới</h3>
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
                                label="Mã Code"
                                placeholder="SUMMER2026"
                                value={createForm.code}
                                onChange={e => setCreateForm({...createForm, code: e.target.value.toUpperCase()})}
                                required
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Giảm theo %"
                                    type="number"
                                    placeholder="10"
                                    min="0"
                                    max="100"
                                    value={createForm.discountPercentage}
                                    onChange={e => setCreateForm({...createForm, discountPercentage: e.target.value, discountAmount: ''})}
                                    disabled={!!createForm.discountAmount}
                                />
                                <Input
                                    label="Giảm theo tiền (VNĐ)"
                                    type="number"
                                    placeholder="50000"
                                    min="0"
                                    value={createForm.discountAmount}
                                    onChange={e => setCreateForm({...createForm, discountAmount: e.target.value, discountPercentage: ''})}
                                    disabled={!!createForm.discountPercentage}
                                />
                            </div>

                            <Input
                                label="Giảm tối đa (VNĐ)"
                                type="number"
                                min="0"
                                placeholder="Để trống nếu không giới hạn"
                                value={createForm.discountMax}
                                onChange={e => setCreateForm({...createForm, discountMax: e.target.value})}
                            />

                            <Input
                                label="Ngày hết hạn"
                                type="datetime-local"
                                value={createForm.expiryDate}
                                onChange={e => setCreateForm({...createForm, expiryDate: e.target.value})}
                                required
                            />
                            
                             <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="active"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={createForm.active}
                                    onChange={e => setCreateForm({...createForm, active: e.target.checked})}
                                />
                                <label htmlFor="active" className="text-sm font-medium text-gray-300">
                                    Kích hoạt ngay
                                </label>
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
                                Xóa voucher
                            </h3>
                            <button onClick={() => setItemToDelete(null)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <p className="text-gray-300 mb-6">
                            Bạn có chắc chắn muốn xóa voucher <span className="font-bold text-white">{itemToDelete.code}</span>?
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
