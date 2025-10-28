import { NextResponse } from 'next/server';

export async function GET() {
  const testData = {
    success: true,
    message: 'API Test endpoint working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      host: process.env.DB_HOST ? 'Configured' : 'Missing',
      port: process.env.DB_PORT ? 'Configured' : 'Missing',
      user: process.env.DB_USER ? 'Configured' : 'Missing',
      password: process.env.DB_PASSWORD ? 'Configured' : 'Missing',
      name: process.env.DB_NAME ? 'Configured' : 'Missing'
    },
    headers: {
      'user-agent': process.env.VERCEL ? 'Vercel' : 'Local',
      'x-forwarded-for': 'N/A'
    }
  };

  return NextResponse.json(testData);
}