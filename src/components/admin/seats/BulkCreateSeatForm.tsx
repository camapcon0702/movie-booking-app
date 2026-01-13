'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Save, AlertTriangle } from 'lucide-react';
import { seatPriceApi } from '@/lib/api/admin/seatPrice';
import { SeatPrice } from '@/types/seat-price';
import { seatApi } from '@/lib/api/admin/seat';

interface BulkCreateSeatFormProps {
    auditoriumId: number;
    onSuccess: () => void;
}

export const BulkCreateSeatForm: React.FC<BulkCreateSeatFormProps> = ({ auditoriumId, onSuccess }) => {
    const [seatPrices, setSeatPrices] = useState<SeatPrice[]>([]);
    
    const [form, setForm] = useState({
        rowChart: '',
        fromSeat: 1,
        toSeat: 10,
        seatPriceId: 0,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await seatPriceApi.getAllSeatPrices();
                setSeatPrices(res.data);
                if (res.data.length > 0) {
                    setForm(prev => ({ ...prev, seatPriceId: res.data[0].id }));
                }
            } catch (err) {
                console.error("Failed to fetch seat prices", err);
            }
        };
        fetchPrices();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        // Validation
        if (!form.rowChart.match(/^[A-Z]$/)) {
            setError('Hàng ghế phải là 1 ký tự chữ cái in hoa (A-Z)');
            setIsLoading(false);
            return;
        }

        if (form.fromSeat >= form.toSeat) {
            setError('Số ghế bắt đầu phải nhỏ hơn số ghế kết thúc');
            setIsLoading(false);
            return;
        }

        // Generate array of seat numbers
        const seatNumbers = [];
        for (let i = form.fromSeat; i <= form.toSeat; i++) {
            seatNumbers.push(i);
        }

        try {
            await seatApi.createSeats({
                auditoriumId,
                rowChart: form.rowChart,
                seatNumbers,
                seatPriceId: form.seatPriceId
            });
            setSuccessMessage(`Đã tạo ${seatNumbers.length} ghế hàng ${form.rowChart} thành công!`);
            onSuccess();
            // Reset form partly
            setForm(prev => ({ ...prev, fromSeat: prev.toSeat + 1, toSeat: prev.toSeat + 10 }));
        } catch (err: any) {
            setError(err.message || 'Tạo ghế thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-bold border-b border-border pb-2">Thêm Ghế Theo Hàng</h3>
            
            {error && (
                <div className="text-sm p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 flex items-start">
                    <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}
             {successMessage && (
                <div className="text-sm p-3 bg-green-500/10 border border-green-500/20 rounded text-green-500">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Hàng Ghế (A-Z)"
                        value={form.rowChart}
                        onChange={e => setForm({...form, rowChart: e.target.value.toUpperCase()})}
                        maxLength={1}
                        placeholder="VD: A"
                        required
                    />
                    <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-300">Loại Giá Ghế</label>
                         <select
                            className="flex h-11 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            value={form.seatPriceId}
                            onChange={e => setForm({...form, seatPriceId: Number(e.target.value)})}
                            required
                        >
                            {seatPrices.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.seatType} - {new Intl.NumberFormat('vi-VN').format(p.price)}đ
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <Input
                        label="Từ ghế số"
                        type="number"
                        min="1"
                        value={form.fromSeat}
                        onChange={e => setForm({...form, fromSeat: Number(e.target.value)})}
                        required
                    />
                     <Input
                        label="Đến ghế số"
                        type="number"
                        min="1"
                        value={form.toSeat}
                        onChange={e => setForm({...form, toSeat: Number(e.target.value)})}
                        required
                    />
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    Tạo Ghế
                </Button>
            </form>
        </div>
    );
};
