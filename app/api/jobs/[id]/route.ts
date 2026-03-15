import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const job = await queryOne(
      'SELECT * FROM jobs WHERE id = $1 AND is_active = true',
      [id]
    );

    if (!job) {
      return NextResponse.json(
        { error: 'İş ilanı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Get job detail error:', error);
    return NextResponse.json(
      { error: 'İş ilanı alınamadı' },
      { status: 500 }
    );
  }
}
