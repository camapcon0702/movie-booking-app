'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { bookingApi } from '@/lib/api/user/booking';
import { Booking } from '@/types/booking';
import { Ticket, Calendar, Clock, CreditCard, Film, ChevronRight, MapPin, QrCode } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/common/Button';

export default function BookingHistoryPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'bookings' | 'tickets'>('bookings');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await bookingApi.getMyBookings();
        setBookings(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải lịch sử đặt vé');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Derive tickets from bookings
  const allTickets = bookings.flatMap(booking =>
    booking.tickets.map(ticket => ({
      ...ticket,
      movieName: booking.nameMovie,
      startTime: booking.startTime,
      bookingStatus: booking.status
    }))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'PENDING':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'CANCELLED':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'PENDING':
        return 'Chờ thanh toán';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
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
          <h1 className="text-3xl font-bold text-white mb-2">Lịch Sử & Vé Của Tôi</h1>
          <p className="text-gray-400">Quản lý các giao dịch và vé xem phim</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 mb-8">
          <button
            className={`py-4 px-6 font-medium text-sm transition-colors relative ${activeTab === 'bookings' ? 'text-primary' : 'text-gray-400 hover:text-white'
              }`}
            onClick={() => setActiveTab('bookings')}
          >
            Lịch sử giao dịch
            {activeTab === 'bookings' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
            )}
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm transition-colors relative ${activeTab === 'tickets' ? 'text-primary' : 'text-gray-400 hover:text-white'
              }`}
            onClick={() => setActiveTab('tickets')}
          >
            Vé của tôi
            {activeTab === 'tickets' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {activeTab === 'bookings' ? (
          bookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                <Ticket className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Chưa có giao dịch nào</h3>
              <p className="text-gray-400 mb-6">Bạn chưa thực hiện giao dịch nào. Hãy bắt đầu đặt vé ngay!</p>
              <Button onClick={() => router.push('/movies')}>
                <Film className="mr-2 h-4 w-4" />
                Xem Phim
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left: Booking Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Ticket className="h-5 w-5 text-primary" />
                            <span className="text-sm text-gray-400">Mã đặt vé</span>
                          </div>
                          <p className="text-lg font-semibold text-white">#{booking.id}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusText(booking.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Film className="h-4 w-4" />
                          <span className="text-white font-medium">{booking.nameMovie}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(booking.startTime).toLocaleString('vi-VN')}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-400">
                        <span className="mr-2">Ghế:</span>
                        <span className="text-white">
                          {booking.tickets.map(t => `${t.seatName} (${t.auditoriumName})`).join(', ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <span className="text-xl font-bold text-primary">
                          {new Intl.NumberFormat('vi-VN').format(booking.total)}đ
                        </span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => router.push(`/payment?bookingId=${booking.id}`)}
                        variant="outline"
                        size="sm"
                      >
                        Xem Chi Tiết
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Tickets Tab */
          allTickets.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                <Ticket className="h-8 w-8 text-gray-600" />
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
              {allTickets.map((ticket) => (
                <div key={ticket.id} className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-all group">
                  {/* Ticket Header */}
                  <div className="relative h-24 bg-linear-to-r from-gray-900 to-gray-800 p-4 flex items-center gap-4">
                    <div className="relative w-16 h-20 shrink-0 rounded overflow-hidden border border-gray-700 shadow-lg -mb-10 z-10 flex items-center justify-center bg-gray-800">
                      <Film className="h-8 w-8 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">
                        {ticket.movieName}
                      </h3>
                      <p className="text-xs text-gray-400 flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(ticket.startTime).toLocaleDateString('vi-VN')}
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
                          {new Date(ticket.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center text-gray-300">
                          <MapPin className="h-3.5 w-3.5 mr-2 text-primary" />
                          {ticket.auditoriumName}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Ghế</div>
                        <div className="text-xl font-bold text-white">
                          {ticket.seatName}
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="relative py-2">
                      <div className="absolute left-0 top-1/2 w-full border-t border-dashed border-gray-700"></div>
                      <div className="absolute left-0 top-1/2 -mt-2 -ml-6 w-4 h-4 bg-background rounded-full"></div>
                      <div className="absolute right-0 top-1/2 -mt-2 -mr-6 w-4 h-4 bg-background rounded-full"></div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${ticket.bookingStatus === 'CONFIRMED' ? 'bg-green-500' : (ticket.bookingStatus === 'CANCELLED' ? 'bg-red-500' : 'bg-yellow-500')}`}></div>
                        <span className="text-xs text-gray-400">
                          {getStatusText(ticket.bookingStatus)}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 text-xs hover:text-primary">
                        <QrCode className="h-3.5 w-3.5 mr-1" />
                        Mã QR
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
