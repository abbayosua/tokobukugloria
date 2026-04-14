'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cart';
import { Trash2, Plus, Minus, ShoppingBag, X } from 'lucide-react';
import { CheckoutModal } from './checkout-modal';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('cart') === 'open') {
      onOpenChange(true);
    }
  }, [searchParams, onOpenChange]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('cart');
      router.push(`/?${params.toString()}`, { scroll: false });
    }
    onOpenChange(newOpen);
  };

  const handleCheckout = () => {
    handleOpenChange(false);
    setCheckoutOpen(true);
  };

  const total = getTotal();
  const formatPrice = (price: number) => `Rp ${price.toLocaleString('id-ID')}`;

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-700" />
                Keranjang Belanja
              </SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-gray-100 md:hidden"
                onClick={() => handleOpenChange(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <ShoppingBag className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium">Keranjang kosong</p>
              <p className="text-sm">Tambahkan buku ke keranjang untuk melanjutkan</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {items.map((item) => (
                  <div key={item.bookId} className="flex gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="relative w-16 h-20 shrink-0 rounded overflow-hidden">
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.author}</p>
                      <div className="mt-1">
                        {item.discountPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-blue-700 text-sm">
                              {formatPrice(item.discountPrice)}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-semibold text-blue-700 text-sm">
                            {formatPrice(item.price)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.bookId, parseInt(e.target.value) || 0)}
                            className="w-10 h-7 text-center text-sm border-0 p-0"
                            min="1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.bookId)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold text-blue-700">{formatPrice(total)}</span>
                </div>
                <Button 
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white h-12 text-base"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearCart}
                >
                  Kosongkan Keranjang
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutModal open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  );
}
