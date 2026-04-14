import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Debug: Log environment info
    console.log('[BANNERS API] Starting request...');
    console.log('[BANNERS API] NODE_ENV:', process.env.NODE_ENV);
    console.log('[BANNERS API] DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('[BANNERS API] DIRECT_URL exists:', !!process.env.DIRECT_URL);

    console.log('[BANNERS API] Querying database...');
    const banners = await db.banner.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    console.log('[BANNERS API] Success! Found', banners.length, 'banners');
    return NextResponse.json({ banners });
  } catch (error) {
    // Detailed error logging
    console.error('[BANNERS API] ERROR:', error);
    console.error('[BANNERS API] Error type:', error?.constructor?.name);
    console.error('[BANNERS API] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[BANNERS API] Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch banners',
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
