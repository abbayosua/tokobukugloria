'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cart';
import { CheckCircle, Copy, Download, Printer, QrCode } from 'lucide-react';

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutModal({ open, onOpenChange }: CheckoutModalProps) {
  const { items, getTotal, clearCart } = useCartStore();
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
  });
  const [orderId, setOrderId] = useState('');

  const total = getTotal();
  const formatPrice = (price: number) => `Rp ${price.toLocaleString('id-ID')}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async () => {
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.shippingAddress) {
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: items.map(item => ({
            bookId: item.bookId,
            quantity: item.quantity,
            price: item.discountPrice || item.price,
          })),
          totalAmount: total,
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setOrderId(data.order.id);
        setStep('payment');
      } else {
        alert('Terjadi kesalahan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = () => {
    clearCart();
    setStep('success');
  };

  const handleClose = () => {
    if (step === 'success') {
      setStep('form');
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        shippingAddress: '',
      });
    }
    onOpenChange(false);
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'form' && 'Checkout'}
            {step === 'payment' && 'Pembayaran QRIS'}
            {step === 'success' && 'Pesanan Berhasil'}
          </DialogTitle>
          <DialogDescription>
            {step === 'form' && 'Lengkapi data pengiriman Anda'}
            {step === 'payment' && 'Scan QR code untuk melakukan pembayaran'}
            {step === 'success' && 'Terima kasih atas pesanan Anda'}
          </DialogDescription>
        </DialogHeader>

        {step === 'form' && (
          <div className="space-y-4">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Ringkasan Pesanan</h4>
              <div className="space-y-2 text-sm">
                {items.map(item => (
                  <div key={item.bookId} className="flex justify-between">
                    <span>{item.title} x{item.quantity}</span>
                    <span>{formatPrice((item.discountPrice || item.price) * item.quantity)}</span>
                  </div>
                ))}
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-blue-700">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Customer Form */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="customerName">Nama Lengkap *</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email *</Label>
                <Input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  placeholder="email@contoh.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">No. WhatsApp *</Label>
                <Input
                  id="customerPhone"
                  name="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  placeholder="08xx-xxxx-xxxx"
                  required
                />
              </div>
              <div>
                <Label htmlFor="shippingAddress">Alamat Pengiriman *</Label>
                <textarea
                  id="shippingAddress"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  placeholder="Alamat lengkap untuk pengiriman"
                  className="w-full min-h-[80px] px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <Button
              className="w-full bg-blue-700 hover:bg-blue-800 text-white h-12"
              onClick={handleSubmitForm}
              disabled={loading || !formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.shippingAddress}
            >
              {loading ? 'Memproses...' : 'Lanjut ke Pembayaran'}
            </Button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-4">
            {/* Order ID */}
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Nomor Pesanan</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg font-bold text-blue-700">{orderId}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyOrderId}>
                  {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Total */}
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Pembayaran</p>
              <p className="text-2xl font-bold text-blue-700">{formatPrice(total)}</p>
            </div>

            {/* QRIS Image */}
            <div className="flex flex-col items-center p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg">
              <QrCode className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-3">Scan QR Code untuk membayar</p>
              <div className="relative w-64 h-64">
                <Image
                  src="/qris.jpeg"
                  alt="QRIS Payment"
                  fill
                  className="object-contain"
                  sizes="256px"
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
              <p className="font-medium mb-1">Petunjuk Pembayaran:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Scan QR Code di atas dengan aplikasi e-wallet atau mobile banking</li>
                <li>Pastikan nominal transfer sesuai dengan total pembayaran</li>
                <li>Setelah transfer, klik tombol &quot;Saya Sudah Bayar&quot; di bawah</li>
                <li>Pesanan akan diproses setelah pembayaran dikonfirmasi</li>
              </ol>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4 mr-2" />
                Cetak
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleConfirmPayment}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Saya Sudah Bayar
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Pesanan Berhasil!</h3>
            <p className="text-gray-600 mb-4">
              Terima kasih telah berbelanja di Toko Buku Gloria
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Nomor Pesanan Anda:</p>
              <p className="text-lg font-bold text-blue-700">{orderId}</p>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Kami akan menghubungi Anda melalui WhatsApp untuk konfirmasi pembayaran dan pengiriman.
            </p>
            <Button
              className="bg-blue-700 hover:bg-blue-800 text-white"
              onClick={handleClose}
            >
              Selesai
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
