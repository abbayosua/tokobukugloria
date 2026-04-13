'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  _count?: {
    books: number;
  };
}

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/?category=${category.slug}`}
      className="group relative overflow-hidden rounded-xl aspect-square bg-gray-100"
    >
      <Image
        src={category.image || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400'}
        alt={category.name}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-500"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="font-semibold text-sm md:text-base">{category.name}</h3>
        {category._count && (
          <p className="text-xs text-gray-300">{category._count.books} buku</p>
        )}
      </div>
    </Link>
  );
}
