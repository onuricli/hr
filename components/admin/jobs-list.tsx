'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EditJobDialog } from '@/components/admin/edit-job-dialog';
import { toast } from 'sonner';
import { Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  job_type: string;
  is_active: boolean;
  published_at: string;
}

export function AdminJobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editJobId, setEditJobId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      toast.error('İş ilanları yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (jobId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) throw new Error('Başarısız');

      toast.success(
        !isActive ? 'İlan yayınlandı' : 'İlan pasif hale getirildi'
      );
      fetchJobs();
    } catch (error) {
      toast.error('İşlem başarısız oldu');
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;

    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Başarısız');

      toast.success('İlan silindi');
      fetchJobs();
    } catch (error) {
      toast.error('Silme işlemi başarısız oldu');
    }
  };

  if (isLoading) {
    return <p className="text-gray-600">Yükleniyor...</p>;
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Henüz iş ilanı eklenmemiş</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <EditJobDialog
        jobId={editJobId}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={fetchJobs}
      />
      {jobs.map((job) => (
        <Card key={job.id} className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <Badge variant={job.is_active ? 'default' : 'secondary'}>
                  {job.is_active ? 'Aktif' : 'Pasif'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {job.department} • {job.location} • {job.job_type}
              </p>
              <p className="text-xs text-gray-500">
                {format(new Date(job.published_at), 'd MMMM yyyy HH:mm', {
                  locale: tr,
                })}
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditJobId(job.id);
                  setEditOpen(true);
                }}
              >
                <Edit className="w-4 h-4 mr-1" />
                Düzenle
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleStatus(job.id, job.is_active)}
              >
                <Eye className="w-4 h-4 mr-1" />
                {job.is_active ? 'Kapat' : 'Aç'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(job.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Sil
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
