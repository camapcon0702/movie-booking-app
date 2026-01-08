import React from 'react';
import { Users, Film, Ticket, DollarSign } from 'lucide-react';

const STATS = [
    { label: 'Tổng Doanh Thu', value: '125.000.000đ', icon: DollarSign, change: '+12.5%' },
    { label: 'Vé Đã Bán', value: '3,450', icon: Ticket, change: '+8.2%' },
    { label: 'Phim Đang Chiếu', value: '14', icon: Film, change: '0%' },
    { label: 'Khách Hàng Mới', value: '520', icon: Users, change: '+22.4%' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400">Tổng quan tình hình kinh doanh hôm nay</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                  <div key={stat.label} className="bg-card p-6 rounded-xl border border-border shadow-lg">
                      <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-primary/10 rounded-lg">
                               <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                              {stat.change}
                          </span>
                      </div>
                      <h3 className="text-gray-400 text-sm">{stat.label}</h3>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
              );
          })}
      </div>

      {/* Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-xl p-6 h-80">
              <h3 className="font-bold mb-4">Biểu Đồ Doanh Thu</h3>
              <div className="w-full h-full flex items-center justify-center text-gray-500 bg-black/20 rounded-lg">
                  [Chart Placeholder]
              </div>
          </div>
           <div className="bg-card border border-border rounded-xl p-6 h-80">
              <h3 className="font-bold mb-4">Giao Dịch Gần Đây</h3>
               <div className="space-y-4">
                   {[1,2,3,4].map(i => (
                       <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                           <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-gray-700" />
                               <div>
                                   <p className="text-sm font-medium">Khách hàng #{i}</p>
                                   <p className="text-xs text-gray-500">Đặt 2 vé Mai</p>
                               </div>
                           </div>
                           <span className="text-sm font-bold text-primary">+180.000đ</span>
                       </div>
                   ))}
               </div>
          </div>
      </div>
    </div>
  );
}
