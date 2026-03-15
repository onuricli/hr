# cPanel Kurulum Rehberi

Bu proje **Next.js** (Node.js) tabanlıdır. cPanel'de kurulum için sunucunuzda **Node.js** desteği olması gerekir.

## Önemli Not

**Çoğu standart cPanel hosting** sadece PHP destekler ve Node.js çalıştırmaz. Aşağıdaki seçenekleri değerlendirin:

| Seçenek | Öneri | Açıklama |
|---------|-------|----------|
| **cPanel + Node.js** | ✅ Uyumlu | Hostinger, A2 Hosting, SiteGround gibi Node.js destekli hostlar |
| **Vercel** | ✅ Kolay | Next.js için ücretsiz, 1 tıkla deploy |
| **VPS + cPanel** | ✅ Tam kontrol | DigitalOcean, Linode üzerine cPanel kurulumu |

---

## Yöntem 1: cPanel'de Node.js Desteği Varsa

### Gereksinimler
- cPanel "Setup Node.js App" veya "Node.js Selector" özelliği
- PostgreSQL veritabanı (cPanel genelde MySQL sunar; **Neon.tech** veya **Supabase** ücretsiz cloud PostgreSQL kullanın)

### Adımlar

#### 1. Projeyi Hazırlayın
```bash
# Lokal bilgisayarınızda
npm run build
```

`package.json`'a start script ekleyin (genelde vardır):
```json
"scripts": {
  "start": "next start"
}
```

#### 2. cPanel'e Dosyaları Yükleyin
- File Manager veya FTP ile `public_html` dışında bir klasöre yükleyin (örn: `kariyer-portali`)
- `.next` klasörünü de yükleyin (build çıktısı)
- `node_modules` yüklemeyin; sunucuda `npm install` ile oluşturulacak

#### 3. Node.js Uygulaması Oluşturun
1. cPanel → **Setup Node.js App** (veya "Node.js Selector")
2. **Create Application**
3. Node.js sürümü: 18 veya 20
4. Application root: `kariyer-portali` (veya yüklediğiniz klasör)
5. Application URL: `kariyer` (site.com/kariyer) veya subdomain

#### 4. Bağımlılıkları Yükleyin
cPanel'de "Run NPM Install" butonuna tıklayın veya SSH ile:

```bash
cd ~/kariyer-portali
npm install --production
npm run build
```

#### 5. Ortam Değişkenlerini Ayarlayın
cPanel Node.js uygulamasında "Edit" → **Environment Variables** bölümüne ekleyin:

```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
BLOB_READ_WRITE_TOKEN=vercel_blob_token
JWT_SECRET=güvenli-32-karakterlik-anahtar
NOTIFICATION_EMAILS=hr@sirket.com
NEXT_PUBLIC_APP_URL=https://siteniz.com
```

#### 6. Application Startup File
cPanel "Application startup file" soruyorsa:

**Dosya adı:** `server.js`

Proje kökünde `server.js` dosyası mevcuttur. Bu dosyayı startup file olarak belirleyin.

Alternatif olarak **Run script** alanında: `npm run start`

#### 7. Reverse Proxy (Önerilen)
Ana domain/subdomain'i Node.js uygulamasına yönlendirin:
- cPanel → Domains → Redirects veya .htaccess ile proxy
- Örnek .htaccess (ana domain Node'a yönlendirme):

```apache
RewriteEngine On
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
```

(Proxy modülü açık olmalı)

---

## Yöntem 2: Vercel ile Deploy (Önerilen)

cPanel'de Node.js yoksa veya kurulum zor geliyorsa **Vercel** kullanın:

1. [vercel.com](https://vercel.com) hesabı açın
2. GitHub’a projeyi yükleyin
3. Vercel’de "Import Project" → Repo seçin
4. Environment variables ekleyin:
   - `DATABASE_URL`
   - `BLOB_READ_WRITE_TOKEN`
   - `JWT_SECRET`
   - `NOTIFICATION_EMAILS`
5. Deploy’a tıklayın

**Ücretsiz** ve Next.js için tasarlanmış. cPanel hosting’iniz sadece domain’i Vercel’e yönlendirebilir.

---

## Yöntem 3: VPS + cPanel

DigitalOcean, Linode veya benzeri VPS kiralayıp cPanel/WHM kurarsanız:

1. VPS’e SSH ile bağlanın
2. Node.js 18+ yükleyin
3. Projeyi `/var/www/kariyer` gibi bir dizine kopyalayın
4. `npm install` ve `npm run build`
5. PM2 ile sürekli çalıştırın: `pm2 start npm --name "kariyer" -- start`
6. Nginx reverse proxy ile 80/443 portuna yönlendirin

---

## Veritabanı (PostgreSQL)

cPanel hosting’lerde genelde PostgreSQL yok. İki seçenek:

1. **Neon.tech** (ücretsiz): [neon.tech](https://neon.tech) → Proje oluştur → connection string alın
2. **Supabase** (ücretsiz): [supabase.com](https://supabase.com) → Proje → Settings → Database → connection string

`DATABASE_URL` bu connection string ile doldurulacak.

---

## Özet Checklist

- [ ] Node.js destekli hosting veya Vercel
- [ ] Neon/Supabase PostgreSQL
- [ ] Vercel Blob token (CV yükleme)
- [ ] .env değişkenleri
- [ ] `/install` ile kurulum
- [ ] NOTIFICATION_EMAILS ayarı

Sorunuz olursa hosting sağlayıcınızın "Node.js desteği" olup olmadığını sorun.
