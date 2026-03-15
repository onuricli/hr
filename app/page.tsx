import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { JobsPreview } from '@/components/jobs-preview';
import { Star, Users, Briefcase, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#D32F2F] to-red-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
                Ekibimize Katıl
              </h1>
              <p className="text-xl text-red-100 mb-8 text-balance">
                Modern, dinamik ve yenilikçi bir şirkette kariyer yap. En iyi yetenekleri arıyoruz.
              </p>
              <Link href="/jobs">
                <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                  Açık Pozisyonları Gör
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="bg-red-500 rounded-2xl h-80 flex items-center justify-center">
                <Users className="w-40 h-40 text-red-400 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Açık Pozisyonlar */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Açık Pozisyonlar</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Ekibimize katılmak için aşağıdaki pozisyonlara göz atın ve sizin için uygun olanı bulun.
          </p>
          <JobsPreview />
          <div className="text-center mt-10">
            <Link href="/jobs">
              <Button variant="outline" className="border-[#D32F2F] text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white">
                Tüm Pozisyonları Gör
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Şirket Avantajları</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Briefcase,
                title: 'Rekabetçi Maaş',
                description: 'Pazar standartlarının üzerinde maaş ve bonus imkanları',
              },
              {
                icon: Users,
                title: 'Ekip Kültürü',
                description: 'İşbirlikçi ve destekleyici bir çalışma ortamı',
              },
              {
                icon: Star,
                title: 'Gelişim Fırsatları',
                description: 'Eğitim ve kariyer gelişim programları',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <Icon className="w-12 h-12 text-red-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Çalışan Yorumları</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Ayşe Yılmaz',
                role: 'Senior Developer',
                comment:
                  'Harika bir takımla çalışmak ve kendimi geliştirmek için sonsuz fırsatlar.',
              },
              {
                name: 'Mehmet Demir',
                role: 'Product Manager',
                comment:
                  'İnovasyona önem veren ve çalışanlarına değer veren bir şirket.',
              },
              {
                name: 'Elif Kaya',
                role: 'Designer',
                comment:
                  'Fikirlerimin dinlendiği ve projelerim üzerinde gerçek etkisi olan bir ortam.',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-xl border border-gray-200"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.comment}</p>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#D32F2F] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Hazır mısın?</h2>
          <p className="text-xl text-red-100 mb-8 text-balance">
            Açık pozisyonlarımızı gözden geçir ve seni uygun olan bir rolde başvur.
          </p>
          <Link href="/jobs">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              Başvuran Ol
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
