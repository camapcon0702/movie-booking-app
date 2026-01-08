import React from 'react';
import { Film } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Film className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">CinéTix</span>
          </div>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-primary transition-colors">Về Chúng Tôi</a>
            <a href="#" className="hover:text-primary transition-colors">Điều Khoản</a>
            <a href="#" className="hover:text-primary transition-colors">Chính Sách</a>
            <a href="#" className="hover:text-primary transition-colors">Liên Hệ</a>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} CinéTix. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
