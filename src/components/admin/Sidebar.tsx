'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/lib/auth/AuthContext';
import { LogoutModal } from '@/components/common/LogoutModal';
import {

    Film,
    Monitor,
    Armchair,
    Tags,
    Utensils,
    CalendarClock,
    Ticket,
    LogOut
} from 'lucide-react';

const MENU_ITEMS = [

    { name: 'Quản lý Phim', href: '/admin/movies', icon: Film },
    { name: 'Rạp / Phòng Chiếu', href: '/admin/auditoriums', icon: Monitor },
    { name: 'Giá Ghế', href: '/admin/seat-prices', icon: Armchair },
    { name: 'Ghế & Sơ đồ', href: '/admin/seats', icon: Armchair },
    { name: 'Thể Loại', href: '/admin/genres', icon: Tags },
    { name: 'Đồ Ăn & Nước', href: '/admin/foods', icon: Utensils },
    { name: 'Suất Chiếu', href: '/admin/showtimes', icon: CalendarClock },
    { name: 'Voucher', href: '/admin/vouchers', icon: Ticket },
];

export const AdminSidebar = () => {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        logout();
        setShowLogoutModal(false);
    };

    return (
        <aside className="w-64 bg-card border-r border-border h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-6 border-b border-border">
                <Link href="/" className="flex items-center space-x-2">
                    <Film className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold">Cinema Admin</span>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border space-y-2">

                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 w-full transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Đăng xuất</span>
                </button>
            </div>

            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
            />
        </aside>
    );
};
