'use client';

import React from 'react';
import { Ticket, Calendar, MapPin, QrCode } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { ProtectedUserRoute } from '@/components/layout/ProtectedUserRoute';

export default function HistoryPage() {
  return (
    <ProtectedUserRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Lịch Sử Đặt Vé</h1>

          <div className="space-y-4">
            {[1, 2].map((i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 bg-green-500/10 text-green-500 rounded-bl-xl font-bold text-xs uppercase">
                        Đã thanh toán
                    </div>
                    
                    {/* Movie Poster Thumbnail */}
                    <div className="w-24 h-32 bg-gray-700 rounded-lg shrink-0" />

                    <div className="flex-grow space-y-3">
                        <h3 className="text-xl font-bold">Mai</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>10/02/2024 - 19:30</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>Rạp 1 - Ghế F05, F06</span>
                            </div>
                        </div>
                        <div className="font-medium">Tổng tiền: <span className="text-primary">200.000đ</span></div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <Button variant="outline"><Ticket className="w-4 h-4 mr-2"/> Xem Vé / QR</Button>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedUserRoute>
  );
}
