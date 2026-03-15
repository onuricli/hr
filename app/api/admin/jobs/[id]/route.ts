import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

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
    const { queryOne } = await import('@/lib/db');
    const job = await queryOne('SELECT * FROM jobs WHERE id = $1', [id]);

    if (!job) {
      return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    return NextResponse.json(
      { error: 'İlan alınamadı' },
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

    if (body.isActive !== undefined) {
      await query(
        'UPDATE jobs SET is_active = $1, updated_at = NOW() WHERE id = $2',
        [body.isActive, id]
      );
      return NextResponse.json({ success: true });
    }

    const {
      title,
      department,
      location,
      jobType,
      experienceLevel,
      description,
      requirements,
      benefits,
      salaryMin,
      salaryMax,
    } = body;

    await query(
      `UPDATE jobs SET
        title = COALESCE($1, title),
        department = COALESCE($2, department),
        location = COALESCE($3, location),
        job_type = COALESCE($4, job_type),
        experience_level = COALESCE($5, experience_level),
        description = COALESCE($6, description),
        requirements = COALESCE($7, requirements),
        benefits = COALESCE($8, benefits),
        salary_min = COALESCE($9, salary_min),
        salary_max = COALESCE($10, salary_max),
        updated_at = NOW()
      WHERE id = $11`,
      [
        title,
        department,
        location,
        jobType,
        experienceLevel,
        description,
        requirements,
        benefits,
        salaryMin ?? null,
        salaryMax ?? null,
        id,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update job error:', error);
    return NextResponse.json(
      { error: 'İş ilanı güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    }

    const { id } = await params;

    await query('DELETE FROM jobs WHERE id = $1', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete job error:', error);
    return NextResponse.json(
      { error: 'İş ilanı silinemedi' },
      { status: 500 }
    );
  }
}
