'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, ChevronRight } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  job_type: string;
  description: string;
  published_at: string;
}

export function JobsPreview() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => {
        setJobs(Array.isArray(data) ? data.slice(0, 6) : []);
      })
      .catch(() => setJobs([]))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-50 rounded-xl p-6 animate-pulse h-48"
          />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <p className="text-gray-600 text-center py-12">
        Şu anda açık pozisyon bulunmuyor.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <Link
          key={job.id}
          href={`/jobs/${job.id}`}
          className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-[#D32F2F]/30 hover:shadow-lg transition-all duration-300"
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#D32F2F] transition-colors mb-2">
            {job.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4">{job.department}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {job.job_type}
            </span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {job.description}
          </p>
          <span className="text-[#D32F2F] font-medium text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Başvur
            <ChevronRight className="w-4 h-4" />
          </span>
        </Link>
      ))}
    </div>
  );
}
