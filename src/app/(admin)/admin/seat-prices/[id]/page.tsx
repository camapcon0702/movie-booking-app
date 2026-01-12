'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { seatPriceApi } from '@/lib/api/admin/seatPrice';
import { SeatType } from '@/types/seat-price';

export default function EditSeatPricePage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const [form, setForm] = useState({
        seatType: '' as SeatType, // Initially empty, filled after fetch
        price: 0,
    });
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;
            try {
                const res = await seatPriceApi.getSeatPriceById(id);
                setForm({
                    seatType: res.data.seatType,
                    price: res.data.price
                });
            } catch (err: any) {
                setError(err.message || 'Không thể tải thông tin giá ghế');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (form.price <= 0) {
            setError('Giá vé phải lớn hơn 0');
            return;
        }

        setIsSaving(true);

        try {
            await seatPriceApi.updateSeatPrice(id, {
                seatType: form.seatType,
                price: form.price
            });
            setSuccessMessage('Cập nhật giá vé thành công!');
            // Optional: router.push('/admin/seat-prices');
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
        <div className="space-y-6 max-w-2xl mx-auto">
             <div className="flex items-center space-x-4">
                <Link href="/admin/seat-prices">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cập Nhật Giá Ghế</h1>
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

            <div className="bg-card border border-border rounded-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Loại Ghế</label>
                        <select
                            className="flex h-11 w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground focus-visible:outline-none opacity-70 cursor-not-allowed"
                            value={form.seatType}
                            disabled
                        >
                            <option value="NORMAL">NORMAL (Thường)</option>
                            <option value="VIP">VIP</option>
                            <option value="COUPLE">COUPLE (Đôi)</option>
                        </select>
                        <p className="text-xs text-yellow-500 flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Không thể thay đổi loại ghế sau khi tạo.
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
                        disabled={isSaving}
                    />

                    <div className="pt-4 border-t border-gray-800 flex justify-end space-x-3">
                        <Link href="/admin/seat-prices">
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
