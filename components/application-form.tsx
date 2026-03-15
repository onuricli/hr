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
import { Upload, AlertCircle } from 'lucide-react';

const applicationSchema = z.object({
  fullName: z.string().min(3, 'Ad soyad en az 3 karakter olmalıdır'),
  email: z.string().email('Geçerli bir email adresi girin'),
  phone: z.string().min(10, 'Telefon numarası en az 10 karakter olmalıdır'),
  birthDate: z.string().min(1, 'Doğum tarihi seçin'),
  city: z.string().min(2, 'Şehir seçin'),
  education: z.string().min(1, 'Eğitim durumu seçin'),
  experienceYears: z.coerce.number().min(0, 'Geçerli bir değer girin'),
  coverLetter: z.string().min(50, 'Ön yazı en az 50 karakter olmalıdır'),
  linkedinUrl: z.string().url('Geçerli bir URL girin').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Geçerli bir URL girin').optional().or(z.literal('')),
  cvFile: z.any()
    .refine((val) => val && val.length > 0, { message: 'CV yüklemeniz zorunludur' })
    .refine((val) => val[0]?.size <= 5242880, {
      message: 'Dosya boyutu 5MB\'dan küçük olmalıdır',
    })
    .refine(
      (val) =>
        ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(
          val[0]?.type || ''
        ),
      { message: 'Sadece PDF veya DOC/DOCX dosyaları kabul edilir' }
    ),
  website: z.string().max(0).optional(), // Honeypot - spam koruması
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  jobId: string;
  jobTitle: string;
}

export function ApplicationForm({ jobId, jobTitle }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFileName, setCvFileName] = useState<string | null>(null);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      birthDate: '',
      city: '',
      education: '',
      experienceYears: 0,
      coverLetter: '',
      linkedinUrl: '',
      portfolioUrl: '',
      website: '',
    },
  });

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('jobId', jobId);
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('birthDate', data.birthDate);
      formData.append('city', data.city);
      formData.append('education', data.education);
      formData.append('experienceYears', data.experienceYears.toString());
      formData.append('coverLetter', data.coverLetter);
      formData.append('linkedinUrl', data.linkedinUrl || '');
      formData.append('portfolioUrl', data.portfolioUrl || '');
      if (data.website) formData.append('website', data.website);

      if (data.cvFile && data.cvFile.length > 0) {
        formData.append('cvFile', data.cvFile[0]);
      }

      const response = await fetch('/api/applications', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Başvuru gönderilemedi');
      }

      toast.success('Başvurunuz başarıyla gönderildi!');
      form.reset();
      setCvFileName(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bir hata oluştu';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad Soyad</FormLabel>
              <FormControl>
                <Input placeholder="Adınız ve soyadınız" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email adresiniz" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+90 (5XX) XXX XXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doğum Tarihi</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Şehir</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Şehir seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="İstanbul">İstanbul</SelectItem>
                  <SelectItem value="Ankara">Ankara</SelectItem>
                  <SelectItem value="İzmir">İzmir</SelectItem>
                  <SelectItem value="Gaziantep">Gaziantep</SelectItem>
                  <SelectItem value="Antalya">Antalya</SelectItem>
                  <SelectItem value="Bursa">Bursa</SelectItem>
                  <SelectItem value="Adana">Adana</SelectItem>
                  <SelectItem value="Konya">Konya</SelectItem>
                  <SelectItem value="Kayseri">Kayseri</SelectItem>
                  <SelectItem value="Sakarya">Sakarya</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Eğitim Durumu</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Eğitim durumu seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Lisans">Lisans</SelectItem>
                  <SelectItem value="Yüksek Lisans">Yüksek Lisans</SelectItem>
                  <SelectItem value="Doktora">Doktora</SelectItem>
                  <SelectItem value="Ön Lisans">Ön Lisans</SelectItem>
                  <SelectItem value="Ortaöğretim">Ortaöğretim</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experienceYears"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deneyim Yılı</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ön Yazı</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Neden bu pozisyon için uygun olduğunuzu anlatin..."
                  className="h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cvFile"
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <FormLabel>CV (PDF/DOC)</FormLabel>
              <FormControl>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-600 transition cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      onChange(e.target.files);
                      if (e.target.files && e.target.files[0]) {
                        setCvFileName(e.target.files[0].name);
                      }
                    }}
                    className="hidden"
                    id="cv-file"
                  />
                  <label htmlFor="cv-file" className="cursor-pointer block">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {cvFileName
                        ? `${cvFileName} seçildi`
                        : 'Dosya yüklemek için tıklayın'}
                    </span>
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkedinUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn Profili (İsteğe Bağlı)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://linkedin.com/in/..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="portfolioUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portföy Linki (İsteğe Bağlı)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Honeypot - spam koruması */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} tabIndex={-1} autoComplete="off" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Tüm alanları doldurunuz. Eksik bilgiler başvurunuzu geciktirmeyi
            engellemek için tamlık kontrol edilir.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          {isSubmitting ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
        </Button>
      </form>
    </Form>
  );
}
