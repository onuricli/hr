import { NextResponse } from 'next/server';
import { checkEnv } from '@/lib/install/env-check';

export async function GET() {
  const envCheck = checkEnv();

  let dbReady = false;
  let hasAdmin = false;

  if (envCheck.ok && process.env.DATABASE_URL) {
    try {
      const { queryOne } = await import('@/lib/db');
      await queryOne('SELECT 1');
      dbReady = true;

      const user = await queryOne<{ id: string }>('SELECT id FROM users LIMIT 1');
      hasAdmin = !!user;
    } catch {
      // DB not ready
    }
  }

  let adminId: string | null = null;
  if (dbReady && hasAdmin) {
    try {
      const { queryOne } = await import('@/lib/db');
      const user = await queryOne<{ id: string }>('SELECT id FROM users LIMIT 1');
      adminId = user?.id ?? null;
    } catch {
      // ignore
    }
  }

  const installed = dbReady && hasAdmin;

  return NextResponse.json({
    installed,
    adminId,
    step1: { envOk: envCheck.ok, checks: envCheck.checks },
    step2: dbReady,
    step3: hasAdmin,
  });
}
