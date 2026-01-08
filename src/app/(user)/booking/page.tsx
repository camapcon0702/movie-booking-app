import React, { Suspense } from 'react';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { ProtectedUserRoute } from '@/components/layout/ProtectedUserRoute';

export default function BookingPage({
  searchParams,
}: {
  searchParams: { movieId: string };
}) {
  return (
    <ProtectedUserRoute>
      <div className="min-h-screen pt-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Đặt Vé Xem Phim</h1>
          <p className="text-gray-400">Hoàn tất các bước để nhận vé</p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <BookingWizard movieId={searchParams.movieId} />
        </Suspense>
      </div>
    </ProtectedUserRoute>
  );
}
