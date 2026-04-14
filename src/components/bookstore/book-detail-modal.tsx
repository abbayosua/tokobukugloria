'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Star, BookOpen, Printer, Calendar, FileText, Package, AlertCircle, Check } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  price: number;
  discountPrice: number | null;
  coverImage: string;
  isbn: string | null;
  publisher: string | null;
  publishYear: number | null;
  pages: number | null;
  language: string;
  stock: number;
  isBestseller: boolean;
  isNew: boolean;
  category: {
    name: string;
    slug: string;
  };
}

interface BookDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookDetailModal({ open, onOpenChange }: BookDetailModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  const fetchBook = useCallback(async (bookSlug: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/books?slug=${bookSlug}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.details || data.error || 'Failed to fetch book');
      }
      
      if (data.books && data.books.length > 0) {
        setBook(data.books[0]);
      } else {
        setError('Buku tidak ditemukan');
      }
    } catch (err) {
      console.error('Error fetching book:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const bookSlug = searchParams.get('book');
    if (bookSlug && open) {
      fetchBook(bookSlug);
    }
  }, [searchParams, open, fetchBook]);

  useEffect(() => {
    if (!open) {
      setBook(null);
      setError(null);
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Preserve existing params, just remove book
      const params = new URLSearchParams(searchParams.toString());
      params.delete('book');
      const newUrl = params.toString() ? `/?${params.toString()}` : '/';
      router.push(newUrl, { scroll: false });
      setBook(null);
      setError(null);
    }
    onOpenChange(newOpen);
  };

  const handleAddToCart = () => {
    if (!book) return;
    addItem({
      bookId: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      discountPrice: book.discountPrice,
      coverImage: book.coverImage,
    });
    toast({
      title: 'Berhasil ditambahkan!',
      description: `${book.title} telah ditambahkan ke keranjang.`,
      className: 'bg-green-50 border-green-200',
    });
  };

  const formatPrice = (price: number) => `Rp ${price.toLocaleString('id-ID')}`;
  const discount = book?.discountPrice
    ? Math.round(((book.price - book.discountPrice) / book.price) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {book ? book.title : error ? 'Error' : 'Memuat Buku'}
          </DialogTitle>
          <DialogDescription>
            {book ? `Detail buku ${book.title} oleh ${book.author}` : ''}
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">Oops!</p>
            <p className="text-gray-500">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                const bookSlug = searchParams.get('book');
                if (bookSlug) fetchBook(bookSlug);
              }}
            >
              Coba Lagi
            </Button>
          </div>
        ) : book ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Image */}
            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {book.isBestseller && (
                  <Badge className="bg-red-500 hover:bg-red-600 text-white">
                    <Star className="w-3 h-3 mr-1" /> Bestseller
                  </Badge>
                )}
                {book.isNew && (
                  <Badge className="bg-green-500 hover:bg-green-600 text-white">Baru</Badge>
                )}
                {discount > 0 && (
                  <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                    -{discount}%
                  </Badge>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <div className="mb-2">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  {book.category.name}
                </Badge>
              </div>
              <h2 className="text-xl md:text-2xl font-bold">{book.title}</h2>
              <p className="text-gray-600 mt-2">by {book.author}</p>

              {/* Price */}
              <div className="mt-4">
                {book.discountPrice ? (
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-2xl font-bold text-blue-700">
                      {formatPrice(book.discountPrice)}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(book.price)}
                    </span>
                    <Badge className="bg-red-100 text-red-600 hover:bg-red-100">
                      Hemat {formatPrice(book.price - book.discountPrice)}
                    </Badge>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-blue-700">
                    {formatPrice(book.price)}
                  </span>
                )}
              </div>

              {/* Stock */}
              <div className="mt-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" />
                <span className={book.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                  {book.stock > 0 ? `Stok: ${book.stock} tersedia` : 'Stok Habis'}
                </span>
              </div>

              {/* Add to Cart */}
              <Button
                className="mt-4 bg-blue-700 hover:bg-blue-800 text-white h-12 text-base"
                onClick={handleAddToCart}
                disabled={book.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Tambah ke Keranjang
              </Button>

              <Separator className="my-4" />

              {/* Book Info */}
              <div className="space-y-2 text-sm">
                {book.isbn && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>ISBN: {book.isbn}</span>
                  </div>
                )}
                {book.publisher && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Printer className="w-4 h-4" />
                    <span>Penerbit: {book.publisher}</span>
                  </div>
                )}
                {book.publishYear && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Tahun Terbit: {book.publishYear}</span>
                  </div>
                )}
                {book.pages && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>{book.pages} halaman</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <span>Bahasa: {book.language}</span>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2">Deskripsi</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{book.description}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Pilih buku untuk melihat detail
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
