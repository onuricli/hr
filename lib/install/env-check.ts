export interface EnvCheckResult {
  ok: boolean;
  checks: { name: string; key: string; ok: boolean; message?: string }[];
}

export function checkEnv(): EnvCheckResult {
  const checks = [
    {
      name: 'Veritabanı Bağlantısı',
      key: 'DATABASE_URL',
      ok: !!process.env.DATABASE_URL?.trim(),
      message: process.env.DATABASE_URL ? 'Tanımlı' : 'Eksik - .env dosyasına ekleyin',
    },
    {
      name: 'JWT Gizli Anahtar',
      key: 'JWT_SECRET',
      ok: !!process.env.JWT_SECRET?.trim() && process.env.JWT_SECRET.length >= 16,
      message:
        process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 16
          ? 'Güvenli'
          : process.env.JWT_SECRET
            ? 'En az 16 karakter olmalı'
            : 'Eksik',
    },
    {
      name: 'Dosya Depolama (Vercel Blob)',
      key: 'BLOB_READ_WRITE_TOKEN',
      ok: !!process.env.BLOB_READ_WRITE_TOKEN?.trim(),
      message: process.env.BLOB_READ_WRITE_TOKEN ? 'Tanımlı' : 'Opsiyonel - CV yükleme için gerekli',
    },
  ];

  return {
    ok: checks.filter((c) => c.key !== 'BLOB_READ_WRITE_TOKEN').every((c) => c.ok),
    checks,
  };
}
