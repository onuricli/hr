'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer } from '@/components/ui/chart';
import { toast } from 'sonner';
import { LogOut, Plus, FileText, Users, Briefcase } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { AdminJobsList } from '@/components/admin/jobs-list';
import { AdminApplicationsList } from '@/components/admin/applications-list';
import { NewJobForm } from '@/components/admin/new-job-form';

interface DashboardStats {
  totalApplications: number;
  newApplications: number;
  activeJobs: number;
  totalJobs: number;
  statusChart: { status: string; count: number }[];
  recentApplications: { full_name: string; job_title: string; created_at: string }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    newApplications: 0,
    activeJobs: 0,
    totalJobs: 0,
    statusChart: [],
    recentApplications: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showNewJobForm, setShowNewJobForm] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          router.push('/admin/login');
          return;
        }

        const user = await response.json();
        if (user.role !== 'admin') {
          router.push('/');
        }

        // Load stats
        const jobsRes = await fetch('/api/admin/jobs');
        const appsRes = await fetch('/api/admin/applications');

        const jobs = await jobsRes.json();
        const applications = await appsRes.json();

        const statusCounts: Record<string, number> = {};
        applications.forEach((app: { status: string }) => {
          statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
        });
        const statusChart = Object.entries(statusCounts).map(([status, count]) => ({
          status,
          count,
        }));

        setStats({
          totalApplications: applications.length,
          newApplications: applications.filter(
            (app: { status: string }) => app.status === 'Yeni'
          ).length,
          activeJobs: jobs.filter((j: { is_active: boolean }) => j.is_active).length,
          totalJobs: jobs.length,
          statusChart,
          recentApplications: applications.slice(0, 5),
        });
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      toast.error('Çıkış başarısız oldu');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Admin Panel</span>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Çıkış
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Başvuru</p>
                <p className="text-3xl font-bold">{stats.totalApplications}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Yeni Başvurular</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.newApplications}
                </p>
              </div>
              <FileText className="w-12 h-12 text-red-600 opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Aktif İlanlar</p>
                <p className="text-3xl font-bold">{stats.activeJobs}</p>
              </div>
              <Briefcase className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam İlanlar</p>
                <p className="text-3xl font-bold">{stats.totalJobs}</p>
              </div>
              <Briefcase className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Grafikler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Başvurular Duruma Göre</h3>
            {stats.statusChart.length > 0 ? (
              <ChartContainer
                config={{
                  count: { label: 'Adet', color: '#D32F2F' },
                  status: { label: 'Durum' },
                }}
                className="h-[250px]"
              >
                <BarChart data={stats.statusChart}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="status" tickLine={false} />
                  <YAxis />
                  <Bar dataKey="count" fill="#D32F2F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">Henüz başvuru yok</p>
            )}
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Son Başvurular</h3>
            {stats.recentApplications.length > 0 ? (
              <div className="space-y-3">
                {stats.recentApplications.map(
                  (app: { full_name: string; job_title: string; created_at: string }, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{app.full_name}</p>
                        <p className="text-sm text-gray-500">{app.job_title}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(app.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Henüz başvuru yok</p>
            )}
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="jobs">İş İlanları</TabsTrigger>
            <TabsTrigger value="applications">Başvurular</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">İş İlanlarını Yönet</h2>
              <Button
                onClick={() => setShowNewJobForm(!showNewJobForm)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni İlan Ekle
              </Button>
            </div>

            {showNewJobForm && (
              <Card className="p-6">
                <NewJobForm
                  onSuccess={() => {
                    setShowNewJobForm(false);
                    window.location.reload();
                  }}
                />
              </Card>
            )}

            <AdminJobsList />
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <h2 className="text-2xl font-bold">Başvuruları Yönet</h2>
            <AdminApplicationsList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
