-- Insert demo admin user
-- Password: admin123 (bcrypt hash)
INSERT INTO users (id, email, password_hash, full_name, role, is_active, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  'admin@example.com',
  '$2b$10$4iV6gWh3dBpBJ4hBD5.k2eE3y3bJ5m5n5m5n5m5n5m5n5m5n5m5n',
  'Admin User',
  'admin',
  true,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- Insert sample jobs
INSERT INTO jobs (id, title, department, location, job_type, experience_level, description, requirements, benefits, salary_min, salary_max, is_active, published_at, created_by, created_at, updated_at)
VALUES 
(
  '22222222-2222-2222-2222-222222222222'::uuid,
  'Senior Backend Developer',
  'Yazılım',
  'İstanbul',
  'Full Time',
  'Kıdemli',
  'Ürünümüzün backend infrastrüktürünün geliştirilmesi ve optimize edilmesini aradığımız Senior Developer. Node.js ve PostgreSQL konusunda deneyim gereklidir. Mikro hizmetler mimarisi, API tasarımı ve sistem tasarımı konularında çalışacaksın.',
  '- 5+ yıl backend geliştirme deneyimi\n- Node.js/TypeScript deneyimi\n- PostgreSQL/MongoDB bilgisi\n- RESTful API tasarımı\n- Sistem tasarımı\n- Docker ve Kubernetes temel bilgisi\n- CI/CD pipeline yönetimi',
  '- Rekabetçi maaş ve bonus sistemi\n- Döner hisse senedi\n- Sınırsız çalışma saati esnekliği\n- Evden çalışma imkanı\n- Sağlık sigortası\n- Profesyonel gelişim bütçesi\n- Team outings ve company events',
  80000,
  120000,
  true,
  NOW(),
  '11111111-1111-1111-1111-111111111111'::uuid,
  NOW(),
  NOW()
),
(
  '33333333-3333-3333-3333-333333333333'::uuid,
  'Frontend Developer',
  'Yazılım',
  'Remote',
  'Full Time',
  'Orta',
  'Kullanıcı arayüzü geliştirme ve iyileştirme üzerinde çalışacaksın. React ve modern web teknolojileri kullanarak responsive ve performant uygulamalar inşa edeceksin.',
  '- 2+ yıl frontend geliştirme deneyimi\n- React/Next.js bilgisi\n- TypeScript\n- Tailwind CSS / CSS-in-JS\n- Web performance optimizasyonu\n- Responsive tasarım',
  '- Esnek çalışma saatleri\n- Tamamen remote\n- Büyük maaş artışı potansiyeli\n- Eğitim desteği\n- Modern tech stack\n- Agile metodoloji',
  50000,
  80000,
  true,
  NOW(),
  '11111111-1111-1111-1111-111111111111'::uuid,
  NOW(),
  NOW()
),
(
  '44444444-4444-4444-4444-444444444444'::uuid,
  'Product Designer',
  'Tasarım',
  'İstanbul',
  'Full Time',
  'Orta',
  'Ürün tasarımı ve kullanıcı deneyimi iyileştirmesi üzerine çalışacaksın. Figma, prototyping ve user research konularında bilgi sahibi olmalısın.',
  '- 3+ yıl UX/UI tasarım deneyimi\n- Figma ustası\n- Design systems bilgisi\n- User research methodology\n- Wireframing ve prototyping\n- HTML/CSS temel bilgisi\n- Mobile-first design',
  '- Yaratıcı özerklik\n- Rekabetçi maaş\n- Design konferansları için bütçe\n- Tasarım aletleri lisansı\n- Agile takımda çalışma\n- Portfolio geliştirme fırsatı',
  45000,
  75000,
  true,
  NOW(),
  '11111111-1111-1111-1111-111111111111'::uuid,
  NOW(),
  NOW()
),
(
  '55555555-5555-5555-5555-555555555555'::uuid,
  'Growth Marketing Manager',
  'Pazarlama',
  'İstanbul',
  'Full Time',
  'Orta',
  'Ürün büyümesi ve kullanıcı kazanımı stratejisini yöneteceksin. Data-driven kararlar alarak pazarlama kampanyalarını optimize edeceksin.',
  '- 3+ yıl digital marketing deneyimi\n- Growth hacking/product marketing\n- Google Analytics ve A/B testing\n- Social media marketing\n- Email marketing\n- CRM tools bilgisi\n- SQL temel bilgisi',
  '- Performance bonusları\n- Pazarlama bütçesi\n- Deneysel pazarlama imkanı\n- Konferans katılımı\n- Mentorship programı\n- Esnek çalışma',
  40000,
  70000,
  true,
  NOW(),
  '11111111-1111-1111-1111-111111111111'::uuid,
  NOW(),
  NOW()
);

-- Insert sample applications (these are old applications to show the dashboard)
INSERT INTO applications (id, job_id, full_name, email, phone, birth_date, city, education, experience_years, cover_letter, linkedin_url, portfolio_url, cv_file_url, cv_file_name, status, notes, created_at, updated_at)
VALUES 
(
  '66666666-6666-6666-6666-666666666666'::uuid,
  '22222222-2222-2222-2222-222222222222'::uuid,
  'Ahmet Yıldız',
  'ahmet@example.com',
  '+90 555 123 4567',
  '1995-03-15'::date,
  'İstanbul',
  'Lisans',
  5,
  'Son 5 yıldır Node.js ve microservices üzerinde çalışıyorum. Startup ortamında hızlı büyüme ve scaling deneyim kazandım. Takımla birlikte çalışmayı seviyorum.',
  'https://linkedin.com/in/ahmetyildiz',
  'https://github.com/ahmetyildiz',
  NULL,
  NULL,
  'Mülakata çağrıldı',
  'Teknik mülakat için aşama 2ye geçti. Çok iyi performans gösterdi.',
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '5 days'
),
(
  '77777777-7777-7777-7777-777777777777'::uuid,
  '33333333-3333-3333-3333-333333333333'::uuid,
  'Zeynep Kara',
  'zeynep@example.com',
  '+90 555 234 5678',
  '1998-07-22'::date,
  'Ankara',
  'Lisans',
  2,
  'React ile 2 yıldır çalışıyorum. Kendimi continuous learning ve best practices ile güncellemeyi seviyorum. Açık kaynak projelere katkı yapıyorum.',
  'https://linkedin.com/in/zeynepkara',
  'https://zeynepkara.dev',
  NULL,
  NULL,
  'İnceleniyor',
  NULL,
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '2 days'
),
(
  '88888888-8888-8888-8888-888888888888'::uuid,
  '44444444-4444-4444-4444-444444444444'::uuid,
  'Emre Demir',
  'emre@example.com',
  '+90 555 345 6789',
  '1996-11-10'::date,
  'İzmir',
  'Lisans',
  3,
  'Figma ve design thinking konusunda uzman. Kullanıcı merkezli tasarım yapmaya inanıyorum. İnovatif ve modern UI/UX çözümler geliştirmek istiyorum.',
  'https://linkedin.com/in/emredelmir',
  'https://behance.net/emredelmir',
  NULL,
  NULL,
  'Yeni',
  NULL,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
);
