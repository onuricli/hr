<<<<<<< HEAD
# İş Başvuru Yönetim Sistemi

Profesyonel, kurumsal kariyer başvuru ve işe alım platformu. Next.js, TypeScript, Tailwind CSS ve PostgreSQL ile geliştirilmiştir.

## Özellikler

### Kullanıcı Tarafı (Kariyer Portalı)
- **Ana Sayfa**: Banner, açık pozisyonlar önizlemesi, şirket avantajları, çalışan yorumları
- **Açık Pozisyonlar**: Departman, şehir, çalışma tipi, deneyim seviyesine göre filtreleme
- **İlan Detay**: İş tanımı, nitelikler, imkanlar, başvuru formu
- **Başvuru Formu**: Ad Soyad, Email, Telefon, Doğum tarihi, Şehir, Eğitim, Deneyim, CV (PDF/DOC), Ön yazı, LinkedIn, Portföy
- **Spam Koruması**: Honeypot alanı
- **Hakkımızda** ve **İletişim** sayfaları

### Admin Paneli
- **Giriş Sistemi**: JWT tabanlı kimlik doğrulama
- **Dashboard**: Toplam/yeni başvurular, aktif ilanlar, durum grafikleri, son başvurular
- **İş İlanı Yönetimi**: Ekleme, düzenleme, silme, aktif/pasif
- **Başvuru Yönetimi**: Liste, durum değiştirme (Yeni, İnceleniyor, Mülakata çağrıldı, Olumlu, Olumsuz)
- **Aday Detay**: Kişisel bilgiler, CV indirme, not ekleme, mülakat takibi
- **Anahtar Kelime Arama**: Ad, email, ön yazı, pozisyon
- **Excel/CSV Export**
- **Çoklu Admin Hesabı**

### Teknik
- Next.js 16, React 19, TypeScript
- Tailwind CSS, shadcn/ui
- Neon PostgreSQL
- Vercel Blob (CV depolama)
- JWT Authentication
- REST API mimarisi

## Kurulum

### Yöntem 1: Kurulum Sihirbazı (Önerilen)

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. `.env` dosyası oluşturun (`.env.example` şablonundan):
```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
BLOB_READ_WRITE_TOKEN=vercel_blob_token
JWT_SECRET=güvenli-rastgele-anahtar-en-az-16-karakter
```

3. Sunucuyu başlatın ve `/install` adresine gidin:
```bash
npm run dev
```
Tarayıcıda `http://localhost:3000/install` açın.

4. Sihirbazı adım adım takip edin:
   - **Adım 1**: Ortam değişkenleri kontrolü
   - **Adım 2**: Veritabanı şeması oluşturma
   - **Adım 3**: Admin hesabı oluşturma
   - **Adım 4**: Demo veriler (opsiyonel)

### Yöntem 2: Manuel Kurulum

```bash
# 1. Bağımlılıklar
npm install

# 2. .env dosyasını düzenleyin

# 3. PostgreSQL ile şemayı çalıştırın
psql $DATABASE_URL -f scripts/01-create-schema.sql
psql $DATABASE_URL -f scripts/03-alter-schema.sql
psql $DATABASE_URL -f scripts/04-application-extras.sql

# 4. Admin kullanıcısı
node scripts/create-admin.js
```

### Gereksinimler
- Node.js 18+
- PostgreSQL (Neon önerilir)
- Vercel Blob (CV yükleme için)

### cPanel Kurulumu
Detaylı rehber: **[docs/CPANEL-KURULUM.md](docs/CPANEL-KURULUM.md)**

## Demo Giriş Bilgileri
- **Admin Panel**: `/admin/login`
- **Email**: `admin@example.com` (seed'den sonra create-admin.js çalıştırın)
- **Şifre**: `Admin123!@#`

## Proje Yapısı

```
├── app/
│   ├── page.tsx              # Ana sayfa
│   ├── about/page.tsx        # Hakkımızda
│   ├── contact/page.tsx      # İletişim
│   ├── install/page.tsx      # Kurulum sihirbazı
│   ├── jobs/                 # İlan listesi ve detay
│   ├── admin/
│   │   ├── login/            # Admin giriş
│   │   ├── dashboard/        # Admin panel
│   │   └── applications/[id] # Aday detay
│   └── api/
│       ├── install/          # Kurulum API
│       │   ├── status/       # Kurulum durumu
│       │   └── step/         # Adım çalıştırma
│       └── ...
├── lib/
│   └── install/              # Modüler kurulum
│       ├── env-check.ts      # Ortam kontrolü
│       ├── database.ts       # Şema oluşturma
│       ├── admin.ts          # Admin oluşturma
│       ├── seed.ts           # Demo veriler
│       └── index.ts
├── components/
│   ├── header.tsx
│   ├── footer.tsx
│   ├── application-form.tsx
│   ├── jobs-preview.tsx
│   └── admin/
├── lib/
│   ├── db.ts                 # Veritabanı
│   ├── auth.ts               # JWT
│   └── email.ts              # Email servisi (opsiyonel)
└── scripts/
    ├── 01-create-schema.sql
    ├── 02-seed-data.sql
    ├── 03-alter-schema.sql
    ├── 04-application-extras.sql
    └── create-admin.js
```

## Email Bildirimleri
Başvurular hem **admin panelde** listelenir hem de **belirlenen mail adreslerine** bildirim gider.

`.env`:
```env
NOTIFICATION_EMAILS=hr@sirket.com,kariyer@sirket.com
EMAIL_SERVICE_ENABLED=true   # Gerçek mail için (Resend/SendGrid gerekir)
```

- **Adaya**: Başvuru alındı
- **Admine**: Yeni başvuru özeti (ad, email, pozisyon, ön yazı, admin link)
- Mülakat daveti / Olumsuz geri dönüş

## Tasarım
- **Ana Renk**: #D32F2F (Kırmızı)
- **Yardımcı**: #FFFFFF (Beyaz)
- Minimal, kurumsal, Apple tarzı arayüz
- Mobil uyumlu (responsive)

## Güvenlik
- JWT HTTP-only cookie
- bcrypt şifre hash
- Parametreli SQL sorguları
- Honeypot spam koruması
- CV dosya tipi kontrolü (PDF, DOC, DOCX)

## Lisans
Özel kullanım.
=======
# hr
>>>>>>> 897cee57b1f35435c8a14986b40803ffabab37f7
