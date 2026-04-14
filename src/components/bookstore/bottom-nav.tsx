'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Home, Search, ShoppingCart, User, Grid3X3 } from 'lucide-react';
import { useCartStore } from '@/store/cart';

export function BottomNav() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  const currentBook = searchParams.get('book');
  const cartOpen = searchParams.get('cart');
  const itemCount = useCartStore((state) => state.getItemCount());

  const isActive = (type: string) => {
    if (type === 'home') {
      return !currentCategory && !currentBook && !cartOpen;
    }
    if (type === 'category') {
      return currentCategory !== null;
    }
    if (type === 'cart') {
      return cartOpen === 'open';
    }
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
            isActive('home')
              ? 'text-blue-700'
              : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Beranda</span>
        </Link>

        {/* Categories */}
        <Link
          href="/?category=all"
          className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
            isActive('category')
              ? 'text-blue-700'
              : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <Grid3X3 className="w-5 h-5" />
          <span className="text-[10px] font-medium">Kategori</span>
        </Link>

        {/* Search */}
        <Link
          href="/?search="
          className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors text-gray-500 hover:text-blue-600"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium">Cari</span>
        </Link>

        {/* Cart */}
        <Link
          href="/?cart=open"
          className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative ${
            isActive('cart')
              ? 'text-blue-700'
              : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute top-1 right-1/4 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
          <span className="text-[10px] font-medium">Keranjang</span>
        </Link>

        {/* Account */}
        <Link
          href="/?page=hubungi-kami"
          className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors text-gray-500 hover:text-blue-600"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Akun</span>
        </Link>
      </div>
    </nav>
  );
}
