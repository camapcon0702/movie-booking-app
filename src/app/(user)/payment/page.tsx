'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { bookingApi } from '@/lib/api/user/booking';
import { paymentApi } from '@/lib/api/user/payment';
import { Booking } from '@/types/booking';
import { CheckCircle, QrCode, Wallet, Home, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function PaymentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const bookingId = searchParams.get('bookingId');

    const [booking, setBooking] = useState<Booking | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'momo' | 'cash' | null>(null);
    const [momoPayUrl, setMomoPayUrl] = useState('');

    useEffect(() => {
        if (!bookingId) {
            router.push('/');
            return;
        }

        const fetchBooking = async () => {
            setIsLoading(true);
            try {
                const res = await bookingApi.getBookingById(Number(bookingId));
                setBooking(res.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Không thể tải thông tin đặt vé');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId, router]);

    const handlePayWithMomo = async () => {
        if (!booking) return;

        setIsProcessing(true);
        setError('');

        try {
            const response = await paymentApi.payWithMomo(booking.id);
            if (response.success && response.payUrl) {
                setMomoPayUrl(response.payUrl);
                setPaymentMethod('momo');
                // Open MoMo payment URL in new tab
                window.open(response.payUrl, '_blank');
            } else {
                setError(response.message || 'Không thể tạo thanh toán MoMo');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi khi tạo thanh toán MoMo');
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePayWithCash = async () => {
        if (!booking) return;

        setIsProcessing(true);
        setError('');

        try {
            const response = await paymentApi.payWithCash(booking.id);
            if (response.success) {
                setPaymentMethod('cash');
                // Refresh booking to get updated status
                const res = await bookingApi.getBookingById(booking.id);
                setBooking(res.data);
            } else {
                setError(response.message || 'Không thể xác nhận thanh toán tiền mặt');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi khi xác nhận thanh toán');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-muted rounded w-1/3"></div>
                        <div className="h-64 bg-muted rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !booking) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 text-lg mb-4">{error || 'Không tìm thấy thông tin đặt vé'}</p>
                    <Button onClick={() => router.push('/')}>
                        <Home className="mr-2 h-4 w-4" />
                        Về Trang Chủ
                    </Button>
                </div>
            </div>
        );
    }

    if (!booking) {
        return null;
    }

    const isPaid = booking.status === 'CONFIRMED';
    const isPending = booking.status === 'PENDING';

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Success Message */}
                    <div className="text-center mb-8">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isPaid ? 'bg-green-500/20' : 'bg-yellow-500/20'
                            }`}>
                            {isPaid ? (
                                <CheckCircle className="h-8 w-8 text-green-500" />
                            ) : (
                                <QrCode className="h-8 w-8 text-yellow-500" />
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {isPaid ? 'Thanh Toán Thành Công!' : 'Đặt Vé Thành Công!'}
                        </h1>
                        <p className="text-gray-400">
                            Mã đặt vé: <span className="text-primary font-semibold">#{booking.id}</span>
                        </p>
                    </div>

                    {/* Booking Details */}
                    <div className="bg-card rounded-lg border border-border p-6 mb-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Thông Tin Đặt Vé</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Mã đặt vé:</span>
                                <span className="text-white font-semibold">#{booking.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Trạng thái:</span>
                                <span className={`font-semibold ${isPaid ? 'text-green-500' :
                                    isPending ? 'text-yellow-500' :
                                        'text-red-500'
                                    }`}>
                                    {isPaid ? 'Đã thanh toán' :
                                        isPending ? 'Chờ thanh toán' :
                                            'Đã hủy'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Tổng tiền:</span>
                                <span className="text-primary text-lg font-bold">
                                    {new Intl.NumberFormat('vi-VN').format(booking.total)}đ
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Ngày đặt:</span>
                                <span className="text-white">
                                    {new Date(booking.createdAt).toLocaleString('vi-VN')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods - Only show if not paid */}
                    {isPending && !paymentMethod && (
                        <div className="bg-card rounded-lg border border-border p-6 mb-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Chọn Phương Thức Thanh Toán</h2>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 flex items-center text-sm">
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-3">
                                {/* MoMo Payment */}
                                <button
                                    onClick={handlePayWithMomo}
                                    disabled={isProcessing}
                                    className="w-full p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-pink-500/50 rounded-lg hover:border-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                                                <QrCode className="h-6 w-6 text-pink-500" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="font-semibold text-white">Thanh toán MoMo</h3>
                                                <p className="text-sm text-gray-400">Quét mã QR để thanh toán</p>
                                            </div>
                                        </div>
                                        {isProcessing && <Loader2 className="h-5 w-5 text-pink-500 animate-spin" />}
                                    </div>
                                </button>

                                {/* Cash Payment */}
                                <button
                                    onClick={handlePayWithCash}
                                    disabled={isProcessing}
                                    className="w-full p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-lg hover:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                                                <Wallet className="h-6 w-6 text-green-500" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="font-semibold text-white">Thanh toán tại quầy</h3>
                                                <p className="text-sm text-gray-400">Thanh toán tiền mặt khi nhận vé</p>
                                            </div>
                                        </div>
                                        {isProcessing && <Loader2 className="h-5 w-5 text-green-500 animate-spin" />}
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* MoMo QR Display */}
                    {paymentMethod === 'momo' && momoPayUrl && (
                        <div className="bg-card rounded-lg border border-border p-6 mb-6">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <QrCode className="h-5 w-5 text-pink-500" />
                                    <h2 className="text-xl font-semibold text-white">Thanh Toán MoMo</h2>
                                </div>
                                <p className="text-sm text-gray-400 mb-4">
                                    Vui lòng mở ứng dụng MoMo và quét mã QR để thanh toán
                                </p>
                                <div className="inline-block p-4 bg-white rounded-lg mb-4">
                                    <div className="w-64 h-64 bg-gray-200 flex items-center justify-center">
                                        <div className="text-center">
                                            <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-600 text-sm">Mã QR MoMo</p>
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={() => window.open(momoPayUrl, '_blank')} variant="outline">
                                    Mở lại link thanh toán
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Cash Payment Confirmation */}
                    {paymentMethod === 'cash' && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mb-6">
                            <div className="text-center">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                                <h3 className="font-semibold text-white mb-2">Đã Xác Nhận Thanh Toán Tại Quầy</h3>
                                <p className="text-sm text-gray-300">
                                    Vui lòng thanh toán tiền mặt khi nhận vé tại quầy
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-bold text-white mb-2">{booking.nameMovie}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                            <div className="flex items-center gap-2">
                                <span>{new Date(booking.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                <span>•</span>
                                <span>{new Date(booking.startTime).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>{booking.tickets[0]?.auditoriumName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>Ghế: {booking.tickets.map(t => t.seatName).join(', ')}</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-primary">
                                {new Intl.NumberFormat('vi-VN').format(booking.total)}đ
                            </span>
                            <span className="text-sm text-gray-400">tổng cộng</span>
                        </div>
                        <h3 className="font-semibold text-white mb-3 mt-6">Hướng Dẫn</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span>Vui lòng đến rạp trước giờ chiếu 15 phút</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span>Xuất trình mã đặt vé #{booking.id} tại quầy để nhận vé</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span>Mang theo giấy tờ tùy thân nếu phim có giới hạn độ tuổi</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span>Liên hệ hotline nếu cần hỗ trợ: 1900-xxxx</span>
                            </li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Button onClick={() => router.push('/')} variant="outline" className="flex-1">
                            <Home className="mr-2 h-4 w-4" />
                            Về Trang Chủ
                        </Button>
                        <Button onClick={() => router.push('/history')} className="flex-1">
                            Xem Lịch Sử
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
