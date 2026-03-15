'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Check, X, Loader2, Database, User, Server, Sparkles } from 'lucide-react';

interface InstallStatus {
  installed: boolean;
  adminId?: string | null;
  step1: { envOk: boolean; checks: { name: string; key: string; ok: boolean; message?: string }[] };
  step2: boolean;
  step3: boolean;
}

export default function InstallPage() {
  const router = useRouter();
  const [status, setStatus] = useState<InstallStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Admin form
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin123!@#');
  const [fullName, setFullName] = useState('Admin');
  const [adminId, setAdminId] = useState<string | null>(null);
  const [seedDemo, setSeedDemo] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/install/status');
      const data = await res.json();
      setStatus(data);
      if (data.adminId) setAdminId(data.adminId);
      if (data.installed) {
        setCurrentStep(5);
      } else if (!data.step1?.envOk) {
        setCurrentStep(1);
      } else if (!data.step2) {
        setCurrentStep(2);
      } else if (!data.step3) {
        setCurrentStep(3);
      } else {
        setCurrentStep(4);
      }
    } catch {
      setStatus({
        installed: false,
        step1: { envOk: false, checks: [] },
        step2: false,
        step3: false,
      });
      setCurrentStep(1);
    } finally {
      setLoading(false);
    }
  };

  const runStep = async (step: number, extra?: Record<string, unknown>) => {
    setRunning(true);
    setError(null);
    try {
      const res = await fetch('/api/install/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step, ...extra }),
      });
      const data = await res.json();

      if (!data.ok) {
        setError(data.error || data.message || 'Hata oluştu');
        return;
      }

      if (step === 3 && data.adminId) {
        setAdminId(data.adminId);
      }

      const newRes = await fetch('/api/install/status');
      const newStatus = await newRes.json();
      setStatus(newStatus);
      if (newStatus.adminId) setAdminId(newStatus.adminId);
      if (step === 1) setCurrentStep(2);
      else if (step === 2) setCurrentStep(3);
      else if (step === 3) {
        setAdminId(data.adminId);
        setCurrentStep(4);
      } else if (step === 4) setCurrentStep(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setRunning(false);
    }
  };

  const handleRunSchema = () => runStep(2);
  const handleCreateAdmin = () =>
    runStep(3, { email, password, fullName });
  const handleSeed = () => runStep(4, { adminId: adminId || undefined });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D32F2F]" />
      </div>
    );
  }

  if (status?.installed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Kurulum Tamamlandı
          </h1>
          <p className="text-gray-600 mb-6">
            Sistem kullanıma hazır. Admin panele giriş yapabilirsiniz.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/admin/login">
              <Button className="w-full bg-[#D32F2F] hover:bg-red-700 text-white">
                Admin Girişi
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Ana Sayfa
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const steps = [
    { id: 1, title: 'Ortam Kontrolü', icon: Server },
    { id: 2, title: 'Veritabanı', icon: Database },
    { id: 3, title: 'Admin Hesabı', icon: User },
    { id: 4, title: 'Demo Veriler', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kurulum Sihirbazı
          </h1>
          <p className="text-gray-600">
            İş Başvuru Yönetim Sistemi kurulumu
          </p>
        </div>

        {/* Progress */}
        <div className="flex justify-between mb-10">
          {steps.map((s) => {
            const Icon = s.icon;
            const done = s.id < currentStep || (s.id === 1 && status?.step1?.envOk) || (s.id === 2 && status?.step2) || (s.id === 3 && status?.step3);
            const active = s.id === currentStep;
            return (
              <div
                key={s.id}
                className={`flex flex-col items-center ${active ? 'opacity-100' : 'opacity-60'}`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    done
                      ? 'bg-green-500 text-white'
                      : active
                        ? 'bg-[#D32F2F] text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {done ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <span className="text-sm font-medium text-gray-700">{s.title}</span>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <X className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <Card className="p-6">
          {currentStep === 1 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Ortam Değişkenleri</h2>
              <p className="text-gray-600 text-sm mb-4">
                .env dosyanızda aşağıdaki değişkenlerin tanımlı olduğundan emin olun:
              </p>
              <div className="space-y-3 mb-6">
                {status?.step1?.checks?.map((c) => (
                  <div
                    key={c.key}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <span className="font-medium">{c.name}</span>
                    <span
                      className={`text-sm ${c.ok ? 'text-green-600' : 'text-amber-600'}`}
                    >
                      {c.message}
                    </span>
                    {c.ok ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                ))}
              </div>
              <Button
                onClick={() => runStep(1)}
                disabled={running || !status?.step1?.envOk}
                className="bg-[#D32F2F] hover:bg-red-700"
              >
                {running ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Doğrula
              </Button>
              {!status?.step1?.envOk && (
                <p className="text-sm text-amber-600 mt-2">
                  Eksik değişkenleri .env dosyasına ekleyip sunucuyu yeniden başlatın.
                </p>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Veritabanı Şeması</h2>
              <p className="text-gray-600 text-sm mb-6">
                Tablolar ve indeksler oluşturulacak.
              </p>
              <Button
                onClick={handleRunSchema}
                disabled={running}
                className="bg-[#D32F2F] hover:bg-red-700"
              >
                {running ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Şemayı Oluştur
              </Button>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Admin Kullanıcısı</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad
                  </label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Admin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şifre
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="En az 8 karakter"
                  />
                </div>
              </div>
              <Button
                onClick={handleCreateAdmin}
                disabled={running || !email || !password || !fullName}
                className="bg-[#D32F2F] hover:bg-red-700"
              >
                {running ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Admin Oluştur
              </Button>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Demo Veriler</h2>
              <p className="text-gray-600 text-sm mb-4">
                Örnek iş ilanları ekleyebilirsiniz. İsteğe bağlıdır.
              </p>
              <div className="flex items-center gap-2 mb-6">
                <input
                  type="checkbox"
                  id="seed"
                  checked={seedDemo}
                  onChange={(e) => setSeedDemo(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="seed" className="text-sm text-gray-700">
                  Demo iş ilanlarını ekle (3 örnek ilan)
                </label>
              </div>
              <div className="flex gap-3">
                {seedDemo && (
                  <Button
                    onClick={handleSeed}
                    disabled={running || !adminId}
                    className="bg-[#D32F2F] hover:bg-red-700"
                  >
                    {running ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Demo Verileri Ekle
                  </Button>
                )}
                <Button
                  variant={seedDemo ? 'outline' : 'default'}
                  onClick={async () => {
                    setCurrentStep(5);
                    const res = await fetch('/api/install/status');
                    const data = await res.json();
                    setStatus(data);
                  }}
                  className={!seedDemo ? 'bg-[#D32F2F] hover:bg-red-700' : ''}
                >
                  {seedDemo ? 'Atla' : 'Kurulumu Tamamla'}
                </Button>
              </div>
            </div>
          )}
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/" className="text-[#D32F2F] hover:underline">
            Ana sayfaya dön
          </Link>
        </p>
      </div>
    </div>
  );
}
