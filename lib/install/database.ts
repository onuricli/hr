import { query } from '@/lib/db';

const MAIN_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    job_type VARCHAR(50) NOT NULL,
    experience_level VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    benefits TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    is_active BOOLEAN DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    birth_date DATE NOT NULL,
    city VARCHAR(100) NOT NULL,
    education VARCHAR(255) NOT NULL,
    experience_years INTEGER NOT NULL,
    cover_letter TEXT,
    linkedin_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    cv_file_url VARCHAR(500),
    cv_file_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Yeni',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id)`,
  `CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email)`,
  `CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status)`,
  `CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active)`,
  `CREATE INDEX IF NOT EXISTS idx_jobs_department ON jobs(department)`,
  `CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location)`,
  `CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type)`,
  `CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON jobs(experience_level)`,
  `CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = CURRENT_TIMESTAMP;
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql`,
  `DROP TRIGGER IF EXISTS update_users_updated_at ON users`,
  `CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
  `DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs`,
  `CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
  `DROP TRIGGER IF EXISTS update_applications_updated_at ON applications`,
  `CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
];

const EXTRA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS application_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_application_notes_application_id ON application_notes(application_id)`,
  `ALTER TABLE applications ADD COLUMN IF NOT EXISTS interview_date TIMESTAMP WITH TIME ZONE`,
  `ALTER TABLE applications ADD COLUMN IF NOT EXISTS interview_notes TEXT`,
];

export async function runSchema(): Promise<{ ok: boolean; error?: string }> {
  try {
    for (const stmt of MAIN_STATEMENTS) {
      await query(stmt);
    }
    for (const stmt of EXTRA_STATEMENTS) {
      await query(stmt);
    }
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Bilinmeyen hata';
    return { ok: false, error: msg };
  }
}
