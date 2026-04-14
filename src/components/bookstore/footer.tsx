import Link from 'next/link';
import { Book, Mail, Phone, MapPin, Facebook, Instagram, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Toko Buku Gloria</h3>
                <p className="text-xs text-gray-400">Toko Buku Kristen</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Toko buku Kristen terlengkap dengan koleksi Alkitab, buku Katolik, 
              renungan harian, teologi, dan perlengkapan ibadah. Melayani dengan 
              kasih dan dedikasi untuk memenuhi kebutuhan rohani Anda.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kategori</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/?category=alkitab" className="hover:text-blue-400 transition-colors">Alkitab</Link></li>
              <li><Link href="/?category=buku-katolik" className="hover:text-blue-400 transition-colors">Buku Katolik</Link></li>
              <li><Link href="/?category=renungan" className="hover:text-blue-400 transition-colors">Renungan</Link></li>
              <li><Link href="/?category=teologi" className="hover:text-blue-400 transition-colors">Teologi</Link></li>
              <li><Link href="/?category=kids" className="hover:text-blue-400 transition-colors">Anak-Anak</Link></li>
              <li><Link href="/?category=musik-pujian" className="hover:text-blue-400 transition-colors">Musik & Pujian</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Tentang Kami</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Cara Pemesanan</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Pengiriman</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Pengembalian</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hubungi Kami</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
                <span>Jalan Laksamana Bintan Ruko Grand California Blok B1 No.10, Taman Baloi, Kec. Batam Kota, Kota Batam, Kepulauan Riau 29444</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-blue-400" />
                <span>0823-2336-2107</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-blue-400" />
                <span>info@tokobukugloria.com</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                <Clock className="w-3 h-3" />
                Jam Operasional:
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Selasa - Sabtu</span>
                  <span className="text-white">9.00 am - 8.00 pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Senday</span>
                  <span className="text-white">9.00 am - 8.00 pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Minggu</span>
                  <span className="text-red-400">Tutup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-gray-500">
            <p>© 2024 Toko Buku Gloria. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-gray-300 transition-colors">Kebijakan Privasi</Link>
              <Link href="#" className="hover:text-gray-300 transition-colors">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
