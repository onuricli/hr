'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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

interface NewJobFormProps {
  onSuccess: () => void;
}

export function NewJobForm({ onSuccess }: NewJobFormProps) {
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

  const onSubmit = async (data: JobFormData) => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          salaryMin: data.salaryMin || null,
          salaryMax: data.salaryMax || null,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'İş ilanı oluşturulamadı');
      }

      toast.success('İş ilanı başarıyla oluşturuldu!');
      form.reset();
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bir hata oluştu';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pozisyon Adı</FormLabel>
                <FormControl>
                  <Input placeholder="ör: Senior Developer" {...field} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Departman seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Yazılım">Yazılım</SelectItem>
                    <SelectItem value="Tasarım">Tasarım</SelectItem>
                    <SelectItem value="Pazarlama">Pazarlama</SelectItem>
                    <SelectItem value="İnsan Kaynakları">
                      İnsan Kaynakları
                    </SelectItem>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Lokasyon seçin" />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Çalışma tipi seçin" />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seviye seçin" />
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
                    <Input type="number" placeholder="50000" {...field} />
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
                    <Input type="number" placeholder="80000" {...field} />
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
                <Textarea
                  placeholder="Pozisyonun detaylı açıklaması..."
                  className="h-32"
                  {...field}
                />
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
                <Textarea
                  placeholder="Gerekli nitelikler ve beceriler..."
                  className="h-32"
                  {...field}
                />
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
                <Textarea
                  placeholder="Şirket avantajları ve imkanları..."
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {isSubmitting ? 'Oluşturuluyor...' : 'İlanı Yayınla'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
