import { Film } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 relative overflow-hidden p-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-black/80 z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 z-[-1]" />
        
        <div className="relative z-10">
           <Link href="/" className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Cinema</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-4">
            <blockquote className="space-y-2">
                <p className="text-lg font-medium">
                "Điện ảnh là tấm gương phản chiếu cuộc sống, nơi những giấc mơ trở thành hiện thực trên màn ảnh rộng."
                </p>
                <footer className="text-sm text-gray-400">Cinematography Art</footer>
            </blockquote>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md space-y-6">
             {children}
          </div>
      </div>
    </div>
  );
}
