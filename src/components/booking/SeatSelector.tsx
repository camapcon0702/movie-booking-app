'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Seat, SeatStatus, SeatType } from '@/types/booking';

// Helper to generate a dummy seat map
const generateSeatMap = (rows = 8, cols = 10): Seat[] => {
  const seats: Seat[] = [];
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  
  for (let r = 0; r < rows; r++) {
    for (let c = 1; c <= cols; c++) {
      let type: SeatType = 'STANDARD';
      let price = 80000;
      
      // VIP rows usually in the middle back
      if (r >= 5 && r <= 6) {
        type = 'VIP';
        price = 100000;
      }
      // Couple seats at the back
      if (r === 7) {
        type = 'COUPLE';
        price = 180000;
      }

      // Randomly book some seats
      const status: SeatStatus = Math.random() < 0.15 ? 'BOOKED' : 'AVAILABLE';

      seats.push({
        id: `${rowLabels[r]}${c}`,
        row: rowLabels[r],
        number: c,
        type,
        price,
        status,
        x: c,
        y: r,
      });
    }
  }
  return seats;
};

// Initial static map
const INITIAL_SEATS = generateSeatMap();

interface SeatSelectorProps {
  selectedSeats: Seat[];
  onSeatToggle: (seat: Seat) => void;
}

export const SeatSelector = ({ selectedSeats, onSeatToggle }: SeatSelectorProps) => {
  const isSelected = (seat: Seat) => selectedSeats.some((s) => s.id === seat.id);

  return (
    <div className="w-full flex flex-col items-center space-y-8 animate-in zoom-in-95 duration-500">
      {/* Screen Visual */}
      <div className="w-full max-w-3xl flex flex-col items-center space-y-4">
        <div className="w-full h-8 bg-gradient-to-t from-primary/20 to-transparent rounded-[50%] blur-sm border-t-4 border-primary/50" />
        <p className="text-gray-500 text-sm uppercase tracking-widest">Màn hình</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-10 gap-2 md:gap-4 p-4 bg-card/30 rounded-3xl border border-white/5">
        {INITIAL_SEATS.map((seat) => {
           const selected = isSelected(seat);
           const booked = seat.status === 'BOOKED';
           
           return (
             <button
               key={seat.id}
               disabled={booked}
               onClick={() => onSeatToggle(seat)}
               className={cn(
                 "relative w-8 h-8 md:w-10 md:h-10 rounded-t-lg transition-all transform hover:scale-110 flex items-center justify-center text-[10px] font-bold",
                 // Status Colors
                 booked && "bg-gray-700 cursor-not-allowed opacity-50",
                 !booked && !selected && seat.type === 'STANDARD' && "bg-white/20 hover:bg-white/40 border border-white/10",
                 !booked && !selected && seat.type === 'VIP' && "bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-500/50 text-yellow-500",
                 !booked && !selected && seat.type === 'COUPLE' && "bg-pink-500/20 hover:bg-pink-500/40 border border-pink-500/50 text-pink-500 col-span-2 w-full",
                 
                 // Selected State
                 selected && "bg-primary text-white shadow-lg shadow-primary/50 ring-2 ring-primary ring-offset-1 ring-offset-background"
               )}
               title={`${seat.row}${seat.number} - ${seat.price.toLocaleString()}đ`}
             >
               {seat.row}{seat.number}
             </button>
           );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 mt-8">
          <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-700 rounded" />
              <span className="text-sm text-gray-400">Đã đặt</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 border border-white/10 rounded" />
              <span className="text-sm text-gray-400">Thường</span>
          </div>
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-500/20 border border-yellow-500/50 rounded" />
              <span className="text-sm text-gray-400">VIP</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded shadow-lg shadow-primary/50" />
              <span className="text-sm text-gray-400">Đang chọn</span>
          </div>
      </div>
    </div>
  );
};
