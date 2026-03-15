import { NextRequest, NextResponse } from 'next/server';
import { queryAll, queryOne } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const location = searchParams.get('location');
    const jobType = searchParams.get('jobType');
    const experienceLevel = searchParams.get('experienceLevel');

    let query = 'SELECT * FROM jobs WHERE is_active = true';
    const params: any[] = [];

    if (department) {
      query += ` AND department = $${params.length + 1}`;
      params.push(department);
    }
    if (location) {
      query += ` AND location = $${params.length + 1}`;
      params.push(location);
    }
    if (jobType) {
      query += ` AND job_type = $${params.length + 1}`;
      params.push(jobType);
    }
    if (experienceLevel) {
      query += ` AND experience_level = $${params.length + 1}`;
      params.push(experienceLevel);
    }

    query += ' ORDER BY published_at DESC';

    const jobs = await queryAll(query, params);

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    return NextResponse.json(
      { error: 'İş ilanları alınamadı' },
      { status: 500 }
    );
  }
}
