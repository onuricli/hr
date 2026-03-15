import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { put } from '@vercel/blob';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Get form fields
    const jobId = formData.get('jobId') as string;
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const birthDate = formData.get('birthDate') as string;
    const city = formData.get('city') as string;
    const education = formData.get('education') as string;
    const experienceYears = parseInt(formData.get('experienceYears') as string);
    const coverLetter = formData.get('coverLetter') as string;
    const linkedinUrl = formData.get('linkedinUrl') as string;
    const portfolioUrl = formData.get('portfolioUrl') as string;
    const cvFile = formData.get('cvFile') as File;
    const website = formData.get('website') as string;

    // Spam koruması - honeypot
    if (website) {
      return NextResponse.json(
        { success: true, message: 'Başvurunuz alındı' },
        { status: 201 }
      );
    }

    // Validate required fields
    if (!jobId || !fullName || !email || !phone) {
      return NextResponse.json(
        { error: 'Gerekli alanları doldurunuz' },
        { status: 400 }
      );
    }

    // Check if job exists
    const job = await queryOne('SELECT id FROM jobs WHERE id = $1', [jobId]);
    if (!job) {
      return NextResponse.json(
        { error: 'İş ilanı bulunamadı' },
        { status: 404 }
      );
    }

    let cvFileUrl = null;
    let cvFileName = null;

    // CV zorunludur
    if (!cvFile || cvFile.size === 0) {
      return NextResponse.json(
        { error: 'CV yüklemeniz zorunludur' },
        { status: 400 }
      );
    }

    // Upload CV file
    if (cvFile && cvFile.size > 0) {
      const fileName = `cv-${randomUUID()}-${cvFile.name}`;
      const buffer = await cvFile.arrayBuffer();
      const blob = await put(fileName, buffer, {
        access: 'private',
        contentType: cvFile.type,
      });
      cvFileUrl = blob.url;
      cvFileName = cvFile.name;
    }

    // Insert application
    const applicationId = randomUUID();
    await query(
      `INSERT INTO applications (
        id, job_id, full_name, email, phone, birth_date, city, education,
        experience_years, cover_letter, linkedin_url, portfolio_url,
        cv_file_url, cv_file_name, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())`,
      [
        applicationId,
        jobId,
        fullName,
        email,
        phone,
        birthDate,
        city,
        education,
        experienceYears,
        coverLetter,
        linkedinUrl,
        portfolioUrl,
        cvFileUrl,
        cvFileName,
        'Yeni',
      ]
    );

    // 1. Adaya "başvurunuz alındı" maili
    try {
      const { sendApplicationReceivedEmail } = await import('@/lib/email');
      const jobRow = await queryOne<{ title: string }>('SELECT title FROM jobs WHERE id = $1', [jobId]);
      await sendApplicationReceivedEmail(email, fullName, jobRow?.title || 'Pozisyon');
    } catch {
      // Aday maili gönderilemezse sessizce devam et
    }

    // 2. Admin/HR'a yeni başvuru bildirimi (NOTIFICATION_EMAILS ile belirlenen adreslere)
    try {
      const { sendNewApplicationNotificationToAdmins } = await import('@/lib/email');
      const jobRow = await queryOne<{ title: string; department: string }>('SELECT title, department FROM jobs WHERE id = $1', [jobId]);
      await sendNewApplicationNotificationToAdmins({
        fullName,
        email,
        phone,
        jobTitle: jobRow?.title || 'Pozisyon',
        department: jobRow?.department,
        education,
        experienceYears,
        city,
        coverLetter: coverLetter || undefined,
      });
    } catch {
      // Admin bildirimi gönderilemezse sessizce devam et
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Başvurunuz başarıyla alındı',
        applicationId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { error: 'Başvuru gönderilemedi' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    let query_str = 'SELECT * FROM applications';
    const params: any[] = [];

    if (jobId) {
      query_str += ` WHERE job_id = $1`;
      params.push(jobId);
    }

    query_str += ' ORDER BY created_at DESC';

    const applications = await query(query_str, params);

    return NextResponse.json(applications.rows);
  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json(
      { error: 'Başvurular alınamadı' },
      { status: 500 }
    );
  }
}
