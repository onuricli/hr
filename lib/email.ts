/**
 * Email servisi - Başvuru, mülakat ve olumsuz geri dönüş mailleri
 * Production için Resend, SendGrid veya Nodemailer entegre edin.
 */

export type EmailType = 'application_received' | 'interview_invite' | 'rejection';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  applicantName?: string;
  jobTitle?: string;
  interviewDate?: string;
}

async function sendEmail(options: EmailOptions): Promise<boolean> {
  // NOTIFICATION_EMAILS tanımlıysa admin bildirimleri her zaman denenir (simülasyon veya gerçek)
  const isSimulated = process.env.EMAIL_SERVICE_ENABLED !== 'true';
  if (isSimulated) {
    console.log('[Email] (Simulated) To:', options.to, 'Subject:', options.subject);
    return true;
  }

  // Resend, SendGrid veya Nodemailer entegrasyonu
  // Örnek Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ from: 'kariyer@firma.com', to: options.to, subject: options.subject, html: options.html });
  
  console.log('[Email] Send:', options.to, options.subject);
  return true;
}

export async function sendApplicationReceivedEmail(
  email: string,
  applicantName: string,
  jobTitle: string
): Promise<void> {
  await sendEmail({
    to: email,
    subject: `Başvurunuz Alındı - ${jobTitle}`,
    html: `
      <h2>Merhaba ${applicantName},</h2>
      <p><strong>${jobTitle}</strong> pozisyonu için yaptığınız başvuru başarıyla alınmıştır.</p>
      <p>Başvurunuz incelendikten sonra en kısa sürede sizinle iletişime geçeceğiz.</p>
      <p>İyi günler dileriz.</p>
    `,
  });
}

export async function sendInterviewInviteEmail(
  email: string,
  applicantName: string,
  jobTitle: string,
  interviewDate: string
): Promise<void> {
  await sendEmail({
    to: email,
    subject: `Mülakat Daveti - ${jobTitle}`,
    html: `
      <h2>Merhaba ${applicantName},</h2>
      <p><strong>${jobTitle}</strong> pozisyonu için yaptığınız başvurumuzu değerlendirdik ve sizi mülakata davet etmek istiyoruz.</p>
      <p><strong>Mülakat Tarihi:</strong> ${new Date(interviewDate).toLocaleString('tr-TR')}</p>
      <p>Detaylar için size kısa süre içinde ulaşacağız.</p>
      <p>İyi günler dileriz.</p>
    `,
  });
}

/**
 * Yeni başvuru bildirimi - Belirlenen mail adreslerine (HR/Admin) gönderilir
 */
export async function sendNewApplicationNotificationToAdmins(
  application: {
    fullName: string;
    email: string;
    phone: string;
    jobTitle: string;
    department?: string;
    education: string;
    experienceYears: number;
    city: string;
    coverLetter?: string;
  },
  adminPanelUrl?: string
): Promise<void> {
  const emailsRaw = process.env.NOTIFICATION_EMAILS || process.env.ADMIN_NOTIFICATION_EMAILS || '';
  const emails = emailsRaw
    .split(',')
    .map((e) => e.trim())
    .filter((e) => e && e.includes('@'));

  if (emails.length === 0) {
    console.log('[Email] NOTIFICATION_EMAILS tanımlı değil, admin bildirimi atlanıyor');
    return;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const panelLink = adminPanelUrl || `${baseUrl}/admin/dashboard`;

  const html = `
    <h2>Yeni Başvuru Alındı</h2>
    <p><strong>${application.fullName}</strong> <strong>${application.jobTitle}</strong> pozisyonuna başvurdu.</p>
    <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
      <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${application.email}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Telefon</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${application.phone}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Şehir</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${application.city}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Eğitim</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${application.education}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Deneyim</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${application.experienceYears} yıl</td></tr>
      ${application.department ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Departman</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${application.department}</td></tr>` : ''}
    </table>
    ${application.coverLetter ? `<p><strong>Ön Yazı:</strong><br/>${(application.coverLetter as string).slice(0, 500)}${(application.coverLetter as string).length > 500 ? '...' : ''}</p>` : ''}
    <p><a href="${panelLink}" style="color: #D32F2F;">Admin panele git →</a></p>
  `;

  for (const to of emails) {
    await sendEmail({
      to,
      subject: `Yeni Başvuru: ${application.fullName} - ${application.jobTitle}`,
      html,
    });
  }
}

export async function sendRejectionEmail(
  email: string,
  applicantName: string,
  jobTitle: string
): Promise<void> {
  await sendEmail({
    to: email,
    subject: `Başvuru Sonucu - ${jobTitle}`,
    html: `
      <h2>Merhaba ${applicantName},</h2>
      <p><strong>${jobTitle}</strong> pozisyonu için yaptığınız başvuruyu değerlendirdik.</p>
      <p>Maalesef bu pozisyon için başvurunuzu olumlu sonuçlandıramadık.</p>
      <p>Gelecekteki açık pozisyonlarımızı takip etmenizi öneririz.</p>
      <p>İyi günler dileriz.</p>
    `,
  });
}
