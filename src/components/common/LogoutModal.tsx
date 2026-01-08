'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { X, LogOut } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-sm rounded-lg border border-border shadow-lg p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <LogOut className="w-5 h-5 mr-2 text-red-500" />
            Xác nhận đăng xuất
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white" title="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-gray-300 mb-6">
          Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
        </p>

        <div className="flex justify-end space-x-3">
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  );
};
