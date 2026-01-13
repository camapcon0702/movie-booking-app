import React from 'react';
import Link from 'next/link';
import {
    Film,
    Monitor,
    Armchair,
    Tags,
    Utensils,
    CalendarClock,
    Ticket,
    ChevronRight
} from 'lucide-react';

const MODULES = [
    {
        name: 'Quản lý Phim',
        href: '/admin/movies',
        icon: Film,
        description: 'Thêm, sửa, xóa và quản lý danh sách phim đang chiếu, sắp chiếu.'
    },
    {
        name: 'Rạp / Phòng Chiếu',
        href: '/admin/auditoriums',
        icon: Monitor,
        description: 'Quản lý thông tin rạp và các phòng chiếu phim.'
    },
    {
        name: 'Giá Ghế',
        href: '/admin/seat-prices',
        icon: Armchair,
        description: 'Thiết lập bảng giá vé cho từng loại ghế và loại phòng.'
    },
    {
        name: 'Ghế & Sơ đồ',
        href: '/admin/seats',
        icon: Armchair,
        description: 'Cấu hình sơ đồ ghế ngồi cho các phòng chiếu.'
    },
    {
        name: 'Thể Loại',
        href: '/admin/genres',
        icon: Tags,
        description: 'Quản lý danh mục thể loại phim.'
    },
    {
        name: 'Đồ Ăn & Nước',
        href: '/admin/foods',
        icon: Utensils,
        description: 'Quản lý menu đồ ăn, nước uống và combo bắp nước.'
    },
    {
        name: 'Suất Chiếu',
        href: '/admin/showtimes',
        icon: CalendarClock,
        description: 'Lên lịch xuất chiếu cho các phim tại phòng chiếu.'
    },
    {
        name: 'Voucher',
        href: '/admin/vouchers',
        icon: Ticket,
        description: 'Quản lý mã giảm giá và các chương trình khuyến mãi.'
    },
];

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Quản Trị Hệ Thống</h1>
                <p className="text-gray-400">Chọn một module để bắt đầu quản lý</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MODULES.map((module) => {
                    const Icon = module.icon;
                    return (
                        <Link
                            key={module.href}
                            href={module.href}
                            className="group bg-card p-6 rounded-xl border border-border shadow-lg hover:border-primary/50 transition-all hover:shadow-primary/10 flex flex-col justify-between h-48"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                        <Icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{module.name}</h3>
                                <p className="text-gray-400 text-sm line-clamp-2">{module.description}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
