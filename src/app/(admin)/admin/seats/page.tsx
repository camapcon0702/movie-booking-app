'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { auditoriumApi } from '@/lib/api/admin/auditorium';
import { seatApi } from '@/lib/api/admin/seat';
import { Auditorium } from '@/types/auditorium';
import { Seat } from '@/types/seat';
import { Monitor, AlertTriangle } from 'lucide-react';
import { SeatMap } from '@/components/admin/seats/SeatMap';
import { BulkCreateSeatForm } from '@/components/admin/seats/BulkCreateSeatForm';

import { UpdateSeatModal } from '@/components/admin/seats/UpdateSeatModal';

export default function SeatManagementPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const auditoriumId = Number(searchParams.get('auditoriumId'));

    const [auditoriums, setAuditoriums] = useState<Auditorium[]>([]);
    const [seats, setSeats] = useState<Seat[]>([]);
    
    const [isLoadingAuditoriums, setIsLoadingAuditoriums] = useState(true);
    const [isLoadingSeats, setIsLoadingSeats] = useState(false);
    const [isLoadingBulk, setIsLoadingBulk] = useState(false); // Bulk delete loading
    const [error, setError] = useState('');
    
    // Bulk Selection State
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    
    // Modals & States
    const [isCreating, setIsCreating] = useState(false);
    const [editingSeat, setEditingSeat] = useState<Seat | null>(null);

    useEffect(() => {
        // Fetch Auditoriums
        const fetchAuditoriums = async () => {
            try {
                const res = await auditoriumApi.getAuditoriums();
                setAuditoriums(res.data);
            } catch {
                setError('Không thể tải danh sách phòng chiếu');
            } finally {
                setIsLoadingAuditoriums(false);
            }
        };
        fetchAuditoriums();
    }, []);

    useEffect(() => {
        if (auditoriumId) {
            fetchSeats(auditoriumId);
        } else {
            setSeats([]);
        }
    }, [auditoriumId]);

    const fetchSeats = async (id: number) => {
        setIsLoadingSeats(true);
        try {
            const res = await seatApi.getSeatsByAuditorium(id);
            setSeats(res.data);
            setError('');
        } catch (err: any) {
            setError(err instanceof Error ? err.message : 'Không thể tải sơ đồ ghế');
        } finally {
            setIsLoadingSeats(false);
        }
    };

    const handleAuditoriumSelect = (id: number) => {
        router.push(`/admin/seats?auditoriumId=${id}`);
    };

    const handleSelectSeat = (seat: Seat) => {
        setSelectedSeats(prev => {
            const exists = prev.find(s => s.id === seat.id);
            if (exists) {
                return prev.filter(s => s.id !== seat.id);
            }
            return [...prev, seat];
        });
    };

    const handleClearSelection = () => {
        setSelectedSeats([]);
    };

    const handleBulkUpdate = () => {
        if (selectedSeats.length === 0) return;
        setEditingSeat(selectedSeats[0]); // Flag to open modal
    };

    const handleBulkDelete = async () => {
        if (selectedSeats.length === 0) return;
        if (!window.confirm(`Bạn có chắc muốn xóa ${selectedSeats.length} ghế đã chọn không?`)) return;

        setIsLoadingBulk(true);
        try {
            await Promise.all(selectedSeats.map(seat => seatApi.deleteSeat(seat.id)));
            fetchSeats(auditoriumId!);
            setSelectedSeats([]);
        } catch {
            alert('Xóa thất bại một số ghế');
            fetchSeats(auditoriumId!);
        } finally {
            setIsLoadingBulk(false);
        }
    };

    const handleDeleteSeat = async (seat: Seat) => {
        if (!window.confirm(`Bạn có chắc muốn xóa ghế ${seat.rowChart}${seat.seatNumber} không?`)) return;
        try {
            await seatApi.deleteSeat(seat.id);
            fetchSeats(auditoriumId);
        } catch {
            alert('Xóa ghế thất bại');
        }
    };



    const handleDeleteRow = async (rowChart: string) => {
        const seatsInRow = seats.filter(s => s.rowChart === rowChart);
        if (seatsInRow.length === 0) return;

        if (!window.confirm(`⚠️ Nguy hiểm: Bạn sắp xoá toàn bộ ${seatsInRow.length} ghế ở hàng ${rowChart}.\nHành động này KHÔNG THỂ hoàn tác.`)) return;

        // Optimistic UI could be tricky here, so we'll show global loading or similar.
        // Ideally we should have a loading state for this operation specifically.
        const confirmSecond = window.confirm(`Xác nhận lần cuối: Xoá hàng ${rowChart}?`);
        if (!confirmSecond) return;

        setIsLoadingSeats(true); // Reuse main loading indicator or create new one
        try {
            // Execute parallel deletion
            // Note: If one fails, Promise.all will reject. 
            // In production, might want Promise.allSettled to delete as many as possible.
            // Requirement says: "If one delete fails: Show error". So Promise.all is fine.
            await Promise.all(seatsInRow.map(seat => seatApi.deleteSeat(seat.id)));
            fetchSeats(auditoriumId);
        } catch (err: any) {
            alert(`Xóa hàng thất bại: ${err instanceof Error ? err.message : 'Lỗi không xác định'}`);
            fetchSeats(auditoriumId); // Refresh to see what was actually deleted
        } finally {
            setIsLoadingSeats(false);
        }
    };

    // If no auditorium selected, show selector
    if (!auditoriumId) {
        return (
            <div className="space-y-6">
                <div>
                     <h1 className="text-3xl font-bold tracking-tight">Quản lý Ghế & Sơ đồ</h1>
                     <p className="text-gray-400">Chọn phòng chiếu để thiết lập sơ đồ ghế</p>
                </div>

                {isLoadingAuditoriums ? (
                     <div className="p-8 text-center text-gray-400">Đang tải danh sách phòng...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {auditoriums.map(aud => (
                            <button 
                                key={aud.id}
                                onClick={() => handleAuditoriumSelect(aud.id)}
                                className="flex flex-col items-center p-8 bg-card border border-border rounded-lg hover:border-primary transition-all group text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <Monitor className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-white">{aud.name}</h3>
                                <p className="text-sm text-gray-400 mt-2">Nhấn để quản lý ghế</p>
                            </button>
                        ))}
                         {auditoriums.length === 0 && (
                            <div className="col-span-3 text-center p-8 text-gray-500">
                                Chưa có phòng chiếu nào. Hãy tạo phòng chiếu trước.
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    const currentAuditorium = auditoriums.find(a => a.id === auditoriumId);

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
             <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-4">
                     <Button 
                        variant="ghost" 
                        onClick={() => router.push('/admin/seats')}
                        className="text-gray-400 hover:text-white"
                    >
                        Thay đổi phòng
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center">
                            <Monitor className="mr-2 h-6 w-6 text-primary" />
                            {currentAuditorium ? currentAuditorium.name : `Phòng ${auditoriumId}`}
                        </h1>
                        <p className="text-sm text-gray-400">Quản lý sơ đồ và giá ghế</p>
                    </div>
                </div>

                 <Button 
                    onClick={() => setIsCreating(!isCreating)}
                    variant={isCreating ? "secondary" : "primary"}
                >
                    {isCreating ? 'Đóng Form' : 'Thêm Ghế Mới'}
                </Button>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 flex items-center shrink-0">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    {error}
                </div>
            )}

            <div className="flex flex-1 gap-6 min-h-0 overflow-hidden">
                {/* Main Content: Seat Map */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    {isLoadingSeats ? (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            Đang tải sơ đồ ghế...
                        </div>
                    ) : (
                        <SeatMap 
                            seats={seats}
                            selectedSeatIds={selectedSeats.map(s => s.id)}
                            onSelectSeat={handleSelectSeat}
                            onDeleteRow={handleDeleteRow}
                        />
                    )}
                </div>

                {/* Sidebar: Bulk Form */}
                {isCreating && (
                    <div className="w-80 shrink-0 overflow-y-auto animate-in slide-in-from-right duration-200">
                        <BulkCreateSeatForm 
                            auditoriumId={auditoriumId} 
                            onSuccess={() => fetchSeats(auditoriumId)} 
                        />
                    </div>
                )}
            </div>

            {/* Floating Action Bar */}
            {selectedSeats.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 border border-gray-700 shadow-2xl rounded-full px-6 py-3 flex items-center space-x-4 animate-in slide-in-from-bottom-5 duration-200">
                    <span className="text-sm font-semibold text-white">
                        Đã chọn {selectedSeats.length} ghế
                    </span>
                    <div className="h-4 w-px bg-gray-700"></div>
                    <button 
                        onClick={handleBulkUpdate}
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                        Cập nhật loại ghế
                    </button>
                    <button 
                         onClick={handleBulkDelete}
                         className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
                         disabled={isLoadingBulk}
                    >
                        {isLoadingBulk ? 'Đang xóa...' : 'Xóa'}
                    </button>
                    <div className="h-4 w-px bg-gray-700"></div>
                    <button 
                         onClick={handleClearSelection}
                         className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Hủy chọn
                    </button>
                </div>
            )}

            {/* Update Modal */}
            {editingSeat && (
                <UpdateSeatModal 
                    seats={selectedSeats.length > 0 ? selectedSeats : [editingSeat]} 
                    onClose={() => setEditingSeat(null)}
                    onSuccess={() => {
                        setEditingSeat(null);
                        setSelectedSeats([]); 
                        fetchSeats(auditoriumId);
                    }}
                />
            )}
        </div>
    );
}
