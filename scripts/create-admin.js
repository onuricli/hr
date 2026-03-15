/**
 * Admin kullanıcısı oluşturma scripti
 * Kullanım: node scripts/create-admin.js
 * Önce DATABASE_URL ve gerekli paketlerin yüklü olduğundan emin olun.
 */
const bcrypt = require('bcryptjs');
const { Pool } = require('@neondatabase/serverless');

const email = process.env.ADMIN_EMAIL || 'admin@example.com';
const password = process.env.ADMIN_PASSWORD || 'Admin123!@#';
const fullName = process.env.ADMIN_NAME || 'Admin';

async function main() {
  const hash = bcrypt.hashSync(password, 10);
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  await pool.query(
    `INSERT INTO users (email, password_hash, full_name, role, is_active)
     VALUES ($1, $2, $3, 'admin', true)
     ON CONFLICT (email) DO UPDATE SET password_hash = $2, full_name = $3`,
    [email, hash, fullName]
  );
  
  console.log('Admin kullanıcısı oluşturuldu/güncellendi:', email);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
