import React from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { ProtectedUserRoute } from '@/components/layout/ProtectedUserRoute';

export default function ProfilePage() {
  return (
    <ProtectedUserRoute>
      <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Thông Tin Tài Khoản</h1>

      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
          <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
                  Q
              </div>
              <div>
                  <h2 className="text-xl font-bold">Quý Lê</h2>
                  <p className="text-gray-400">Thành viên từ 2024</p>
                  <p className="text-primary text-sm font-medium mt-1">Hạng: VIP Member</p>
              </div>
          </div>

          <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input label="Họ và tên" defaultValue="Quý Lê" leftIcon={<User className="w-4 h-4"/>} />
                 <Input label="Số điện thoại" defaultValue="0909000111" leftIcon={<Phone className="w-4 h-4"/>} />
              </div>
              <Input label="Email" defaultValue="quyle@example.com" disabled leftIcon={<Mail className="w-4 h-4"/>} />
              <Input label="Địa chỉ" placeholder="Nhập địa chỉ của bạn" leftIcon={<MapPin className="w-4 h-4"/>} />
              
              <div className="pt-4 flex justify-end">
                  <Button>Lưu Thay Đổi</Button>
              </div>
          </form>
      </div>
      </div>
    </ProtectedUserRoute>
  );
}
