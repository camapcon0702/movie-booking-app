'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/common/Button';
import { Menu, X, User as UserIcon, LogOut, Ticket, Film } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { LogoutModal } from '@/components/common/LogoutModal';

export const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { name: 'Đang Chiếu', href: '/' },
    { name: 'Sắp Chiếu', href: '/upcoming' },
    { name: 'Khuyến Mãi', href: '/vouchers' },
  ];

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsMobileMenuOpen(false);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">
              CinéTix
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  isActive(link.href) ? 'text-primary' : 'text-gray-300'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/history">
                  <Button variant="ghost" size="sm" className="text-gray-300">
                    <Ticket className="h-4 w-4 mr-2" />
                    Vé của tôi
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                    <Link href="/profile">
                        <Button variant="ghost" size="icon" className="rounded-full" title="Hồ sơ">
                             <UserIcon className="h-5 w-5" />
                        </Button>
                    </Link>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full hover:bg-red-500/10 hover:text-red-500"
                        onClick={handleLogoutClick}
                        title="Đăng xuất"
                    >
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Đăng Nhập</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Đăng Ký</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background border-b border-border p-4 space-y-4 animate-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block text-base font-medium py-2',
                  isActive(link.href) ? 'text-primary' : 'text-gray-300'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-border space-y-3">
              {isAuthenticated ? (
                <>
                  <Link href="/history" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <Ticket className="h-4 w-4 mr-2" /> Vé của tôi
                    </Button>
                  </Link>
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <UserIcon className="h-4 w-4 mr-2" /> Tài khoản
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-500"
                    onClick={handleLogoutClick}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Đăng Nhập</Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">Đăng Ký</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
};
