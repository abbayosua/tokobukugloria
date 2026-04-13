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

  try {
    const where: Prisma.BookWhereInput = {};
    
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
        { title: { contains: search } },
        { author: { contains: search } },
        { description: { contains: search } },
      ];
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
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}
