'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { voucherApi } from '@/lib/api/user/voucher';
import { bookingApi } from '@/lib/api/user/booking';
import { seatApi } from '@/lib/api/user/seat';
import { foodApi } from '@/lib/api/user/food';
import { showtimeApi } from '@/lib/api/user/showtime';
import { movieApi } from '@/lib/api/user/movie';
import { Voucher } from '@/types/voucher';
import { Seat } from '@/types/seat';
import { Food } from '@/types/food';
import { Showtime } from '@/types/showtime';
import { Movie } from '@/types/movie';
import { FoodOrder } from '@/types/booking';
import { Ticket, Tag, CreditCard, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface BookingData {
    movieId: number;
    showtimeId: number;
    selectedSeats: number[];
    foodOrders: FoodOrder[];
}

export default function CheckoutPage() {
    const router = useRouter();

    const [bookingData, setBookingData] = useState<BookingData | null>(null);
    const [movie, setMovie] = useState<Movie | null>(null);
    const [showtime, setShowtime] = useState<Showtime | null>(null);
    const [seats, setSeats] = useState<Seat[]>([]);
    const [foods, setFoods] = useState<Food[]>([]);
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadBookingData = async () => {
            // Get booking data from sessionStorage
            const storedData = sessionStorage.getItem('bookingData');
            if (!storedData) {
                router.push('/');
                return;
            }

            const data: BookingData = JSON.parse(storedData);
            setBookingData(data);

            setIsLoading(true);
            try {
                // Fetch all required data
                const [movieRes, showtimeRes, vouchersRes] = await Promise.all([
                    movieApi.getMovieById(data.movieId),
                    showtimeApi.getShowtimeById(data.showtimeId),
                    voucherApi.getVouchers(),
                ]);

                setMovie(movieRes.data);
                setShowtime(showtimeRes.data);
                setVouchers(vouchersRes.data);

                // Fetch seats and foods
                const [seatsRes, foodsRes] = await Promise.all([
                    seatApi.getSeatsByAuditorium(showtimeRes.data.auditoriumId),
                    foodApi.getFoods(),
                ]);

                // Filter selected seats and foods
                setSeats(seatsRes.data.filter(s => data.selectedSeats.includes(s.id)));
                setFoods(foodsRes.data.filter(f => data.foodOrders.some(o => o.foodId === f.id)));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Không thể tải thông tin');
            } finally {
                setIsLoading(false);
            }
        };

        loadBookingData();
    }, [router]);

    const calculateSubtotal = () => {
        if (!bookingData) return 0;

        const seatTotal = seats.reduce((sum, seat) => sum + (seat.seatType?.price || 0), 0);
        const foodTotal = bookingData.foodOrders.reduce((sum, order) => {
            const food = foods.find(f => f.id === order.foodId);
            return sum + (food?.price || 0) * order.quantity;
        }, 0);

        return seatTotal + foodTotal;
    };

    const calculateDiscount = () => {
        if (!selectedVoucher) return 0;

        const subtotal = calculateSubtotal();

        // Check if it's percentage discount
        if (selectedVoucher.discountPercentage) {
            const discount = (subtotal * selectedVoucher.discountPercentage) / 100;
            return selectedVoucher.discountMax
                ? Math.min(discount, selectedVoucher.discountMax)
                : discount;
        }

        // Otherwise it's fixed amount discount
        return selectedVoucher.discountAmount || 0;
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscount();
    };

    const handleCreateBooking = async () => {
        if (!bookingData) return;

        setIsCreating(true);
        setError('');

        try {
            const payload = {
                showtimeId: bookingData.showtimeId,
                voucherId: selectedVoucher?.id,
                seatId: bookingData.selectedSeats,
                orders: bookingData.foodOrders,
            };

            const res = await bookingApi.createBooking(payload);

            // Clear booking data
            sessionStorage.removeItem('bookingData');

            // Navigate to payment page
            router.push(`/payment?bookingId=${res.data.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Tạo đơn đặt vé thất bại');
        } finally {
            setIsCreating(false);
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

    if (!bookingData || !movie || !showtime) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Ticket className="mx-auto h-16 w-16 text-gray-600 mb-4" />
                    <p className="text-gray-400 text-lg">Không tìm thấy thông tin đặt vé</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-24">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-white mb-8">Xác Nhận Đặt Vé</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Booking Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Movie & Showtime Info */}
                        <div className="bg-card rounded-lg border border-border p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Thông Tin Phim</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Phim:</span>
                                    <span className="text-white font-semibold">{movie.title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Suất chiếu:</span>
                                    <span className="text-white">
                                        {new Date(showtime.startTime).toLocaleString('vi-VN')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Seats */}
                        <div className="bg-card rounded-lg border border-border p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Ghế Đã Chọn</h2>
                            <div className="flex flex-wrap gap-2">
                                {seats.map(seat => (
                                    <div key={seat.id} className="px-4 py-2 bg-primary/20 text-primary rounded-lg">
                                        <span className="font-semibold">{seat.rowChart}{seat.seatNumber}</span>
                                        <span className="text-sm ml-2">
                                            ({new Intl.NumberFormat('vi-VN').format(seat.seatType?.price || 0)}đ)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Food */}
                        {bookingData.foodOrders.length > 0 && (
                            <div className="bg-card rounded-lg border border-border p-6">
                                <h2 className="text-xl font-semibold text-white mb-4">Đồ Ăn & Nước Uống</h2>
                                <div className="space-y-3">
                                    {bookingData.foodOrders.map(order => {
                                        const food = foods.find(f => f.id === order.foodId);
                                        return food ? (
                                            <div key={order.foodId} className="flex justify-between items-center">
                                                <div>
                                                    <span className="text-white font-semibold">{food.name}</span>
                                                    <span className="text-gray-400 ml-2">x{order.quantity}</span>
                                                </div>
                                                <span className="text-primary font-semibold">
                                                    {new Intl.NumberFormat('vi-VN').format(food.price * order.quantity)}đ
                                                </span>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Voucher Selection */}
                        <div className="bg-card rounded-lg border border-border p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Tag className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-semibold text-white">Mã Giảm Giá</h2>
                            </div>

                            {vouchers.length === 0 ? (
                                <p className="text-gray-400 text-sm">Không có mã giảm giá</p>
                            ) : (
                                <div className="space-y-3">
                                    {vouchers.map(voucher => (
                                        <div
                                            key={voucher.id}
                                            onClick={() => setSelectedVoucher(
                                                selectedVoucher?.id === voucher.id ? null : voucher
                                            )}
                                            className={`
                                                p-4 rounded-lg border-2 cursor-pointer transition-all
                                                ${selectedVoucher?.id === voucher.id
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-border hover:border-primary/50'
                                                }
                                            `}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-white">{voucher.code}</h3>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        Giảm {voucher.discountPercentage
                                                            ? `${voucher.discountPercentage}%`
                                                            : `${new Intl.NumberFormat('vi-VN').format(voucher.discountAmount || 0)}đ`
                                                        }
                                                    </p>
                                                </div>
                                                {selectedVoucher?.id === voucher.id && (
                                                    <span className="text-primary text-sm font-semibold">✓ Đã chọn</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-lg border border-border p-6 sticky top-4">
                            <div className="flex items-center gap-2 mb-6">
                                <CreditCard className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-semibold text-white">Thanh Toán</h2>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 flex items-center text-sm">
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Tạm tính:</span>
                                    <span className="text-white">
                                        {new Intl.NumberFormat('vi-VN').format(calculateSubtotal())}đ
                                    </span>
                                </div>

                                {selectedVoucher && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Giảm giá:</span>
                                        <span className="text-green-500">
                                            -{new Intl.NumberFormat('vi-VN').format(calculateDiscount())}đ
                                        </span>
                                    </div>
                                )}

                                <div className="border-t border-border pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-white">Tổng cộng:</span>
                                        <span className="text-2xl font-bold text-primary">
                                            {new Intl.NumberFormat('vi-VN').format(calculateTotal())}đ
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleCreateBooking}
                                isLoading={isCreating}
                                className="w-full"
                            >
                                Xác Nhận Đặt Vé
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
