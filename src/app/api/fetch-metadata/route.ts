import { NextRequest, NextResponse } from 'next/server';
import getMetaData from 'metadata-scraper';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required and must be a string' }, { status: 400 });
  }

  try {
    const metadata = await getMetaData(url);
    return NextResponse.json(metadata, { status: 200 });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
}
