'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ApplicationForm } from '@/components/application-form';
import { MapPin, Briefcase, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  job_type: string;
  experience_level: string;
  description: string;
  requirements: string;
  benefits: string;
  salary_min?: number;
  salary_max?: number;
  published_at: string;
}

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${resolvedParams.id}`);
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [resolvedParams]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Yükleniyor...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">İş ilanı bulunamadı</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        {/* Job Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{job.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{job.department}</p>

          <div className="flex flex-wrap gap-6 mb-8 text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              {job.location}
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-red-600" />
              {job.job_type}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600" />
              {format(new Date(job.published_at), 'd MMMM yyyy', {
                locale: tr,
              })}
            </div>
            {job.salary_min && job.salary_max && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-red-600" />
                {job.salary_min.toLocaleString('tr-TR')} -{' '}
                {job.salary_max.toLocaleString('tr-TR')} TL
              </div>
            )}
          </div>

          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {showForm ? 'Formu Kapat' : 'Başvur'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">İş Tanımı</h2>
              <div className="text-gray-700 whitespace-pre-wrap">
                {job.description}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Aranan Nitelikler</h2>
              <div className="text-gray-700 whitespace-pre-wrap">
                {job.requirements}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Sunulan İmkanlar</h2>
              <div className="text-gray-700 whitespace-pre-wrap">
                {job.benefits}
              </div>
            </section>
          </div>

          {/* Application Form Sidebar */}
          {showForm && (
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 sticky top-20">
                <h3 className="text-xl font-semibold mb-6">Başvur</h3>
                <ApplicationForm jobId={job.id} jobTitle={job.title} />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
