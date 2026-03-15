'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const jobSchema = z.object({
  title: z.string().min(3, 'Pozisyon adı en az 3 karakter'),
  department: z.string().min(1, 'Departman seçin'),
  location: z.string().min(1, 'Lokasyon seçin'),
  jobType: z.string().min(1, 'Çalışma tipi seçin'),
  experienceLevel: z.string().min(1, 'Deneyim seviyesi seçin'),
  description: z.string().min(50, 'Açıklama en az 50 karakter'),
  requirements: z.string().min(50, 'Nitelikler en az 50 karakter'),
  benefits: z.string().min(50, 'İmkanlar en az 50 karakter'),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

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
}

interface EditJobDialogProps {
  jobId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditJobDialog({ jobId, open, onOpenChange, onSuccess }: EditJobDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      department: '',
      location: '',
      jobType: '',
      experienceLevel: '',
      description: '',
      requirements: '',
      benefits: '',
    },
  });

  useEffect(() => {
    if (jobId && open) {
      setIsLoading(true);
      fetch(`/api/admin/jobs/${jobId}`)
        .then((res) => res.json())
        .then((job: Job) => {
          form.reset({
            title: job.title,
            department: job.department,
            location: job.location,
            jobType: job.job_type,
            experienceLevel: job.experience_level,
            description: job.description,
            requirements: job.requirements,
            benefits: job.benefits,
            salaryMin: job.salary_min ?? undefined,
            salaryMax: job.salary_max ?? undefined,
          });
        })
        .catch(() => toast.error('İlan yüklenemedi'))
        .finally(() => setIsLoading(false));
    }
  }, [jobId, open, form]);

  const onSubmit = async (data: JobFormData) => {
    if (!jobId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          salaryMin: data.salaryMin || null,
          salaryMax: data.salaryMax || null,
        }),
      });
      if (!res.ok) throw new Error('Güncellenemedi');
      toast.success('İlan güncellendi');
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error('Güncelleme başarısız');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>İlanı Düzenle</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <p className="py-8 text-center text-gray-500">Yükleniyor...</p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pozisyon Adı</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departman</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Departman" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Yazılım">Yazılım</SelectItem>
                          <SelectItem value="Tasarım">Tasarım</SelectItem>
                          <SelectItem value="Pazarlama">Pazarlama</SelectItem>
                          <SelectItem value="İnsan Kaynakları">İnsan Kaynakları</SelectItem>
                          <SelectItem value="Satış">Satış</SelectItem>
                          <SelectItem value="Finans">Finans</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lokasyon</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Lokasyon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="İstanbul">İstanbul</SelectItem>
                          <SelectItem value="Ankara">Ankara</SelectItem>
                          <SelectItem value="İzmir">İzmir</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Çalışma Tipi</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Çalışma tipi" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Full Time">Full Time</SelectItem>
                          <SelectItem value="Part Time">Part Time</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deneyim Seviyesi</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seviye" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Yeni">Yeni</SelectItem>
                          <SelectItem value="Orta">Orta</SelectItem>
                          <SelectItem value="Kıdemli">Kıdemli</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="salaryMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Maaş (TL)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salaryMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Maaş (TL)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İş Tanımı</FormLabel>
                    <FormControl>
                      <Textarea className="h-24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aranan Nitelikler</FormLabel>
                    <FormControl>
                      <Textarea className="h-24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="benefits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sunulan İmkanlar</FormLabel>
                    <FormControl>
                      <Textarea className="h-24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#D32F2F] hover:bg-red-700"
                >
                  {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
