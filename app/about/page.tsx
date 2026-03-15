import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Target, Heart, Zap, Users, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#D32F2F] to-red-800 text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Hakkımızda
            </h1>
            <p className="text-xl text-red-100 animate-fade-in animation-delay-100">
              Yenilikçi çözümler üreten, yetenekli ekiplerle büyüyen bir şirketiz.
            </p>
          </div>
        </section>

        {/* Misyon & Vizyon */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <Target className="w-12 h-12 text-[#D32F2F] mb-4" />
                <h3 className="text-xl font-semibold mb-3">Misyonumuz</h3>
                <p className="text-gray-600">
                  Müşterilerimize en iyi hizmeti sunarak, çalışanlarımıza anlamlı kariyer fırsatları yaratarak sektörümüzde fark yaratmak.
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <Zap className="w-12 h-12 text-[#D32F2F] mb-4" />
                <h3 className="text-xl font-semibold mb-3">Vizyonumuz</h3>
                <p className="text-gray-600">
                  Türkiye&apos;nin en tercih edilen işveren markalarından biri olmak ve global standartlarda bir çalışma kültürü oluşturmak.
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <Heart className="w-12 h-12 text-[#D32F2F] mb-4" />
                <h3 className="text-xl font-semibold mb-3">Değerlerimiz</h3>
                <p className="text-gray-600">
                  Şeffaflık, ekip çalışması, sürekli gelişim ve çalışan mutluluğu temel değerlerimizdir.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ekip */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Neden Bize Katılmalısınız?</h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
              Dinamik ekibimizle birlikte büyümek ve kariyerinizi bir üst seviyeye taşımak için ideal ortamı sunuyoruz.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Users, label: '50+ Çalışan', desc: 'Büyüyen ekip' },
                { icon: Zap, label: 'Yenilikçi', desc: 'Modern teknolojiler' },
                { icon: Heart, label: 'Esnek Çalışma', desc: 'Work-life balance' },
                { icon: Target, label: 'Büyüme Fırsatı', desc: 'Kariyer gelişimi' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:border-[#D32F2F]/30 hover:shadow-md transition-all"
                  >
                    <Icon className="w-10 h-10 mx-auto text-[#D32F2F] mb-2" />
                    <p className="font-semibold text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ekibimize Katılmak İster misiniz?</h2>
            <p className="text-gray-600 mb-8">
              Açık pozisyonlarımızı inceleyin ve hayalinizdeki işe başvurun.
            </p>
            <Link href="/jobs">
              <Button size="lg" className="bg-[#D32F2F] hover:bg-red-700 text-white">
                Açık Pozisyonları Gör
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
