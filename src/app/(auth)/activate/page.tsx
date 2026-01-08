'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { authApi } from '@/lib/api/auth';

export default function ActivatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  // Resend state
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !email) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await authApi.activateAccount(email, code);
      setStatus('success');
      setMessage(res.message || 'Kích hoạt thành công!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setStatus('error');
        setMessage(err.message);
      } else {
        setStatus('error');
        setMessage('Có lỗi xảy ra.');
      }
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || !email) return;
    
    setIsResending(true);
    try {
      const res = await authApi.resendActivationCode(email);
      setMessage(res.message || 'Đã gửi lại mã xác thực.');
      setResendCooldown(60); // 60s cooldown
      // Reset error status if previously failed
      if (status === 'error') setStatus('idle');
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
         setMessage('Không thể gửi lại mã.');
      }
    } finally {
      setIsResending(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="space-y-6 text-center animate-in zoom-in-95 duration-500">
        <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Kích Hoạt Thành Công!</h1>
        <p className="text-gray-400">
          Tài khoản của bạn đã được kích hoạt.<br/>
          Bạn sẽ được chuyển hướng đến trang đăng nhập trong giây lát...
        </p>
        <Button className="w-full mt-4" onClick={() => router.push('/login')}>
            Đến trang đăng nhập ngay
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Kích Hoạt Tài Khoản</h1>
        <p className="text-gray-400">
          Nhập mã xác thực 6 số đã được gửi tới<br/>
          <span className="font-semibold text-white">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
            <div className={`p-3 rounded text-sm flex items-start gap-2 ${
                status === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-500' : 
                resendCooldown > 0 ? 'bg-blue-500/10 border border-blue-500/20 text-blue-500' : ''
            }`}>
                {status === 'error' && <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                <span>{message}</span>
            </div>
        )}

        <Input
          label="Mã xác thực"
          placeholder="123456"
          required
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // Only numbers
          className="text-center text-2xl tracking-widest font-mono uppercase"
          leftIcon={<KeyRound className="h-4 w-4" />}
          disabled={status === 'loading'}
        />

        <Button 
          type="submit" 
          className="w-full" 
          size="lg" 
          isLoading={status === 'loading'}
          disabled={code.length < 6}
        >
          Kích Hoạt
        </Button>
      </form>

      <div className="text-center pt-2">
         <p className="text-sm text-gray-400 mb-2">Bạn không nhận được mã?</p>
         <button 
            type="button" 
            onClick={handleResendCode}
            disabled={resendCooldown > 0 || isResending}
            className="text-primary hover:underline font-semibold text-sm disabled:opacity-50 disabled:no-underline"
         >
            {isResending ? 'Đang gửi...' : 
             resendCooldown > 0 ? `Gửi lại sau ${resendCooldown}s` : 'Gửi lại mã xác thực'}
         </button>
      </div>

      <div className="text-center text-sm text-gray-400 border-t border-gray-800 pt-6">
        <Link href="/login" className="flex items-center justify-center hover:text-white transition-colors">
          &larr; Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}
