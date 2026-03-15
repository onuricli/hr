import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { queryOne, queryAll, query as dbQuery } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    }

    const { id } = await params;

    const application = await queryOne(
      `SELECT a.*, j.title as job_title, j.department
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.id = $1`,
      [id]
    );

    if (!application) {
      return NextResponse.json(
        { error: 'Başvuru bulunamadı' },
        { status: 404 }
      );
    }

    // Notları getir (tablo varsa)
    let notes: { id: string; note: string; created_at: string; full_name?: string }[] = [];
    try {
      const notesResult = await queryAll(
        `SELECT an.id, an.note, an.created_at, u.full_name
         FROM application_notes an
         JOIN users u ON an.user_id = u.id
         WHERE an.application_id = $1
         ORDER BY an.created_at DESC`,
        [id]
      );
      notes = notesResult;
    } catch {
      // application_notes tablosu yoksa atla
    }

    return NextResponse.json({ ...application, admin_notes: notes });
  } catch (error) {
    console.error('Get application error:', error);
    return NextResponse.json(
      { error: 'Başvuru alınamadı' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      status,
      notes,
      interview_date,
      interview_notes,
    } = body;

    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status);
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramIndex++}`);
      values.push(notes);
    }
    if (interview_date !== undefined) {
      updates.push(`interview_date = $${paramIndex++}`);
      values.push(interview_date || null);
    }
    if (interview_notes !== undefined) {
      updates.push(`interview_notes = $${paramIndex++}`);
      values.push(interview_notes);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Güncellenecek alan yok' }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    await dbQuery(
      `UPDATE applications SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      values
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
