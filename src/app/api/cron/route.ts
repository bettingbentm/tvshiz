import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Cron endpoint - not implemented yet',
    timestamp: new Date().toISOString() 
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Cron endpoint - not implemented yet',
    timestamp: new Date().toISOString() 
  });
}