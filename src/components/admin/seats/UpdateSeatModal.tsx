'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/common/Button';
import { X, Save, AlertTriangle } from 'lucide-react';
import { Seat } from '@/types/seat';
import { SeatPrice } from '@/types/seat-price';
import { seatPriceApi } from '@/lib/api/admin/seatPrice';
import { seatApi } from '@/lib/api/admin/seat';

interface UpdateSeatModalProps {
    seats: Seat[];
    onClose: () => void;
    onSuccess: () => void;
}

export const UpdateSeatModal: React.FC<UpdateSeatModalProps> = ({ seats, onClose, onSuccess }) => {
    const [prices, setPrices] = useState<SeatPrice[]>([]);
    const [form, setForm] = useState({
        seatPriceId: 0, // Will be set to NORMAL type ID after fetching prices
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await seatPriceApi.getAllSeatPrices();
                setPrices(res.data);
                // Set default to NORMAL type
                const normalPrice = res.data.find(p => p.seatType === 'NORMAL');
                if (normalPrice) {
                    setForm({ seatPriceId: normalPrice.id });
                }
            } catch {
                 console.error("Failed to fetch seat prices");
            }
        };
        fetchPrices();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await Promise.all(seats.map(seat => seatApi.updateSeatType(seat.id, form.seatPriceId)));
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Cập nhật thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-sm rounded-lg border border-border shadow-lg p-6 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                        Cập nhật {seats.length} ghế đã chọn
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" title="Đóng">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 flex items-center text-sm">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-300">Loại Giá Ghế</label>
                         <select
                            className="flex h-11 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            value={form.seatPriceId}
                            onChange={e => setForm({...form, seatPriceId: Number(e.target.value)})}
                            title="Chọn loại giá ghế"
                        >
                            {prices.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.seatType} - {new Intl.NumberFormat('vi-VN').format(p.price)}đ
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button type="submit" isLoading={isLoading}>
                            <Save className="mr-2 h-4 w-4" />
                            Lưu
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
