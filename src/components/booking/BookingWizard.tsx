'use client';

import React, { useState } from 'react';
import { ShowtimeSelector } from './ShowtimeSelector';
import { SeatSelector } from './SeatSelector';
import { Button } from '@/components/common/Button';
import { cn } from '@/lib/utils/cn';
import { Seat, Showtime, SelectedFood, FoodItem } from '@/types/booking';
import { ChevronLeft, ChevronRight, CreditCard } from 'lucide-react';

const STEPS = ['Suất Chiếu', 'Ghế Ngồi', 'Đồ Ăn (Optional)', 'Thanh Toán'];

export const BookingWizard = ({ movieId: _movieId }: { movieId: string }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Booking State
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(c => c + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(c => c - 1);
  };

  const handleSeatToggle = (seat: Seat) => {
    if (selectedSeats.find(s => s.id === seat.id)) {
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats(prev => [...prev, seat]);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0) 
                   + selectedFoods.reduce((sum, food) => sum + food.price * food.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Steps Indicator */}
      <div className="flex justify-between items-center mb-12 relative px-4">
        <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-800 -z-10" />
        {STEPS.map((step, index) => (
          <div key={index} className="flex flex-col items-center bg-background px-2">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2",
              currentStep === index ? "border-primary bg-primary text-white" :
              currentStep > index ? "border-primary bg-primary/20 text-primary" : "border-gray-600 bg-card text-gray-500"
            )}>
              {index + 1}
            </div>
            <span className={cn(
              "mt-2 text-xs font-medium hidden md:block",
              currentStep === index ? "text-primary" : "text-gray-500"
            )}>{step}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 0 && (
          <ShowtimeSelector 
            onSelect={(showtime, date) => {
              setSelectedShowtime(showtime);
              setSelectedDate(date);
              // Auto next or user click? Let's user click for confirmation
            }}
            selectedShowtimeId={selectedShowtime?.id}
            selectedDate={selectedDate}
          />
        )}
        
        {currentStep === 1 && (
          <SeatSelector 
             selectedSeats={selectedSeats}
             onSeatToggle={handleSeatToggle}
          />
        )}

        {currentStep === 2 && (
            <div className="text-center py-20 text-gray-400">
                <h3 className="text-xl">Chọn Combo Bắp Nước</h3>
                <p>Tính năng đang phát triển...</p>
                {/* FoodSelector would go here */}
            </div>
        )}

        {currentStep === 3 && (
            <div className="flex flex-col items-center space-y-8 animate-in zoom-in-95">
                 <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-black">
                      <h3 className="text-center text-2xl font-bold mb-6 border-b border-gray-200 pb-4">VÉ XEM PHIM</h3>
                      <div className="space-y-4 text-sm">
                          <div className="flex justify-between">
                             <span className="text-gray-500">Phim</span>
                             <span className="font-bold">Mai</span>
                          </div>
                          <div className="flex justify-between">
                             <span className="text-gray-500">Suất chiếu</span>
                             <span className="font-bold">{selectedShowtime?.startTime} - {selectedDate}</span>
                          </div>
                          <div className="flex justify-between">
                             <span className="text-gray-500">Phòng chiếu</span>
                             <span className="font-bold">{selectedShowtime?.auditoriumName}</span>
                          </div>
                           <div className="flex justify-between">
                             <span className="text-gray-500">Ghế ({selectedSeats.length})</span>
                             <span className="font-bold">{selectedSeats.map(s => s.id).join(', ')}</span>
                          </div>
                           <div className="flex justify-between pt-4 border-t border-dashed border-gray-300">
                             <span className="font-bold text-lg">TỔNG TIỀN</span>
                             <span className="font-bold text-xl text-primary">{totalPrice.toLocaleString()}đ</span>
                          </div>
                      </div>
                      <div className="mt-8 flex justify-center">
                          {/* QR Code Placeholder */}
                         <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded">
                             QR CODE
                         </div>
                      </div>
                 </div>
                 <p className="text-sm text-gray-500">Quét mã QR để thanh toán (Mô phỏng)</p>
            </div>
        )}
      </div>

      {/* Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex flex-col">
                <span className="text-xs text-gray-400">Tổng cộng</span>
                <span className="text-2xl font-bold text-primary">{totalPrice.toLocaleString()}đ</span>
            </div>
            
            <div className="flex gap-4">
                {currentStep > 0 && (
                    <Button variant="outline" onClick={handleBack}>
                        <ChevronLeft className="w-4 h-4 mr-2"/> Quay lại
                    </Button>
                )}
                
                {currentStep < STEPS.length - 1 ? (
                    <Button 
                        onClick={handleNext} 
                        disabled={
                            (currentStep === 0 && !selectedShowtime) ||
                            (currentStep === 1 && selectedSeats.length === 0)
                        }
                        className="px-8"
                    >
                        Tiếp tục <ChevronRight className="w-4 h-4 ml-2"/>
                    </Button>
                ) : (
                     <Button className="px-8 bg-green-600 hover:bg-green-700">
                        <CreditCard className="w-4 h-4 mr-2"/> Thanh Toán Ngay
                    </Button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
