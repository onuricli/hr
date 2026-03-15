'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Download,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  ExternalLink,
  Plus,
  Send,
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ApplicationDetail {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  city: string;
  education: string;
  experience_years: number;
  cover_letter: string;
  linkedin_url: string;
  portfolio_url: string;
  cv_file_url: string;
  cv_file_name: string;
  status: string;
  notes: string;
  interview_date: string | null;
  interview_notes: string | null;
  job_title: string;
  department: string;
  created_at: string;
  admin_notes?: { id: string; note: string; created_at: string; full_name?: string }[];
}

const statusColors: Record<string, string> = {
  Yeni: 'bg-blue-100 text-blue-800',
  İnceleniyor: 'bg-yellow-100 text-yellow-800',
  'Mülakata çağrıldı': 'bg-purple-100 text-purple-800',
  Olumlu: 'bg-green-100 text-green-800',
  Olumsuz: 'bg-red-100 text-red-800',
};

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/admin/login');
          return;
        }
        const user = await res.json();
        if (user.role !== 'admin') {
          router.push('/');
          return;
        }
      } catch {
        router.push('/admin/login');
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/applications/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Bulunamadı');
        return res.json();
      })
      .then((data) => {
        setApp(data);
        setStatus(data.status);
        setNotes(data.notes || '');
        setInterviewDate(data.interview_date ? data.interview_date.slice(0, 16) : '');
        setInterviewNotes(data.interview_notes || '');
      })
      .catch(() => {
        toast.error('Başvuru yüklenemedi');
        router.push('/admin/dashboard');
      })
      .finally(() => setIsLoading(false));
  }, [id, router]);

  const handleUpdate = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          notes,
          interview_date: interviewDate || null,
          interview_notes: interviewNotes || null,
        }),
      });
      if (!res.ok) throw new Error('Güncellenemedi');
      toast.success('Güncellendi');
      setApp((prev) => prev ? { ...prev, status, notes, interview_date: interviewDate, interview_notes: interviewNotes } : null);
    } catch {
      toast.error('Güncelleme başarısız');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!id || !newNote.trim()) return;
    try {
      const res = await fetch(`/api/admin/applications/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNote.trim() }),
      });
      if (!res.ok) throw new Error('Eklenemedi');
      toast.success('Not eklendi');
      setNewNote('');
      const data = await fetch(`/api/admin/applications/${id}`).then((r) => r.json());
      setApp(data);
    } catch {
      toast.error('Not eklenemedi');
    }
  };

  if (isLoading || !app) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Aday Detayı</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{app.full_name}</h2>
              <p className="text-gray-600">{app.job_title} • {app.department}</p>
              <Badge className={`mt-2 ${statusColors[app.status] || 'bg-gray-100'}`}>
                {app.status}
              </Badge>
            </div>
            <div className="flex gap-2">
              {app.cv_file_url && (
                <a href={app.cv_file_url} target="_blank" rel="noopener noreferrer" download>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    CV İndir
                  </Button>
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <a href={`mailto:${app.email}`} className="text-[#D32F2F] hover:underline">
                {app.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <a href={`tel:${app.phone}`} className="text-gray-700">
                {app.phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{app.city}</span>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span>{app.education} • {app.experience_years} yıl deneyim</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>
                Başvuru: {format(new Date(app.created_at), 'd MMMM yyyy HH:mm', { locale: tr })}
              </span>
            </div>
            {app.linkedin_url && (
              <a
                href={app.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#D32F2F] hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                LinkedIn
              </a>
            )}
            {app.portfolio_url && (
              <a
                href={app.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#D32F2F] hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Portföy
              </a>
            )}
          </div>

          {app.cover_letter && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" />
                Ön Yazı
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">{app.cover_letter}</p>
            </div>
          )}
        </Card>

        {/* Durum ve Notlar */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Durum ve Notlar</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yeni">Yeni</SelectItem>
                  <SelectItem value="İnceleniyor">İnceleniyor</SelectItem>
                  <SelectItem value="Mülakata çağrıldı">Mülakata çağrıldı</SelectItem>
                  <SelectItem value="Olumlu">Olumlu</SelectItem>
                  <SelectItem value="Olumsuz">Olumsuz</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genel Notlar</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Aday hakkında notlar..."
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mülakat Tarihi</label>
              <Input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mülakat Notları</label>
              <Textarea
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
                placeholder="Mülakat değerlendirmesi..."
                rows={3}
              />
            </div>
            <Button
              onClick={handleUpdate}
              disabled={isSaving}
              className="bg-[#D32F2F] hover:bg-red-700 text-white"
            >
              {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </Card>

        {/* Admin Notları */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Ek Notlar</h3>
          <div className="flex gap-2 mb-4">
            <Input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Yeni not ekle..."
              onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
            />
            <Button
              onClick={handleAddNote}
              disabled={!newNote.trim()}
              size="sm"
              className="bg-[#D32F2F] hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Ekle
            </Button>
          </div>
          {Array.isArray(app.admin_notes) && app.admin_notes.length > 0 ? (
            <div className="space-y-3">
              {app.admin_notes.map((n: { id: string; note: string; created_at: string; full_name?: string }) => (
                <div
                  key={n.id}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                >
                  <p className="text-gray-800">{n.note}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {n.full_name} • {format(new Date(n.created_at), 'd MMM yyyy HH:mm', { locale: tr })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Henüz not eklenmemiş.</p>
          )}
        </Card>
      </main>
    </div>
  );
}
