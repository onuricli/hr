-- Make CV columns nullable to allow applications without uploaded files
ALTER TABLE applications 
ALTER COLUMN cv_file_url DROP NOT NULL,
ALTER COLUMN cv_file_name DROP NOT NULL;
