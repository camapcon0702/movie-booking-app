import React from 'react';
import { Button } from '@/components/common/Button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

const MOCK_MOVIES = [
  { id: '1', title: 'Mai', posterUrl: 'https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg', duration: 131, rating: 8.5 },
  { id: '2', title: 'Dune: Part Two', posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', duration: 166, rating: 9.0 },
];

export default function AdminMoviesPage() {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold">Quản Lý Phim</h1>
            <p className="text-gray-400">Danh sách các phim đang và sắp chiếu</p>
         </div>
         <Button>
             <Plus className="w-4 h-4 mr-2" /> Thêm Phim Mới
         </Button>
       </div>

       <div className="bg-card rounded-xl border border-border overflow-hidden">
           <table className="w-full text-left">
               <thead className="bg-white/5 border-b border-border">
                   <tr>
                       <th className="p-4 font-medium text-gray-400 w-20">Poster</th>
                       <th className="p-4 font-medium text-gray-400">Tên Phim</th>
                       <th className="p-4 font-medium text-gray-400">Thời Lượng</th>
                       <th className="p-4 font-medium text-gray-400">Đánh Giá</th>
                       <th className="p-4 font-medium text-gray-400 text-right">Hành Động</th>
                   </tr>
               </thead>
               <tbody className="divide-y divide-border">
                   {MOCK_MOVIES.map((movie) => (
                       <tr key={movie.id} className="hover:bg-white/5 transition-colors">
                           <td className="p-4">
                               <div className="w-12 h-16 relative rounded overflow-hidden">
                                   <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" />
                               </div>
                           </td>
                           <td className="p-4 font-medium">{movie.title}</td>
                           <td className="p-4 text-gray-400">{movie.duration} phút</td>
                           <td className="p-4 text-yellow-500 font-bold">{movie.rating}</td>
                           <td className="p-4 text-right space-x-2">
                               <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400">
                                   <Edit className="w-4 h-4" />
                               </button>
                               <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400">
                                   <Trash2 className="w-4 h-4" />
                               </button>
                           </td>
                       </tr>
                   ))}
               </tbody>
           </table>
       </div>
    </div>
  );
}
