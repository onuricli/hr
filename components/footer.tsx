import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Şirket</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition">Hakkımızda</Link></li>
              <li><Link href="/jobs" className="hover:text-white transition">Kariyer</Link></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Hukuki</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Gizlilik</a></li>
              <li><a href="#" className="hover:text-white transition">Şartlar</a></li>
              <li><a href="#" className="hover:text-white transition">Çerezler</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Sosyal Medya</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition">Instagram</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">İletişim</h3>
            <p className="text-sm mb-2">Email: kariyer@ornek.com</p>
            <p className="text-sm">Telefon: +90 (212) 555-5555</p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; {currentYear} Kariyer Portalı. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
