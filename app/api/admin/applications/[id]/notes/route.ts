import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    }

    const { id: applicationId } = await params;
    const body = await request.json();
    const { note } = body;

    if (!note || typeof note !== 'string' || note.trim().length === 0) {
      return NextResponse.json(
        { error: 'Not içeriği gerekli' },
        { status: 400 }
      );
    }

    const noteId = randomUUID();
    await query(
      `INSERT INTO application_notes (id, application_id, user_id, note)
       VALUES ($1, $2, $3, $4)`,
      [noteId, applicationId, session.id, note.trim()]
    );

    return NextResponse.json({ success: true, id: noteId }, { status: 201 });
  } catch (error) {
    console.error('Add note error:', error);
    return NextResponse.json(
      { error: 'Not eklenemedi' },
      { status: 500 }
    );
  }
}
