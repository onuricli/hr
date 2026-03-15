import { query } from '@/lib/db';

export async function runSeed(adminId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await query(
      `INSERT INTO jobs (title, department, location, job_type, experience_level, description, requirements, benefits, salary_min, salary_max, is_active, published_at, created_by)
       VALUES
         ('Senior Backend Developer', 'Yazılım', 'İstanbul', 'Full Time', 'Kıdemli',
          'Backend geliştirme ve API tasarımı.', '5+ yıl deneyim, Node.js, PostgreSQL.', 'Rekabetçi maaş, sağlık sigortası.', 80000, 120000, true, NOW(), $1::uuid),
         ('Frontend Developer', 'Yazılım', 'Remote', 'Full Time', 'Orta',
          'React/Next.js ile kullanıcı arayüzü geliştirme.', '2+ yıl React deneyimi.', 'Remote çalışma, eğitim desteği.', 50000, 80000, true, NOW(), $1::uuid),
         ('Product Designer', 'Tasarım', 'İstanbul', 'Full Time', 'Orta',
          'UX/UI tasarımı ve prototipleme.', 'Figma, design systems.', 'Yaratıcı özerklik.', 45000, 75000, true, NOW(), $1::uuid)`,
      [adminId]
    );

    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Bilinmeyen hata';
    return { ok: false, error: msg };
  }
}
