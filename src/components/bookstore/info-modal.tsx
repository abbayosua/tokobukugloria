'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Store, ShoppingCart, MessageCircle, Truck, RotateCcw, 
  HelpCircle, Mail, Phone, MapPin, Clock, Package, CreditCard,
  CheckCircle, AlertCircle
} from 'lucide-react';

interface InfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pageInfo = {
  'tentang-kami': {
    title: 'Tentang Kami',
    icon: Store,
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 leading-relaxed">
          <strong className="text-gray-900">Toko Buku Gloria</strong> adalah toko buku Kristen yang 
          menyediakan berbagai koleksi buku rohani berkualitas. Kami berkomitmen untuk melayani 
          kebutuhan spiritual masyarakat dengan menyediakan:
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <span>Alkitab dalam berbagai terjemahan dan ukuran</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <span>Buku-buku Katolik dan rohani Kristen</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <span>Renungan harian dan buku devosi</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <span>Buku teologi dan pembinaan iman</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <span>Buku anak-anak dan perlengkapan ibadah</span>
          </li>
        </ul>
        <Separator />
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Visi Kami:</strong> Menjadi toko buku Kristen terpercaya yang mendukung 
            pertumbuhan iman dan spiritualitas masyarakat Indonesia.
          </p>
        </div>
      </div>
    )
  },
  'cara-pemesanan': {
    title: 'Cara Pemesanan',
    icon: ShoppingCart,
    content: (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Pembelian Online (Retail)
          </h4>
          <p className="text-blue-700 text-sm mb-3">
            Anda dapat membeli langsung melalui website kami dengan mudah:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
            <li>Pilih buku yang ingin Anda beli</li>
            <li>Tambahkan ke keranjang belanja</li>
            <li>Lakukan checkout dan isi data pengiriman</li>
            <li>Lakukan pembayaran via QRIS</li>
            <li>Pesanan akan dikirim setelah pembayaran dikonfirmasi</li>
          </ol>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Pembelian Grosir (Banyak)
          </h4>
          <p className="text-green-700 text-sm mb-3">
            Untuk pembelian dalam jumlah besar (grosir), silakan hubungi admin kami via WhatsApp:
          </p>
          <ul className="space-y-2 text-sm text-green-700">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>WhatsApp: <strong>0823-2336-2107</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Dapatkan harga khusus untuk pembelian grosir</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Konsultasi langsung dengan admin kami</span>
            </li>
          </ul>
          <Button 
            className="mt-3 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => window.open('https://wa.me/6282323362107?text=Halo,%20saya%20ingin%20bertanya%20tentang%20pembelian%20grosir', '_blank')}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat WhatsApp Sekarang
          </Button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>
              <strong>Catatan:</strong> Untuk pembelian grosir, admin akan membantu Anda 
              menyelesaikan pesanan dan memberikan penawaran harga terbaik.
            </span>
          </p>
        </div>
      </div>
    )
  },
  'pengiriman': {
    title: 'Pengiriman',
    icon: Truck,
    content: (
      <div className="space-y-4">
        <p className="text-gray-600">
          Kami melayani pengiriman ke seluruh Indonesia melalui berbagai ekspedisi terpercaya.
        </p>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Package className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Jasa Pengiriman</h4>
              <p className="text-sm text-gray-600">JNE, J&T Express, SiCepat, POS Indonesia</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Truck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Waktu Pengiriman</h4>
              <p className="text-sm text-gray-600">1-3 hari untuk area Jabodetabek, 3-7 hari untuk luar kota</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <CreditCard className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Biaya Pengiriman</h4>
              <p className="text-sm text-gray-600">Dihitung otomatis berdasarkan berat dan lokasi tujuan</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="text-sm text-gray-500">
          <p><strong>Proses Pengiriman:</strong></p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Pesanan diproses setelah pembayaran dikonfirmasi</li>
            <li>Kami akan mengemas pesanan dengan aman</li>
            <li>Nomor resi akan dikirimkan via WhatsApp</li>
            <li>Lacak pengiriman Anda melalui website ekspedisi</li>
          </ol>
        </div>
      </div>
    )
  },
  'pengembalian': {
    title: 'Pengembalian',
    icon: RotateCcw,
    content: (
      <div className="space-y-4">
        <p className="text-gray-600">
          Kepuasan pelanggan adalah prioritas kami. Berikut kebijakan pengembalian kami:
        </p>

        <div className="space-y-3">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Dapat Dikembalikan
            </h4>
            <ul className="mt-2 text-sm text-green-700 space-y-1">
              <li>• Produk rusak saat pengiriman</li>
              <li>• Produk tidak sesuai pesanan</li>
              <li>• Produk cacat produksi</li>
            </ul>
          </div>

          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Tidak Dapat Dikembalikan
            </h4>
            <ul className="mt-2 text-sm text-red-700 space-y-1">
              <li>• Produk sudah digunakan</li>
              <li>• Kerusakan akibat kelalaian pembeli</li>
              <li>• Lebih dari 7 hari setelah diterima</li>
            </ul>
          </div>
        </div>

        <Separator />

        <div className="text-sm text-gray-600">
          <p className="font-medium text-gray-900 mb-2">Cara Mengajukan Pengembalian:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Hubungi admin via WhatsApp dalam 7 hari</li>
            <li>Sertakan foto produk dan bukti pembelian</li>
            <li>Tunggu konfirmasi dari admin kami</li>
            <li>Kirim produk kembali ke alamat toko</li>
            <li>Pengembalian dana akan diproses dalam 3-5 hari kerja</li>
          </ol>
        </div>
      </div>
    )
  },
  'faq': {
    title: 'FAQ',
    icon: HelpCircle,
    content: (
      <div className="space-y-4">
        <details className="group border rounded-lg">
          <summary className="flex items-center justify-between cursor-pointer p-4 font-medium">
            Bagaimana cara memesan buku?
            <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="px-4 pb-4 text-sm text-gray-600">
            Pilih buku yang diinginkan, tambahkan ke keranjang, lalu checkout dan bayar via QRIS. 
            Untuk pembelian grosir, hubungi admin via WhatsApp.
          </div>
        </details>

        <details className="group border rounded-lg">
          <summary className="flex items-center justify-between cursor-pointer p-4 font-medium">
            Berapa lama pengiriman?
            <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="px-4 pb-4 text-sm text-gray-600">
            Pengiriman memakan waktu 1-3 hari untuk Jabodetabek dan 3-7 hari untuk luar kota, 
            tergantung lokasi dan ekspedisi yang dipilih.
          </div>
        </details>

        <details className="group border rounded-lg">
          <summary className="flex items-center justify-between cursor-pointer p-4 font-medium">
            Metode pembayaran apa saja yang tersedia?
            <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="px-4 pb-4 text-sm text-gray-600">
            Saat ini kami menerima pembayaran via QRIS yang bisa digunakan dengan semua e-wallet 
            dan mobile banking (GoPay, OVO, DANA, ShopeePay, BCA, Mandiri, BNI, dll).
          </div>
        </details>

        <details className="group border rounded-lg">
          <summary className="flex items-center justify-between cursor-pointer p-4 font-medium">
            Apakah bisa beli grosir?
            <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="px-4 pb-4 text-sm text-gray-600">
            Ya, untuk pembelian dalam jumlah besar, silakan hubungi admin kami via WhatsApp 
            di 0823-2336-2107 untuk mendapatkan harga khusus.
          </div>
        </details>

        <details className="group border rounded-lg">
          <summary className="flex items-center justify-between cursor-pointer p-4 font-medium">
            Bagaimana jika buku rusak saat diterima?
            <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="px-4 pb-4 text-sm text-gray-600">
            Segera hubungi admin dalam 7 hari dengan menyertakan foto produk rusak. 
            Kami akan mengganti atau mengembalikan dana sesuai kebijakan.
          </div>
        </details>
      </div>
    )
  },
  'hubungi-kami': {
    title: 'Hubungi Kami',
    icon: Mail,
    content: (
      <div className="space-y-4">
        <p className="text-gray-600">
          Kami senang dapat membantu Anda. Silakan hubungi kami melalui:
        </p>

        <div className="space-y-3">
          <a 
            href="https://wa.me/6282323362107" 
            target="_blank"
            className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-green-800">WhatsApp</p>
              <p className="text-sm text-green-600">0823-2336-2107</p>
            </div>
          </a>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Telepon</p>
              <p className="text-sm text-gray-600">0823-2336-2107</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Email</p>
              <p className="text-sm text-gray-600">info@tokobukugloria.com</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-800">Alamat Toko</p>
              <p className="text-sm text-gray-600">
                Jalan Laksamana Bintan Ruko Grand California Blok B1 No.10, 
                Taman Baloi, Kec. Batam Kota, Kota Batam, Kepulauan Riau 29444
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <Clock className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-medium text-blue-800">Jam Operasional</p>
            <p className="text-sm text-blue-600">Senin - Sabtu: 9.00 am - 8.00 pm | Minggu: Tutup</p>
          </div>
        </div>
      </div>
    )
  }
};

export function InfoModal({ open, onOpenChange }: InfoModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState<string | null>(null);

  useEffect(() => {
    const page = searchParams.get('page');
    if (page && pageInfo[page as keyof typeof pageInfo]) {
      setCurrentPage(page);
    }
  }, [searchParams]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('page');
      const newUrl = params.toString() ? `/?${params.toString()}` : '/';
      router.push(newUrl, { scroll: false });
      setCurrentPage(null);
    }
    onOpenChange(newOpen);
  };

  const page = currentPage ? pageInfo[currentPage as keyof typeof pageInfo] : null;
  const Icon = page?.icon || HelpCircle;

  if (!page) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Icon className="w-6 h-6 text-blue-700" />
            {page.title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {page.content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
