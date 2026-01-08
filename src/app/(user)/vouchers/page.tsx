import React from 'react';
import { Button } from '@/components/common/Button';
import { Ticket } from 'lucide-react';

const VOUCHERS = [
    { code: 'WELCOMEMOI', discount: '20%', desc: 'Giảm 20% cho thành viên mới', expiry: '30/04/2026' },
    { code: 'BAPNUOCFR', discount: 'Free Popcorn', desc: 'Tặng 1 bắp ngọt khi mua 2 vé', expiry: '15/02/2026' },
];

export default function VouchersPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Kho Ưu Đãi</h1>
      <p className="text-gray-400">Ví voucher của bạn</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VOUCHERS.map((v) => (
              <div key={v.code} className="bg-gradient-to-br from-card to-primary/5 border border-primary/20 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl" />
                  
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg text-primary">
                          <Ticket className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-medium bg-white/10 px-2 py-1 rounded text-gray-300">
                          HSD: {v.expiry}
                      </span>
                  </div>

                  <h3 className="text-2xl font-bold text-primary mb-2">{v.discount}</h3>
                  <p className="text-gray-300 text-sm mb-4">{v.desc}</p>
                  
                  <div className="bg-black/30 p-2 rounded border border-dashed border-gray-600 flex justify-between items-center">
                      <span className="font-mono font-bold tracking-widest">{v.code}</span>
                      <Button size="sm" variant="ghost" className="h-6 text-xs text-primary hover:text-primary-hover">Copy</Button>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
}
