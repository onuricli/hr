import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query, queryAll, queryOne } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    }

    const jobs = await queryAll(
      'SELECT * FROM jobs ORDER BY created_at DESC'
    );

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Get admin jobs error:', error);
    return NextResponse.json(
      { error: 'İş ilanları alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    }

    const body = await request.json();
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

    const jobId = randomUUID();

    await query(
      `INSERT INTO jobs (
        id, title, department, location, job_type, experience_level,
        description, requirements, benefits, salary_min, salary_max,
        is_active, published_at, created_by, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, NOW(), $12, NOW(), NOW())`,
      [
        jobId,
        title,
        department,
        location,
        jobType,
        experienceLevel,
        description,
        requirements,
        benefits,
        salaryMin || null,
        salaryMax || null,
        session.id,
      ]
    );

    return NextResponse.json(
      { success: true, jobId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create job error:', error);
    return NextResponse.json(
      { error: 'İş ilanı oluşturulamadı' },
      { status: 500 }
    );
  }
}
