'use client';

import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '@/store/cart';

interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  price: number;
  discountPrice: number | null;
  coverImage: string;
  isBestseller: boolean;
  isNew: boolean;
  category: {
    name: string;
    slug: string;
  };
}

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const addItem = useCartStore((state) => state.addItem);
  
  const discount = book.discountPrice
    ? Math.round(((book.price - book.discountPrice) / book.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      bookId: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      discountPrice: book.discountPrice,
      coverImage: book.coverImage,
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Preserve existing query params and add book param
    const params = new URLSearchParams(searchParams.toString());
    params.set('book', book.slug);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div 
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
        <Image
          src={book.coverImage}
          alt={book.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {book.isBestseller && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-0.5">
              <Star className="w-3 h-3 mr-0.5" /> Bestseller
            </Badge>
          )}
          {book.isNew && (
            <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-0.5">
              Baru
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-0.5">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Tambah ke Keranjang
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-blue-600 mb-1">
          {book.category.name}
        </p>
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-blue-700 transition-colors mb-1">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{book.author}</p>
        
        <div className="mt-auto">
          {book.discountPrice ? (
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-700">
                Rp {book.discountPrice.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-gray-400 line-through">
                Rp {book.price.toLocaleString('id-ID')}
              </span>
            </div>
          ) : (
            <span className="font-bold text-blue-700">
              Rp {book.price.toLocaleString('id-ID')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
