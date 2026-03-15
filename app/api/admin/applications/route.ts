import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { queryAll, query as dbQuery } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.trim();

    let query_str = `SELECT a.*, j.title as job_title 
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE 1=1`;
    const params: unknown[] = [];

    if (status) {
      query_str += ` AND a.status = $${params.length + 1}`;
      params.push(status);
    }

    if (search) {
      query_str += ` AND (
        a.full_name ILIKE $${params.length + 1} OR
        a.email ILIKE $${params.length + 1} OR
        a.cover_letter ILIKE $${params.length + 1} OR
        j.title ILIKE $${params.length + 1}
      )`;
      params.push(`%${search}%`);
    }

    query_str += ' ORDER BY a.created_at DESC';

    const applications = await queryAll(query_str, params);

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Get admin applications error:', error);
    return NextResponse.json(
      { error: 'Başvurular alınamadı' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId, status, notes } = body;

    await dbQuery(
      `UPDATE applications 
       SET status = $1, notes = $2, updated_at = NOW()
       WHERE id = $3`,
      [status, notes, applicationId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json(
      { error: 'Başvuru güncellenemedi' },
      { status: 500 }
    );
  }
}
