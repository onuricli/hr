-- Admin notları için application_notes tablosu
CREATE TABLE IF NOT EXISTS application_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_application_notes_application_id ON application_notes(application_id);

-- Mülakat takibi için applications tablosuna sütunlar
ALTER TABLE applications ADD COLUMN IF NOT EXISTS interview_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS interview_notes TEXT;
