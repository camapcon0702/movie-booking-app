'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { seatPriceApi } from '@/lib/api/admin/seatPrice';
import { SeatType } from '@/types/seat-price';

export default function CreateSeatPricePage() {
    const router = useRouter();
    const [form, setForm] = useState({
        seatType: 'NORMAL' as SeatType,
        price: 0,
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (form.price <= 0) {
            setError('Giá vé phải lớn hơn 0');
            return;
        }

        setIsLoading(true);

        try {
            await seatPriceApi.createSeatPrice({
                seatType: form.seatType,
                price: form.price
            });
            router.push('/admin/seat-prices');
        } catch (err: any) {
            setError(err.message || 'Tạo giá ghế thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
             <div className="flex items-center space-x-4">
                <Link href="/admin/seat-prices">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Thêm Giá Ghế Mới</h1>
                    <p className="text-gray-400">Thiết lập giá cho một loại ghế mới</p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    {error}
                </div>
            )}

            <div className="bg-card border border-border rounded-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Loại Ghế</label>
                        <select
                            className="flex h-11 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            value={form.seatType}
                            onChange={e => setForm({...form, seatType: e.target.value as SeatType})}
                            disabled={isLoading}
                        >
                            <option value="NORMAL">NORMAL (Thường)</option>
                            <option value="VIP">VIP</option>
                            <option value="COUPLE">COUPLE (Đôi)</option>
                        </select>
                        <p className="text-xs text-gray-500">
                            Lưu ý: Không thể tạo trùng loại ghế đã tồn tại.
                        </p>
                    </div>

                    <Input
                        label="Giá Vé (VNĐ)"
                        type="number"
                        min="1000"
                        step="1000"
                        value={form.price}
                        onChange={e => setForm({...form, price: Number(e.target.value)})}
                        required
                        disabled={isLoading}
                        placeholder="Nhập giá vé..."
                    />

                    <div className="pt-4 border-t border-gray-800 flex justify-end space-x-3">
                        <Link href="/admin/seat-prices">
                            <Button type="button" variant="ghost">Hủy</Button>
                        </Link>
                        <Button type="submit" isLoading={isLoading}>
                            <Save className="mr-2 h-4 w-4" />
                            Lưu cấu hình
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
