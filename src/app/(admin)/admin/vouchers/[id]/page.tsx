'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { voucherApi } from '@/lib/api/admin/voucher';

export default function EditVoucherPage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const [form, setForm] = useState({ 
        code: '', 
        discountAmount: '', 
        discountPercentage: '', 
        discountMax: '',
        expiryDate: '',
        active: true 
    });
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
             if (!id) return;
            setIsLoading(true);
            try {
                const res = await voucherApi.getVoucherById(id);
                 
                // Format datetime
                const date = new Date(res.data.expiryDate);
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                const formattedDate = date.toISOString().slice(0, 16);

                setForm({
                    code: res.data.code,
                    discountAmount: res.data.discountAmount?.toString() || '',
                    discountPercentage: res.data.discountPercentage?.toString() || '',
                    discountMax: res.data.discountMax?.toString() || '',
                    expiryDate: formattedDate,
                    active: res.data.active,
                });
            } catch (err: any) {
                setError(err.message || 'Không thể tải thông tin voucher');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const hasAmount = !!form.discountAmount && Number(form.discountAmount) > 0;
        const hasPercentage = !!form.discountPercentage && Number(form.discountPercentage) > 0;

        if (!hasAmount && !hasPercentage) {
            setError('Phải nhập số tiền giảm HOẶC phần trăm giảm');
            return;
        }
        if (hasAmount && hasPercentage) {
            setError('Chỉ được chọn một loại giảm giá (tiền hoặc phần trăm)');
            return;
        }

        setIsSaving(true);

        try {
            const payload = {
                code: form.code,
                expiryDate: new Date(form.expiryDate).toISOString(),
                active: form.active,
                discountAmount: hasAmount ? Number(form.discountAmount) : undefined,
                discountPercentage: hasPercentage ? Number(form.discountPercentage) : undefined,
                discountMax: form.discountMax ? Number(form.discountMax) : undefined,
            };

            await voucherApi.updateVoucher(id, payload);
            router.push('/admin/vouchers');
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
                    <div className="h-10 bg-muted rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center space-x-4">
                <Link href="/admin/vouchers">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa Voucher</h1>
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
                    label="Mã Code"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    required
                    disabled={isSaving}
                />
                
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Giảm theo %"
                        type="number"
                        min="0"
                        max="100"
                        value={form.discountPercentage}
                        onChange={(e) => setForm({ ...form, discountPercentage: e.target.value, discountAmount: '' })}
                        disabled={isSaving || !!form.discountAmount}
                    />
                    <Input
                        label="Giảm theo tiền (VNĐ)"
                        type="number"
                        min="0"
                        value={form.discountAmount}
                        onChange={(e) => setForm({ ...form, discountAmount: e.target.value, discountPercentage: '' })}
                        disabled={isSaving || !!form.discountPercentage}
                    />
                </div>

                <Input
                    label="Giảm tối đa (VNĐ)"
                    type="number"
                    min="0"
                    placeholder="Để trống nếu không giới hạn"
                    value={form.discountMax}
                    onChange={(e) => setForm({ ...form, discountMax: e.target.value })}
                    disabled={isSaving}
                />

                <Input
                    label="Ngày hết hạn"
                    type="datetime-local"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    required
                    disabled={isSaving}
                />

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="active"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={form.active}
                        onChange={(e) => setForm({ ...form, active: e.target.checked })}
                        disabled={isSaving}
                    />
                    <label htmlFor="active" className="text-sm font-medium text-gray-300">
                        Đang hoạt động
                    </label>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-800">
                    <Link href="/admin/vouchers">
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
