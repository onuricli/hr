'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Download, Eye, Search, FileDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  status: string;
  job_title: string;
  created_at: string;
  cv_file_url: string;
}

const statusColors: Record<string, string> = {
  'Yeni': 'bg-blue-100 text-blue-800',
  'İnceleniyor': 'bg-yellow-100 text-yellow-800',
  'Mülakata çağrıldı': 'bg-purple-100 text-purple-800',
  'Olumlu': 'bg-green-100 text-green-800',
  'Olumsuz': 'bg-red-100 text-red-800',
};

export function AdminApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus) params.set('status', selectedStatus);
      if (searchQuery) params.set('search', searchQuery);
      const url = `/api/admin/applications${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      toast.error('Başvurular yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [selectedStatus, searchQuery]);

  const handleSearch = () => setSearchQuery(searchInput);
  const handleExport = () => {
    window.open('/api/admin/applications/export', '_blank');
    toast.success('Excel dosyası indiriliyor');
  };

  const handleStatusChange = async (
    applicationId: string,
    newStatus: string
  ) => {
    try {
      const response = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          status: newStatus,
        }),
      });

      if (!response.ok) throw new Error('Başarısız');

      toast.success('Başvuru durumu güncellendi');
      fetchApplications();
    } catch (error) {
      toast.error('Güncelleme başarısız oldu');
    }
  };

  if (isLoading) {
    return <p className="text-gray-600">Yükleniyor...</p>;
  }

  const filteredApplications = applications;

  if (filteredApplications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Başvuru bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Ad, email veya anahtar kelime ile ara..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch} variant="secondary">
            Ara
          </Button>
        </div>
        <div className="flex gap-2">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tümü</SelectItem>
              <SelectItem value="Yeni">Yeni</SelectItem>
              <SelectItem value="İnceleniyor">İnceleniyor</SelectItem>
              <SelectItem value="Mülakata çağrıldı">Mülakata çağrıldı</SelectItem>
              <SelectItem value="Olumlu">Olumlu</SelectItem>
              <SelectItem value="Olumsuz">Olumsuz</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} variant="outline" size="sm">
            <FileDown className="w-4 h-4 mr-2" />
            Excel
          </Button>
        </div>
      </div>

      {filteredApplications.map((app) => (
        <Card key={app.id} className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">{app.full_name}</h3>
                <Badge className={statusColors[app.status] || 'bg-gray-100'}>
                  {app.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">{app.email}</p>
              <p className="text-sm text-gray-600 mb-2">{app.phone}</p>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Pozisyon: {app.job_title}
              </p>
              <p className="text-xs text-gray-500">
                {format(new Date(app.created_at), 'd MMMM yyyy HH:mm', {
                  locale: tr,
                })}
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Select
                defaultValue={app.status}
                onValueChange={(value) =>
                  handleStatusChange(app.id, value)
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yeni">Yeni</SelectItem>
                  <SelectItem value="İnceleniyor">İnceleniyor</SelectItem>
                  <SelectItem value="Mülakata çağrıldı">
                    Mülakata çağrıldı
                  </SelectItem>
                  <SelectItem value="Olumlu">Olumlu</SelectItem>
                  <SelectItem value="Olumsuz">Olumsuz</SelectItem>
                </SelectContent>
              </Select>

              {app.cv_file_url && (
                <a href={app.cv_file_url} download>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    CV İndir
                  </Button>
                </a>
              )}

              <Link href={`/admin/applications/${app.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Detaylar
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
