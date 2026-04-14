'use client';

import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const phoneNumber = '6282323362107'; // Indonesian format without +
  const message = encodeURIComponent('Halo, saya ingin bertanya tentang pembelian grosir');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 group"
    >
      {/* Tooltip text */}
      <div className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-gray-100">
        Chat Admin Untuk Pembelian Grosir
      </div>
      
      {/* WhatsApp button */}
      <div className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
        <MessageCircle className="w-7 h-7 text-white" />
      </div>
    </a>
  );
}
