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
    // Debug: Log environment info
    console.log('[BOOKS API] Starting request...');
    console.log('[BOOKS API] NODE_ENV:', process.env.NODE_ENV);
    console.log('[BOOKS API] DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('[BOOKS API] DIRECT_URL exists:', !!process.env.DIRECT_URL);
    
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

    console.log('[BOOKS API] Querying database...');
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

    console.log('[BOOKS API] Success! Found', books.length, 'books');
    return NextResponse.json({ books });
  } catch (error) {
    // Detailed error logging
    console.error('[BOOKS API] ERROR:', error);
    console.error('[BOOKS API] Error type:', error?.constructor?.name);
    console.error('[BOOKS API] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[BOOKS API] Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch books',
        details: error instanceof Error ? error.message : String(error),
        errorType: error?.constructor?.name,
        debug: {
          hasDbUrl: !!process.env.DATABASE_URL,
          hasDirectUrl: !!process.env.DIRECT_URL,
          nodeEnv: process.env.NODE_ENV,
        }
      },
      { status: 500 }
    );
  }
}
