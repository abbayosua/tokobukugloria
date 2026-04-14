import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Debug: Log environment info
    console.log('[CATEGORIES API] Starting request...');
    console.log('[CATEGORIES API] NODE_ENV:', process.env.NODE_ENV);
    console.log('[CATEGORIES API] DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('[CATEGORIES API] DIRECT_URL exists:', !!process.env.DIRECT_URL);

    console.log('[CATEGORIES API] Querying database...');
    const categories = await db.category.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: { books: true },
        },
      },
    });

    console.log('[CATEGORIES API] Success! Found', categories.length, 'categories');
    return NextResponse.json({ categories });
  } catch (error) {
    // Detailed error logging
    console.error('[CATEGORIES API] ERROR:', error);
    console.error('[CATEGORIES API] Error type:', error?.constructor?.name);
    console.error('[CATEGORIES API] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[CATEGORIES API] Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories',
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
