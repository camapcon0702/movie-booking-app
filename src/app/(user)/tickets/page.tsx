'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ticketApi } from '@/lib/api/user/ticket';
import { Ticket } from '@/types/ticket';
import { Ticket as TicketIcon, Calendar, Clock, MapPin, Film, QrCode } from 'lucide-react';
import { Button } from '@/components/common/Button';
import Image from 'next/image';

export default function TicketsPage() {
    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTickets = async () => {
            setIsLoading(true);
            try {
                const res = await ticketApi.getMyTickets();
                setTickets(res.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Không thể tải danh sách vé');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTickets();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-muted rounded w-1/3"></div>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-48 bg-muted rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Vé Của Tôi</h1>
                    <p className="text-gray-400">Danh sách vé xem phim đã mua</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
                        {error}
                    </div>
                )}

                {tickets.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                            <TicketIcon className="h-8 w-8 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Chưa có vé nào</h3>
                        <p className="text-gray-400 mb-6">Bạn chưa có vé xem phim nào. Đặt vé ngay thôi!</p>
                        <Button onClick={() => router.push('/movies')}>
                            <Film className="mr-2 h-4 w-4" />
                            Xem Phim Đang Chiếu
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tickets.map((ticket) => {
                            const showtime = ticket.booking?.showtime;
                            const movie = showtime?.movie;
                            const auditorium = showtime?.auditorium;
                            const seat = ticket.seat;

                            if (!movie || !showtime) return null;

                            return (
                                <div key={ticket.id} className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-all group">
                                    {/* Ticket Header (Movie Poster Background usually, but keeping simple for now) */}
                                    <div className="relative h-24 bg-gradient-to-r from-gray-900 to-gray-800 p-4 flex items-center gap-4">
                                        <div className="relative w-16 h-20 shrink-0 rounded overflow-hidden border border-gray-700 shadow-lg -mb-10 z-10">
                                            {movie.posterUrl ? (
                                                <Image
                                                    src={movie.posterUrl}
                                                    alt={movie.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                                    <Film className="h-8 w-8 text-gray-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">
                                                {movie.title}
                                            </h3>
                                            <p className="text-xs text-gray-400 flex items-center mt-1">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {new Date(showtime.startTime).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Ticket Body */}
                                    <div className="p-4 pt-8 space-y-3">
                                        {/* Time & Location */}
                                        <div className="flex justify-between items-start text-sm">
                                            <div className="space-y-1">
                                                <div className="flex items-center text-gray-300">
                                                    <Clock className="h-3.5 w-3.5 mr-2 text-primary" />
                                                    {new Date(showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="flex items-center text-gray-300">
                                                    <MapPin className="h-3.5 w-3.5 mr-2 text-primary" />
                                                    {auditorium?.name}, {auditorium?.cinema?.name}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-gray-500">Ghế</div>
                                                <div className="text-xl font-bold text-white">
                                                    {seat?.rowChart}{seat?.seatNumber}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="relative py-2">
                                            <div className="absolute left-0 top-1/2 w-full border-t border-dashed border-gray-700"></div>
                                            <div className="absolute left-0 top-1/2 -mt-2 -ml-6 w-4 h-4 bg-background rounded-full"></div>
                                            <div className="absolute right-0 top-1/2 -mt-2 -mr-6 w-4 h-4 bg-background rounded-full"></div>
                                        </div>

                                        {/* Footer / QR Code Placeholder */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${ticket.status ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span className="text-xs text-gray-400">
                                                    {ticket.status ? 'Hợp lệ' : 'Đã hủy'}
                                                </span>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8 text-xs hover:text-primary">
                                                <QrCode className="h-3.5 w-3.5 mr-1" />
                                                Mã QR
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
