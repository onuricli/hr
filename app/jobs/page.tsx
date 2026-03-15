'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Briefcase, Clock, ChevronRight } from 'lucide-react';
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
  published_at: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        const data = await response.json();
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (selectedDepartment && selectedDepartment !== 'all') {
      filtered = filtered.filter((job) => job.department === selectedDepartment);
    }
    if (selectedLocation && selectedLocation !== 'all') {
      filtered = filtered.filter((job) => job.location === selectedLocation);
    }
    if (selectedJobType && selectedJobType !== 'all') {
      filtered = filtered.filter((job) => job.job_type === selectedJobType);
    }
    if (selectedExperience && selectedExperience !== 'all') {
      filtered = filtered.filter(
        (job) => job.experience_level === selectedExperience
      );
    }

    setFilteredJobs(filtered);
  }, [
    selectedDepartment,
    selectedLocation,
    selectedJobType,
    selectedExperience,
    jobs,
  ]);

  // Get unique values for dropdowns
  const departments = [...new Set(jobs.map((j) => j.department))];
  const locations = [...new Set(jobs.map((j) => j.location))];
  const jobTypes = [...new Set(jobs.map((j) => j.job_type))];
  const experienceLevels = [...new Set(jobs.map((j) => j.experience_level))];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Açık Pozisyonlar</h1>
        <p className="text-gray-600 mb-8">
          {filteredJobs.length} pozisyon bulundu
        </p>

        {/* Filters */}
        <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-200">
          <h2 className="font-semibold mb-4 text-gray-900">Filtrele</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Departman" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Şehir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedJobType} onValueChange={setSelectedJobType}>
              <SelectTrigger>
                <SelectValue placeholder="Çalışma Tipi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="Full Time">Full Time</SelectItem>
                <SelectItem value="Part Time">Part Time</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedExperience}
              onValueChange={setSelectedExperience}
            >
              <SelectTrigger>
                <SelectValue placeholder="Deneyim" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="Yeni">Yeni</SelectItem>
                <SelectItem value="Orta">Orta</SelectItem>
                <SelectItem value="Kıdemli">Kıdemli</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Jobs List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Uygun pozisyon bulunamadı.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="p-6 hover:shadow-lg transition border border-gray-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Link href={`/jobs/${job.id}`}>
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-red-600 transition">
                        {job.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mb-4">{job.department}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.job_type}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {format(new Date(job.published_at), 'd MMM', {
                          locale: tr,
                        })}
                      </div>
                    </div>

                    <p className="text-gray-600 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <Link href={`/jobs/${job.id}`}>
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      Başvur
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
