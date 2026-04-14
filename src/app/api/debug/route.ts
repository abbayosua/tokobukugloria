import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  const debugInfo: Record<string, unknown> = {};
  
  try {
    // Check environment
    debugInfo.environment = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasDirectUrl: !!process.env.DIRECT_URL,
      databaseUrlLength: process.env.DATABASE_URL?.length || 0,
      directUrlLength: process.env.DIRECT_URL?.length || 0,
      // Show first 50 chars of URL (redacted password)
      databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 50) + '...' || 'NOT SET',
    };

    // Check Prisma Client
    debugInfo.prisma = {
      clientExists: typeof PrismaClient === 'function',
    };

    // Try to connect
    console.log('[DEBUG] Creating new PrismaClient...');
    const prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
    
    console.log('[DEBUG] Attempting to connect...');
    await prisma.$connect();
    debugInfo.connection = 'SUCCESS';
    
    console.log('[DEBUG] Running test query...');
    const categoryCount = await prisma.category.count();
    const bookCount = await prisma.book.count();
    const bannerCount = await prisma.banner.count();
    
    debugInfo.counts = {
      categories: categoryCount,
      books: bookCount,
      banners: bannerCount,
    };
    
    await prisma.$disconnect();
    console.log('[DEBUG] Disconnected successfully');
    
  } catch (error) {
    console.error('[DEBUG] Error:', error);
    debugInfo.error = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack',
      name: error?.constructor?.name,
    };
  }

  return NextResponse.json(debugInfo, { status: 200 });
}
