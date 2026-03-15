'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Email ve şifre gereklidir');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Giriş başarısız oldu');
      }

      if (result.user.role !== 'admin') {
        throw new Error('Yetkiniz yok');
      }

      toast.success('Giriş başarılı!');
      router.push('/admin/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bir hata oluştu';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <span className="text-red-600 font-bold text-2xl">K</span>
            </div>
            <span className="text-white text-2xl font-bold">Kariyer Admin</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Admin Paneline Hoşgeldiniz
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Hesabınıza giriş yapın
          </p>

          {showDemo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-2">Demo Hesap:</p>
                  <p>Email: admin@example.com</p>
                  <p>Şifre: admin123</p>
                  <button
                    onClick={() => setShowDemo(false)}
                    className="mt-2 text-blue-600 hover:text-blue-700 underline text-xs"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email Adresi
              </label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Şifre
              </label>
              <Input
                type="password"
                placeholder="Şifrenizi girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>

          <div className="text-center mt-6">
            <Link href="/" className="text-red-600 hover:text-red-700 text-sm">
              Ana sayfaya dön
            </Link>
          </div>
        </div>

        <p className="text-center text-white text-sm mt-8">
          © 2024 Kariyer Portalı Admin Panel
        </p>
      </div>
    </div>
  );
}
