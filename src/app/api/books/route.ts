import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const bestseller = searchParams.get('bestseller');
  const isNew = searchParams.get('new');
  const limit = searchParams.get('limit');
  const search = searchParams.get('search');
  const slug = searchParams.get('slug');

  try {
    const where: Prisma.BookWhereInput = {};
    
    // If slug is provided, find exact match by slug
    if (slug) {
      where.slug = slug;
    } else {
      // Other filters
      if (category) {
        where.category = { slug: category };
      }
      
      if (featured === 'true') {
        where.isFeatured = true;
      }
      
      if (bestseller === 'true') {
        where.isBestseller = true;
      }
      
      if (isNew === 'true') {
        where.isNew = true;
      }
      
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { author: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
        ];
      }
    }

    const books = await db.book.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      ...(limit ? { take: parseInt(limit) } : {}),
    });

    return NextResponse.json({ books });
  } catch (error) {
    console.error('[BOOKS API] ERROR:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch books',
        details: error instanceof Error ? error.message : String(error),
        errorType: error?.constructor?.name,
      },
      { status: 500 }
    );
  }
}
