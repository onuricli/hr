'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">K</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Kariyer</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/jobs" className="text-gray-700 hover:text-red-600 transition-colors duration-200">
            Açık Pozisyonlar
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-red-600 transition-colors duration-200">
            Hakkımızda
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-red-600 transition-colors duration-200">
            İletişim
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {!isLoading && !user ? (
            <>
              <Link href="/admin/login">
                <Button variant="ghost" className="text-red-600 hover:bg-red-50">
                  Admin Giriş
                </Button>
              </Link>
            </>
          ) : (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50"
            >
              Çıkış
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
