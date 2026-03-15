import bcrypt from 'bcryptjs';
import { query, queryOne } from '@/lib/db';

export interface CreateAdminInput {
  email: string;
  password: string;
  fullName: string;
}

export async function createAdmin(input: CreateAdminInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  const { email, password, fullName } = input;

  if (!email?.trim() || !password?.trim() || !fullName?.trim()) {
    return { ok: false, error: 'Email, şifre ve ad soyad zorunludur' };
  }

  if (password.length < 8) {
    return { ok: false, error: 'Şifre en az 8 karakter olmalıdır' };
  }

  try {
    const hash = bcrypt.hashSync(password, 10);

    await query(
      `INSERT INTO users (email, password_hash, full_name, role, is_active)
       VALUES ($1, $2, $3, 'admin', true)
       ON CONFLICT (email) DO UPDATE SET password_hash = $2, full_name = $3`,
      [email.trim(), hash, fullName.trim()]
    );

    const user = await queryOne<{ id: string }>('SELECT id FROM users WHERE email = $1', [email.trim()]);
    return { ok: true, id: user?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Bilinmeyen hata';
    return { ok: false, error: msg };
  }
}
