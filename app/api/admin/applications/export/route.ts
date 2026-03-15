import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { queryAll } from '@/lib/db';

function escapeCSV(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    }

    const applications = await queryAll(
      `SELECT a.full_name, a.email, a.phone, a.city, a.education, a.experience_years,
              a.cover_letter, a.status, a.created_at, j.title as job_title, j.department
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       ORDER BY a.created_at DESC`
    );

    const headers = [
      'Ad Soyad',
      'Email',
      'Telefon',
      'Şehir',
      'Eğitim',
      'Deneyim (Yıl)',
      'Pozisyon',
      'Departman',
      'Durum',
      'Başvuru Tarihi',
      'Ön Yazı',
    ];

    const rows = applications.map((a: Record<string, unknown>) => [
      escapeCSV(a.full_name),
      escapeCSV(a.email),
      escapeCSV(a.phone),
      escapeCSV(a.city),
      escapeCSV(a.education),
      escapeCSV(a.experience_years),
      escapeCSV(a.job_title),
      escapeCSV(a.department),
      escapeCSV(a.status),
      a.created_at
        ? new Date(a.created_at as string).toLocaleString('tr-TR')
        : '',
      escapeCSV((a.cover_letter as string)?.slice(0, 500)),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((r: string[]) => r.join(',')),
    ].join('\n');

    const bom = '\uFEFF';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8' });

    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="basvurular-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Dışa aktarılamadı' },
      { status: 500 }
    );
  }
}
