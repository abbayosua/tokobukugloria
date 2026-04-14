'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCartStore } from '@/store/cart';

const categories = [
  { name: 'Alkitab', slug: 'alkitab' },
  { name: 'Buku Katolik', slug: 'buku-katolik' },
  { name: 'Renungan', slug: 'renungan' },
  { name: 'Teologi', slug: 'teologi' },
  { name: 'Anak-Anak', slug: 'kids' },
  { name: 'Musik & Pujian', slug: 'musik-pujian' },
  { name: 'Pernikahan & Keluarga', slug: 'pernikahan-keluarga' },
  { name: 'Rohaniwan', slug: 'rohaniwan' },
];

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      {/* Top bar */}
      <div className="bg-blue-800 text-white text-xs py-1.5">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span>Pengiriman ke seluruh Indonesia</span>
          <span className="hidden sm:inline">📞 WhatsApp: 0823-2336-2107</span>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 relative rounded-lg overflow-hidden">
              <Image
                src="/logo.jpg"
                alt="Toko Buku Gloria"
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-blue-900 leading-tight">
                Toko Buku Gloria
              </h1>
              <p className="text-xs text-gray-500">Toko Buku Kristen</p>
            </div>
          </Link>

          {/* Search bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Cari buku, Alkitab, renungan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 text-blue-700 hover:text-blue-900"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="md:hidden text-blue-700">
              <Search className="w-5 h-5" />
            </Button>

            {/* Cart */}
            <Link href="/?cart=open">
              <Button variant="ghost" size="icon" className="relative text-blue-700 hover:bg-blue-50">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-0">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-blue-700">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4 mt-4">
                  <h2 className="font-bold text-lg text-blue-900">Kategori</h2>
                  <nav className="flex flex-col gap-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/?category=${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 py-2 overflow-x-auto">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/?category=${cat.slug}`}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-full whitespace-nowrap transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
