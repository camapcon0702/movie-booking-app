'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { showtimeApi } from '@/lib/api/user/showtime';
import { seatApi } from '@/lib/api/user/seat';
import { foodApi } from '@/lib/api/user/food';
import { movieApi } from '@/lib/api/user/movie';
import { Showtime } from '@/types/showtime';
import { Seat } from '@/types/seat';
import { Food } from '@/types/food';
import { Movie } from '@/types/movie';
import { FoodOrder } from '@/types/booking';
import { Film, ShoppingCart, UtensilsCrossed, Armchair, ChevronRight } from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function SeatSelectionPage() {
    const params = useParams();
    const router = useRouter();
    const movieId = Number(params.movieId);
    const showtimeId = Number(params.showtimeId);

    const [movie, setMovie] = useState<Movie | null>(null);
    const [showtime, setShowtime] = useState<Showtime | null>(null);
    const [seats, setSeats] = useState<Seat[]>([]);
    const [foods, setFoods] = useState<Food[]>([]);

    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [foodOrders, setFoodOrders] = useState<FoodOrder[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch showtime first to get auditoriumId
                const showtimeRes = await showtimeApi.getShowtimeById(showtimeId);
                const showtimeData = showtimeRes.data;
                setShowtime(showtimeData);

                // Fetch movie, seats, and foods in parallel
                const [movieRes, seatsRes, foodsRes] = await Promise.all([
                    movieApi.getMovieById(movieId),
                    seatApi.getSeatsByShowtime(showtimeId),
                    foodApi.getFoods(),
                ]);

                setMovie(movieRes.data);
                setSeats(seatsRes.data);
                setFoods(foodsRes.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Không thể tải thông tin');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [movieId, showtimeId]);

    const handleSeatClick = (seatId: number, isDisabled: boolean) => {
        if (isDisabled) return;

        setSelectedSeats(prev =>
            prev.includes(seatId)
                ? prev.filter(id => id !== seatId)
                : [...prev, seatId]
        );
    };

    const handleFoodQuantityChange = (foodId: number, delta: number) => {
        setFoodOrders(prev => {
            const existing = prev.find(order => order.foodId === foodId);

            if (!existing && delta > 0) {
                return [...prev, { foodId, quantity: 1 }];
            }

            if (existing) {
                const newQuantity = existing.quantity + delta;
                if (newQuantity <= 0) {
                    return prev.filter(order => order.foodId !== foodId);
                }
                return prev.map(order =>
                    order.foodId === foodId
                        ? { ...order, quantity: newQuantity }
                        : order
                );
            }

            return prev;
        });
    };

    const calculateTotal = () => {
        const seatTotal = selectedSeats.reduce((sum, seatId) => {
            const seat = seats.find(s => s.id === seatId);
            return sum + (seat?.seatType?.price || 0);
        }, 0);

        const foodTotal = foodOrders.reduce((sum, order) => {
            const food = foods.find(f => f.id === order.foodId);
            return sum + (food?.price || 0) * order.quantity;
        }, 0);

        return seatTotal + foodTotal;
    };

    const handleContinue = () => {
        if (selectedSeats.length === 0) {
            alert('Vui lòng chọn ít nhất một ghế');
            return;
        }

        // Store booking data in sessionStorage
        sessionStorage.setItem('bookingData', JSON.stringify({
            movieId,
            showtimeId,
            selectedSeats,
            foodOrders,
        }));

        router.push('/checkout');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-muted rounded w-1/3"></div>
                        <div className="h-96 bg-muted rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !movie || !showtime) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Film className="mx-auto h-16 w-16 text-gray-600 mb-4" />
                    <p className="text-gray-400 text-lg">{error || 'Không tìm thấy thông tin'}</p>
                </div>
            </div>
        );
    }

    // Group seats by row and sort
    const seatsByRow = seats
        .sort((a, b) => {
            // Sort by row chart first
            if (a.rowChart < b.rowChart) return -1;
            if (a.rowChart > b.rowChart) return 1;
            // Then by seat number
            const aNum = parseInt(a.seatNumber);
            const bNum = parseInt(b.seatNumber);
            return aNum - bNum;
        })
        .reduce((acc, seat) => {
            if (!acc[seat.rowChart]) {
                acc[seat.rowChart] = [];
            }
            acc[seat.rowChart].push(seat);
            return acc;
        }, {} as Record<string, Seat[]>);

    return (
        <div className="min-h-screen bg-background pb-24">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Chọn Ghế & Đồ Ăn</h1>
                    <p className="text-gray-400">
                        {movie.title} - {new Date(showtime.startTime).toLocaleString('vi-VN')}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Seat Map & Food */}
                    <div className="flex-1 space-y-8">
                        {/* Seat Map */}
                        <div className="bg-card rounded-lg border border-border p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Armchair className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-semibold text-white">Sơ Đồ Ghế</h2>
                            </div>

                            {/* Screen */}
                            <div className="mb-8">
                                <div className="w-full h-8 bg-gray-800 rounded-lg flex items-center justify-center mb-2 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.1)]">
                                    <span className="text-xs text-gray-500 uppercase tracking-widest">Màn Hình Chiếu</span>
                                </div>
                            </div>

                            {/* Seats */}
                            <div className="w-full">
                                {seats.length === 0 ? (
                                    <p className="text-center text-gray-400 py-8">Không có ghế nào</p>
                                ) : (
                                    <div className="space-y-3 w-full overflow-x-auto">
                                        {Object.entries(seatsByRow).map(([row, rowSeats]) => (
                                            <div key={row} className="flex items-center gap-4">
                                                {/* Row Label */}
                                                <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-400 bg-gray-900 rounded-full border border-gray-800 shrink-0">
                                                    {row}
                                                </div>

                                                {/* Seats in Row */}
                                                <div className="flex space-x-2 flex-1 justify-center">
                                                    {rowSeats.map(seat => {
                                                        const isSelected = selectedSeats.includes(seat.id);
                                                        const isBooked = !!seat.booked;
                                                        const isDisabled = !seat.status || isBooked;
                                                        const seatType = seat.seatType?.seatType || 'NORMAL';

                                                        // Color based on seat type
                                                        const getSeatColor = () => {
                                                            if (isBooked) return 'bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed';
                                                            if (!seat.status) return 'invisible'; // Hide inactive seats if needed, or style as disabled
                                                            if (isSelected) return 'bg-primary text-white border-primary scale-110';

                                                            switch (seatType) {
                                                                case 'VIP':
                                                                    return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/30';
                                                                case 'COUPLE':
                                                                    return 'bg-purple-500/20 text-purple-500 border-purple-500/50 hover:bg-purple-500/30';
                                                                default:
                                                                    return 'bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-600';
                                                            }
                                                        };

                                                        return (
                                                            <button
                                                                key={seat.id}
                                                                onClick={() => handleSeatClick(seat.id, isDisabled)}
                                                                disabled={isDisabled}
                                                                className={`
                                                                    h-8 sm:h-10 rounded-md text-xs font-semibold border transition-all
                                                                    ${seatType === 'COUPLE' ? 'w-16 sm:w-20' : 'w-8 sm:w-10'}
                                                                    ${getSeatColor()}
                                                                `}
                                                                title={`${seat.rowChart}${seat.seatNumber} - ${seatType} - ${new Intl.NumberFormat('vi-VN').format(seat.seatType.price)}đ ${isBooked ? '(Đã đặt)' : ''}`}
                                                            >
                                                                {seat.seatNumber}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Legend */}
                            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-border text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-gray-700/50 border border-gray-600"></div>
                                    <span className="text-gray-400">Thường</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-purple-500/20 border border-purple-500/50"></div>
                                    <span className="text-gray-400">Couple</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-yellow-500/20 border border-yellow-500/50"></div>
                                    <span className="text-gray-400">VIP</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-primary border border-primary"></div>
                                    <span className="text-gray-400">Đã chọn</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-gray-800 border border-gray-700"></div>
                                    <span className="text-gray-400">Đã đặt</span>
                                </div>
                            </div>
                        </div>

                        {/* Food Selection */}
                        <div className="bg-card rounded-lg border border-border p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <UtensilsCrossed className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-semibold text-white">Đồ Ăn & Nước Uống</h2>
                            </div>

                            {foods.length === 0 ? (
                                <p className="text-center text-gray-400 py-8">Không có đồ ăn</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {foods.map(food => {
                                        const order = foodOrders.find(o => o.foodId === food.id);
                                        const quantity = order?.quantity || 0;

                                        return (
                                            <div key={food.id} className="flex items-center gap-4 p-4 bg-background rounded-lg border border-border">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-white">{food.name}</h3>
                                                    <p className="text-sm text-primary font-semibold mt-1">
                                                        {new Intl.NumberFormat('vi-VN').format(food.price)}đ
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleFoodQuantityChange(food.id, -1)}
                                                        disabled={quantity === 0}
                                                        className="w-8 h-8 rounded-full bg-muted hover:bg-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 text-center font-semibold">{quantity}</span>
                                                    <button
                                                        onClick={() => handleFoodQuantityChange(food.id, 1)}
                                                        className="w-8 h-8 rounded-full bg-muted hover:bg-primary transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="lg:w-80 lg:shrink-0">
                        <div className="bg-card rounded-lg border border-border p-6 lg:sticky lg:top-4">
                            <div className="flex items-center gap-2 mb-6">
                                <ShoppingCart className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-semibold text-white">Tóm Tắt</h2>
                            </div>

                            <div className="space-y-4">
                                {/* Selected Seats */}
                                <div>
                                    <p className="text-sm text-gray-400 mb-2">Ghế đã chọn:</p>
                                    {selectedSeats.length === 0 ? (
                                        <p className="text-sm text-gray-500">Chưa chọn ghế</p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedSeats.map(seatId => {
                                                const seat = seats.find(s => s.id === seatId);
                                                return seat ? (
                                                    <span key={seatId} className="px-2 py-1 bg-primary/20 text-primary rounded text-sm">
                                                        {seat.rowChart}{seat.seatNumber}
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Food Orders */}
                                {foodOrders.length > 0 && (
                                    <div>
                                        <p className="text-sm text-gray-400 mb-2">Đồ ăn:</p>
                                        <div className="space-y-2">
                                            {foodOrders.map(order => {
                                                const food = foods.find(f => f.id === order.foodId);
                                                return food ? (
                                                    <div key={order.foodId} className="flex justify-between text-sm">
                                                        <span className="text-white">{food.name} x{order.quantity}</span>
                                                        <span className="text-primary">
                                                            {new Intl.NumberFormat('vi-VN').format(food.price * order.quantity)}đ
                                                        </span>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                )}

                                <div className="border-t border-border pt-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-semibold text-white">Tổng cộng:</span>
                                        <span className="text-2xl font-bold text-primary">
                                            {new Intl.NumberFormat('vi-VN').format(calculateTotal())}đ
                                        </span>
                                    </div>

                                    <Button
                                        onClick={handleContinue}
                                        disabled={selectedSeats.length === 0}
                                        className="w-full"
                                    >
                                        Tiếp tục
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
