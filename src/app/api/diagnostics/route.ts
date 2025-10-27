import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database_config: {
        host: process.env.DB_HOST ? 'Set' : 'Missing',
        port: process.env.DB_PORT ? 'Set' : 'Missing',
        user: process.env.DB_USER ? 'Set' : 'Missing',
        password: process.env.DB_PASSWORD ? 'Set' : 'Missing',
        database: process.env.DB_NAME ? 'Set' : 'Missing',
      },
      vercel_url: process.env.VERCEL_URL || 'Not available',
      all_env_vars: Object.keys(process.env).filter(key => 
        key.startsWith('DB_') || 
        key.startsWith('VERCEL_') || 
        key.startsWith('NEXT_')
      )
    };

    return NextResponse.json({
      success: true,
      data: diagnostics
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}