'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Plus, Edit, Trash2, AlertTriangle, X, Armchair } from 'lucide-react';
import { seatPriceApi } from '@/lib/api/admin/seatPrice';
import { SeatPrice, SeatType } from '@/types/seat-price';

export default function SeatPriceListPage() {
    const [prices, setPrices] = useState<SeatPrice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Delete Modal State
    const [itemToDelete, setItemToDelete] = useState<SeatPrice | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchPrices = async () => {
        setIsLoading(true);
        try {
            const res = await seatPriceApi.getAllSeatPrices();
            setPrices(res.data);
            setError('');
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách giá ghế');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPrices();
    }, []);

    const handleDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            await seatPriceApi.deleteSeatPrice(itemToDelete.id);
            setItemToDelete(null);
            fetchPrices(); 
        } catch (err: any) {
            alert(err.message || 'Xóa thất bại'); 
        } finally {
            setIsDeleting(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getSeatTypeBadge = (type: SeatType) => {
        switch (type) {
            case 'COUPLE':
                return <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-500 border border-purple-500/20">COUPLE (Đôi)</span>;
            case 'VIP':
                return <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">VIP</span>;
            case 'NORMAL':
                return <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-500/10 text-gray-400 border border-gray-500/20">NORMAL (Thường)</span>;
            default:
                return <span>{type}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý Giá Ghế</h1>
                    <p className="text-gray-400">Thiết lập giá vé cho các loại ghế</p>
                </div>
                <Link href="/admin/seat-prices/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm giá ghế
                    </Button>
                </Link>
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
                                <th className="px-6 py-4">Loại Ghế</th>
                                <th className="px-6 py-4">Giá Vé</th>
                                <th className="px-6 py-4">Ngày Tạo</th>
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
                            ) : prices.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                        Chưa có giá ghế nào được cấu hình.
                                    </td>
                                </tr>
                            ) : (
                                prices.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-medium">{item.id}</td>
                                        <td className="px-6 py-4">
                                            {getSeatTypeBadge(item.seatType)}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-white">
                                            {formatCurrency(item.price)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Link href={`/admin/seat-prices/${item.id}`}>
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

            {/* Delete Confirmation Modal */}
            {itemToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-sm rounded-lg border border-border shadow-lg p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                                Xóa giá ghế
                            </h3>
                            <button onClick={() => setItemToDelete(null)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <p className="text-gray-300 mb-6">
                            Bạn có chắc chắn muốn xóa giá cho loại ghế <span className="font-bold text-white">{itemToDelete.seatType}</span>?
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
