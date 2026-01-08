'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Mail, Lock, User } from 'lucide-react';
import { authApi } from '@/lib/api/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp');
      return;
    }

    setIsLoading(true);

    try {
      await authApi.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setSuccess('Đăng ký thành công! Đang chuyển hướng để kích hoạt...');
      setTimeout(() => {
        router.push(`/activate?email=${encodeURIComponent(formData.email)}`);
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng ký';
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Tạo Tài Khoản</h1>
        <p className="text-gray-400">
          Đăng ký thành viên để nhận nhiều ưu đãi hấp dẫn
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
            {success}
          </div>
        )}
        
        <Input
            label="Họ và tên"
            type="text"
            placeholder="Nguyễn Văn A"
            required
            leftIcon={<User className="h-4 w-4" />}
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            disabled={isLoading || !!success}
        />
        <Input
          label="Email"
          type="email"
          placeholder="name@example.com"
          required
          leftIcon={<Mail className="h-4 w-4" />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={isLoading || !!success}
        />
        <Input
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            required
            leftIcon={<Lock className="h-4 w-4" />}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            disabled={isLoading || !!success}
        />
        <Input
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="••••••••"
            required
            leftIcon={<Lock className="h-4 w-4" />}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            disabled={isLoading || !!success}
        />

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading} disabled={!!success}>
          Đăng Ký
        </Button>
      </form>

      <div className="text-center text-sm text-gray-400">
         Đã có tài khoản?{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}
