'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/bookstore/header';
import { Footer } from '@/components/bookstore/footer';
import { BottomNav } from '@/components/bookstore/bottom-nav';
import { HeroBanner } from '@/components/bookstore/hero-banner';
import { BookCard } from '@/components/bookstore/book-card';
import { CategoryCard } from '@/components/bookstore/category-card';
import { CartDrawer } from '@/components/bookstore/cart-drawer';
import { BookDetailModal } from '@/components/bookstore/book-detail-modal';
import { InfoModal } from '@/components/bookstore/info-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, Sparkles, TrendingUp, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';

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

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  _count: {
    books: number;
  };
}

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string | null;
}

function HomePageContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [bestsellerBooks, setBestsellerBooks] = useState<Book[]>([]);
  const [newBooks, setNewBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [cartOpen, setCartOpen] = useState(false);
  const [bookDetailOpen, setBookDetailOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  useEffect(() => {
    const cart = searchParams.get('cart');
    const book = searchParams.get('book');
    const page = searchParams.get('page');
    if (cart === 'open') setCartOpen(true);
    if (book) setBookDetailOpen(true);
    if (page) setInfoModalOpen(true);
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bannersRes, categoriesRes, featuredRes, bestsellerRes, newRes] = await Promise.all([
          fetch('/api/banners'),
          fetch('/api/categories'),
          fetch('/api/books?featured=true&limit=8'),
          fetch('/api/books?bestseller=true&limit=8'),
          fetch('/api/books?new=true&limit=8'),
        ]);

        const [bannersData, categoriesData, featuredData, bestsellerData, newData] = await Promise.all([
          bannersRes.json(),
          categoriesRes.json(),
          featuredRes.json(),
          bestsellerRes.json(),
          newRes.json(),
        ]);

        setBanners(bannersData.banners || []);
        setCategories(categoriesData.categories || []);
        setFeaturedBooks(featuredData.books || []);
        setBestsellerBooks(bestsellerData.books || []);
        setNewBooks(newData.books || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFiltered = async () => {
      if (!category && !searchQuery) {
        setFilteredBooks([]);
        return;
      }

      try {
        let url = '/api/books?';
        if (category) url += `category=${category}&`;
        if (searchQuery) url += `search=${searchQuery}&`;
        
        const res = await fetch(url);
        const data = await res.json();
        setFilteredBooks(data.books || []);
      } catch (error) {
        console.error('Error fetching filtered books:', error);
      }
    };

    fetchFiltered();
  }, [category, searchQuery]);

  const currentCategory = category
    ? categories.find((c) => c.slug === category)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-4 md:py-6">
          {/* Show filtered view if category or search is active */}
          {(category || searchQuery) ? (
            <div className="space-y-6">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/" className="hover:text-blue-600">Beranda</Link>
                <ChevronRight className="w-4 h-4" />
                {searchQuery ? (
                  <span>Hasil pencarian: &quot;{searchQuery}&quot;</span>
                ) : currentCategory ? (
                  <span className="text-blue-700 font-medium">{currentCategory.name}</span>
                ) : null}
              </div>

              {/* Results Header */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {searchQuery
                    ? `Hasil Pencarian: "${searchQuery}"`
                    : currentCategory?.name || 'Semua Buku'}
                </h1>
                <p className="text-gray-500 mt-1">
                  {filteredBooks.length} buku ditemukan
                </p>
              </div>

              {/* Results Grid */}
              {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {filteredBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Tidak ada buku ditemukan</p>
                  <Link href="/">
                    <Button variant="link" className="text-blue-600 mt-2">
                      Kembali ke Beranda
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            /* Normal Homepage */
            <div className="space-y-8">
              {/* Hero Banner */}
              <HeroBanner banners={banners} />

              {/* Categories */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Jelajahi Kategori
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {categories.slice(0, 6).map((cat) => (
                    <CategoryCard key={cat.id} category={cat} />
                  ))}
                </div>
              </section>

              {/* Featured Books Tabs */}
              <section>
                <Tabs defaultValue="featured" className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <TabsList className="bg-white border">
                      <TabsTrigger value="featured" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                        <Sparkles className="w-4 h-4 mr-1" /> Pilihan
                      </TabsTrigger>
                      <TabsTrigger value="bestseller" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                        <TrendingUp className="w-4 h-4 mr-1" /> Bestseller
                      </TabsTrigger>
                      <TabsTrigger value="new" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                        <Clock className="w-4 h-4 mr-1" /> Baru
                      </TabsTrigger>
                    </TabsList>
                    <Link href="/?category=all">
                      <Button variant="link" className="text-blue-600">
                        Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  <TabsContent value="featured">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {featuredBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="bestseller">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {bestsellerBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="new">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {newBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </section>

              {/* Promo Banner */}
              <section className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl p-6 md:p-8 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <Badge className="bg-white/20 text-white mb-2">Promo Spesial</Badge>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">
                      Diskon Hingga 30% untuk Alkitab
                    </h3>
                    <p className="text-blue-100 text-sm md:text-base">
                      Dapatkan Alkitab berkualitas dengan harga spesial. Promo berlaku hingga akhir bulan ini!
                    </p>
                  </div>
                  <Link href="/?category=alkitab">
                    <Button className="bg-white text-blue-700 hover:bg-blue-50 shrink-0">
                      Belanja Sekarang
                    </Button>
                  </Link>
                </div>
              </section>

              {/* All Categories */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Semua Kategori
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/?category=${cat.slug}`}
                      className="bg-white border rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all group"
                    >
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-700">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {cat._count.books} buku
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav />

      {/* Modals & Drawers */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <BookDetailModal open={bookDetailOpen} onOpenChange={setBookDetailOpen} />
      <InfoModal open={infoModalOpen} onOpenChange={setInfoModalOpen} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
