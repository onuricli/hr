import { NextRequest, NextResponse } from 'next/server';
import { checkEnv, runSchema, createAdmin, runSeed } from '@/lib/install';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { step } = body;

    switch (step) {
      case 1: {
        const result = checkEnv();
        return NextResponse.json({
          ok: result.ok,
          checks: result.checks,
          message: result.ok ? 'Ortam değişkenleri doğrulandı' : 'Bazı değişkenler eksik',
        });
      }

      case 2: {
        const result = await runSchema();
        return NextResponse.json({
          ok: result.ok,
          error: result.error,
          message: result.ok ? 'Veritabanı şeması oluşturuldu' : result.error,
        });
      }

      case 3: {
        const { email, password, fullName } = body;
        const result = await createAdmin({ email, password, fullName });
        return NextResponse.json({
          ok: result.ok,
          adminId: result.id,
          error: result.error,
          message: result.ok ? 'Admin kullanıcısı oluşturuldu' : result.error,
        });
      }

      case 4: {
        const { adminId } = body;
        if (!adminId) {
          return NextResponse.json(
            { ok: false, error: 'Admin ID gerekli' },
            { status: 400 }
          );
        }
        const result = await runSeed(adminId);
        return NextResponse.json({
          ok: result.ok,
          error: result.error,
          message: result.ok ? 'Demo veriler eklendi' : result.error,
        });
      }

      default:
        return NextResponse.json(
          { ok: false, error: 'Geçersiz adım' },
          { status: 400 }
        );
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Kurulum hatası';
    return NextResponse.json(
      { ok: false, error: msg },
      { status: 500 }
    );
  }
}
