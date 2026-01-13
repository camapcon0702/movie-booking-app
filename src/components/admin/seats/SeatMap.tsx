'use client';

import React from 'react';
import { Seat } from '@/types/seat';
import { cn } from '@/lib/utils/cn';
import { Trash2, Armchair } from 'lucide-react';


interface SeatMapProps {
    seats: Seat[];
    selectedSeatIds: number[];
    onSelectSeat: (seat: Seat) => void;
    onDeleteRow: (rowChart: string) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({
    seats,
    selectedSeatIds,
    onSelectSeat,
    onDeleteRow
}) => {
    // 1. Group seats by Row Chart
    const rows = React.useMemo(() => {
        const grouped: Record<string, Seat[]> = {};
        seats.forEach(seat => {
            if (!grouped[seat.rowChart]) {
                grouped[seat.rowChart] = [];
            }
            grouped[seat.rowChart].push(seat);
        });

        // Sort rows alphabetically (A, B, C...)
        const sortedKeys = Object.keys(grouped).sort();

        // Sort seats within row by seatNumber (numeric)
        const result = sortedKeys.map(rowKey => ({
            row: rowKey,
            seats: grouped[rowKey].sort((a, b) => Number(a.seatNumber) - Number(b.seatNumber))
        }));

        return result;
    }, [seats]);

    // Helper: Badge Style based on type
    const getSeatColor = (seatType: string, isDisabled: boolean) => {
        if (isDisabled) return 'bg-gray-800 text-gray-600 border-gray-700';
        switch (seatType) {
            case 'VIP': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/30';
            case 'COUPLE': return 'bg-purple-500/20 text-purple-500 border-purple-500/50 hover:bg-purple-500/30';
            default: return 'bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-600'; // NORMAL
        }
    };

    if (seats.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-800 rounded-lg text-gray-500">
                <Armchair className="w-12 h-12 mb-4 opacity-50" />
                <p>Chưa có ghế nào trong phòng chiếu này.</p>
                <p className="text-sm">Hãy sử dụng form bên cạnh để tạo ghế.</p>
            </div>
        );
    }

    return (
        <div className="overflow-auto p-6 bg-card border border-border rounded-lg min-h-[500px]">
            <div className="flex flex-col space-y-4 min-w-[500px]">
                {/* Screen Visual */}
                <div className="w-full h-8 bg-gray-800 rounded-lg flex items-center justify-center mb-22 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.1)]">
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Màn Hình Chiếu</span>
                </div>

                {rows.map(({ row, seats }) => (
                    <div key={row} className="flex items-center space-x-6">
                        {/* Row Label & Row Delete */}
                        <div className="flex items-center space-x-2 shrink-0">
                            <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-400 bg-gray-900 rounded-full border border-gray-800">
                                {row}
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeleteRow(row); }}
                                className="text-gray-600 hover:text-red-500 transition-colors"
                                title={`Xóa toàn bộ hàng ${row}`}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Seats */}
                        <div className="flex space-x-2 flex-1 justify-center">
                            {seats.map(seat => {
                                const seatType = seat.seatType?.seatType || 'NORMAL';
                                const isSelected = selectedSeatIds.includes(seat.id);

                                return (
                                    <div key={seat.id} className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectSeat(seat);
                                            }}
                                            className={cn(
                                                "h-10 rounded-md text-xs font-semibold border transition-all flex items-center justify-center",
                                                seatType === 'COUPLE' ? "w-20" : "w-10",
                                                getSeatColor(seatType, !seat.status),
                                                isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background z-20" : ""
                                            )}
                                        >
                                            {seat.seatNumber}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 mt-12 border-t border-gray-800 pt-6 text-xs text-gray-400">
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-gray-700/50 border border-gray-600 mr-2"></div>
                    Thường
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-purple-500/20 border border-purple-500/50 mr-2"></div>
                    Couple
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/50 mr-2"></div>
                    VIP
                </div>
            </div>
        </div>
    );
};
