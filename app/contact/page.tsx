'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '', // Honeypot
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Spam check - honeypot
    if (formData.website) {
      toast.success('Mesajınız alındı. En kısa sürede size dönüş yapacağız.');
      return;
    }
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Lütfen zorunlu alanları doldurun.');
      return;
    }
    setIsSubmitting(true);
    try {
      // Simulate form submission - integrate with your backend
      await new Promise((r) => setTimeout(r, 1000));
      toast.success('Mesajınız alındı. En kısa sürede size dönüş yapacağız.');
      setFormData({ name: '', email: '', subject: '', message: '', website: '' });
    } catch {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#D32F2F] to-red-800 text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">İletişim</h1>
            <p className="text-xl text-red-100">
              Sorularınız için bize ulaşın. En kısa sürede yanıt vereceğiz.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 -mt-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <Mail className="w-10 h-10 text-[#D32F2F] mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">E-posta</h3>
                  <a
                    href="mailto:kariyer@ornek.com"
                    className="text-gray-600 hover:text-[#D32F2F] transition"
                  >
                    kariyer@ornek.com
                  </a>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <Phone className="w-10 h-10 text-[#D32F2F] mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Telefon</h3>
                  <a
                    href="tel:+902125555555"
                    className="text-gray-600 hover:text-[#D32F2F] transition"
                  >
                    +90 (212) 555-5555
                  </a>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <MapPin className="w-10 h-10 text-[#D32F2F] mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Adres</h3>
                  <p className="text-gray-600">
                    Levent, Büyükdere Cad. No:123
                    <br />
                    Şişli, İstanbul
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                  <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="w-8 h-8 text-[#D32F2F]" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Bize Yazın
                    </h2>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ad Soyad *
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Adınız Soyadınız"
                          required
                          className="bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          E-posta *
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="email@ornek.com"
                          required
                          className="bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Konu
                      </label>
                      <Input
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        placeholder="Mesaj konusu"
                        className="bg-white"
                      />
                    </div>
                    <div className="hidden" aria-hidden="true">
                      <label>Web sitesi</label>
                      <Input
                        value={formData.website}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mesajınız *
                      </label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Mesajınızı yazın..."
                        rows={5}
                        required
                        className="bg-white"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#D32F2F] hover:bg-red-700 text-white w-full md:w-auto"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
