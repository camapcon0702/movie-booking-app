'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { cn } from '@/lib/utils/cn';
import { Calendar } from 'lucide-react';
import { Showtime } from '@/types/movie';

// Create dates for the next 7 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      date: d,
      label: i === 0 ? 'Hôm nay' : `${d.getDate()}/${d.getMonth() + 1}`,
      dayName: d.toLocaleDateString('vi-VN', { weekday: 'short' }),
      fullDate: d.toISOString().split('T')[0],
    });
  }
  return dates;
};

// Mock showtimes
const MOCK_SHOWTIMES: Showtime[] = [
  { id: '1', movieId: '1', auditoriumId: '1', auditoriumName: 'Rạp 1', startTime: '10:00', endTime: '12:00', priceCheck: 80000 },
  { id: '2', movieId: '1', auditoriumId: '1', auditoriumName: 'Rạp 1', startTime: '13:00', endTime: '15:00', priceCheck: 80000 },
  { id: '3', movieId: '1', auditoriumId: '2', auditoriumName: 'Rạp 2', startTime: '16:00', endTime: '18:00', priceCheck: 90000 },
  { id: '4', movieId: '1', auditoriumId: '3', auditoriumName: 'IMAX', startTime: '19:30', endTime: '21:30', priceCheck: 150000 },
  { id: '5', movieId: '1', auditoriumId: '1', auditoriumName: 'Rạp 1', startTime: '22:00', endTime: '24:00', priceCheck: 80000 },
];

interface ShowtimeSelectorProps {
  onSelect: (showtime: Showtime, date: string) => void;
  selectedShowtimeId?: string;
  selectedDate?: string;
}

export const ShowtimeSelector = ({ onSelect, selectedShowtimeId, selectedDate }: ShowtimeSelectorProps) => {
  const dates = generateDates();
  const [activeDate, setActiveDate] = React.useState(selectedDate || dates[0].fullDate);

  const handleDateChange = (date: string) => {
    setActiveDate(date);
    // Reset showtime selection when date changes if needed, or keep logic in parent
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="text-primary" /> Chọn Ngày Chiếu
        </h3>
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          {dates.map((item) => (
            <button
              key={item.fullDate}
              onClick={() => handleDateChange(item.fullDate)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[80px] h-20 rounded-xl border-2 transition-all",
                activeDate === item.fullDate
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border bg-card text-gray-400 hover:border-gray-500 hover:bg-card/80"
              )}
            >
              <span className="text-xs font-medium uppercase">{item.dayName}</span>
              <span className="text-lg font-bold">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Chọn Suất Chiếu</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {MOCK_SHOWTIMES.map((showtime) => (
                <button
                    key={showtime.id}
                    onClick={() => onSelect(showtime, activeDate)}
                    className={cn(
                        "p-4 rounded-xl border border-border bg-card hover:border-primary transition-all text-center space-y-1",
                        selectedShowtimeId === showtime.id && "ring-2 ring-primary ring-offset-2 ring-offset-background border-primary bg-primary/10"
                    )}
                >
                    <div className="text-lg font-bold">{showtime.startTime}</div>
                    <div className="text-xs text-gray-500">~ {showtime.endTime}</div>
                    <div className="text-xs font-medium text-primary mt-1">{showtime.auditoriumName}</div>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};
