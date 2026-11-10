import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PlusIcon, MinusIcon, ShoppingCartIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../LanguageContext';

interface OrderState {
  [key: string]: number;
}

const RestaurantMenu: React.FC = () => {
  const { t } = useTranslation();
  const [order, setOrder] = useState<OrderState>({});
  const [showRoomSelection, setShowRoomSelection] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const rooms = [
    ...Array.from({ length: 7 }, (_, i) => (1102 + i).toString()),
    ...Array.from({ length: 20 }, (_, i) => (1201 + i).toString()),
    ...Array.from({ length: 8 }, (_, i) => (1301 + i).toString()),
  ];

  const categories = [
    {
      title: t('breakfast_items'),
      emoji: "🥣",
      items: [
        { name: t('foul'), price: 13, priceText: `13 ${t('sar')}` },
        { name: t('shakshuka'), price: 13, priceText: `13 ${t('sar')}` },
        { name: t('egg_toast'), price: 12, priceText: `12 ${t('sar')}` },
        { name: t('egg_samoli'), price: 7, priceText: `7 ${t('sar')}` },
        { name: t('cheese_samoli'), price: 5, priceText: `5 ${t('sar')}` },
        { name: t('cheese_jam_toast'), price: 6, priceText: `6 ${t('sar')}` }
      ]
    },
    {
      title: t('breakfast_plates'),
      emoji: "🍱",
      items: [
        { name: t('saudi_breakfast'), price: 20, priceText: `20 ${t('sar')}`, description: t('saudi_breakfast_desc') },
        { name: t('oriental_breakfast'), price: 35, priceText: `35 ${t('sar')}`, description: t('oriental_breakfast_desc') },
        { name: t('royal_breakfast'), price: 50, priceText: `50 ${t('sar')}`, description: t('royal_breakfast_desc') }
      ]
    },
    {
      title: t('hot_drinks'),
      emoji: "☕",
      items: [
        { name: t('saudi_coffee'), price: 25, priceText: `25 ${t('sar')}` },
        { name: t('latte_macchiato'), price: 15, priceText: `15 ${t('sar')}` },
        { name: t('cappuccino'), price: 14, priceText: `14 ${t('sar')}` },
        { name: t('espresso'), price: 7, priceText: `7 ${t('sar')}` },
        { name: t('coffee'), price: 11, priceText: `11 ${t('sar')}` },
        { name: t('long_coffee'), price: 13, priceText: `13 ${t('sar')}` },
        { name: t('tea'), price: 3, priceText: `3 ${t('sar')}` },
        { name: t('milk_tea'), price: 4, priceText: `4 ${t('sar')}` }
      ]
    },
    {
      title: t('cold_drinks'),
      emoji: "🥤",
      items: [
        { name: t('pepsi'), price: 4, priceText: `4 ${t('sar')}` },
        { name: t('mirinda'), price: 4, priceText: `4 ${t('sar')}` },
        { name: t('water'), price: 1, priceText: `1 ${t('sar')}` },
        { name: t('sun_top'), price: 4, priceText: `4 ${t('sar')}` }
      ]
    }
  ];

  const updateQuantity = (name: string, delta: number) => {
    setOrder(prev => {
      const current = prev[name] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name]: next };
    });
  };

  const calculateTotal = () => {
    let total = 0;
    categories.forEach(cat => {
      cat.items.forEach(item => {
        if (order[item.name]) {
          total += item.price * order[item.name];
        }
      });
    });
    return total;
  };

  const finalizeOrder = (roomNumber: string) => {
    const items = [];
    categories.forEach(cat => {
      cat.items.forEach(item => {
        if (order[item.name]) {
          items.push(`- ${item.name} (العدد: ${order[item.name]})`);
        }
      });
    });

    const total = calculateTotal();
    const message = `مرحباً مطعم فندق تيم، أود طلب التالي:\n\n${items.join('\n')}\n\nإجمالي الحساب: ${total} ${t('sar')}\nرقم الغرفة: ${roomNumber}`;
    const encodedMessage = encodeURIComponent(message);
    window.location.href = `https://wa.me/966599410597?text=${encodedMessage}`;
    setShowRoomSelection(false);
  };

  const totalItems = (Object.values(order) as number[]).reduce((a, b) => a + b, 0);

  const floatingUI = mounted && (
    <>
      {/* Floating Order Bar - Positioned comfortably above bottom contact bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-[115px] sm:bottom-[130px] left-0 right-0 flex justify-center z-[60] px-4 animate-slide-up">
          <button 
            onClick={() => setShowRoomSelection(true)}
            className="w-full max-w-md bg-white/95 backdrop-blur-md text-hotel-charcoal rounded-2xl sm:rounded-[1.8rem] p-3.5 sm:p-4 font-black flex items-center justify-between shadow-[0_10px_35px_rgba(0,0,0,0.12)] border-2 border-hotel-peach hover:scale-[1.02] transition-all active:scale-95"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="bg-hotel-peach text-hotel-charcoal p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-xs border border-hotel-peach/60">
                <ShoppingCartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-start">
                <span className="text-base sm:text-lg block leading-none text-hotel-charcoal">{t('order_now')}</span>
                <span className="text-xs text-hotel-charcoal/70 font-bold">{totalItems} {t('item_unit')}</span>
              </div>
            </div>
            <div className="bg-hotel-peachLight px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl border border-hotel-peach/50 flex flex-col items-center">
              <span className="text-[9px] sm:text-[10px] text-hotel-charcoal/70 font-bold uppercase">{t('total')}</span>
              <span className="text-base sm:text-xl text-hotel-charcoal font-black leading-none">{calculateTotal()} {t('sar')}</span>
            </div>
          </button>
        </div>
      )}

      {/* Room Selection Modal */}
      {showRoomSelection && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4">
          <div 
            className="absolute inset-0 bg-hotel-charcoal/60 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setShowRoomSelection(false)} 
          />
          
          <div className="relative bg-hotel-cream w-full max-w-sm sm:max-w-md rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden animate-slide-up border border-hotel-peach/40 max-h-[90vh] flex flex-col">
            <div className="bg-hotel-peachLight p-6 sm:p-8 text-hotel-charcoal text-center relative shrink-0">
              <button 
                onClick={() => setShowRoomSelection(false)} 
                className="absolute top-4 sm:top-6 left-4 sm:left-6 w-9 h-9 sm:w-10 sm:h-10 bg-hotel-cream rounded-full flex items-center justify-center hover:bg-hotel-peach transition-all shadow-md active:scale-90"
                aria-label="Close"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-hotel-cream rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md border-2 border-hotel-peach/30">
                <CheckCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-hotel-charcoal" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-1">{t('welcome_guest')}</h3>
              <p className="text-hotel-grey font-bold text-xs sm:text-sm">{t('select_room')}</p>
            </div>
            
            <div className="p-4 sm:p-6 bg-hotel-cream overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-2.5 pb-2">
                {rooms.map((room) => (
                  <button
                    key={room}
                    onClick={() => finalizeOrder(room)}
                    className="min-h-[54px] flex flex-col items-center justify-center bg-white border border-hotel-peach/30 text-hotel-charcoal font-black rounded-xl sm:rounded-2xl hover:bg-hotel-peach hover:text-hotel-charcoal transition-all active:scale-90 shadow-2xs"
                  >
                    <span className="text-[8px] opacity-50 uppercase font-black">{t('room')}</span>
                    <span className="text-sm sm:text-base leading-none">{room}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-hotel-peachLight/30 text-center border-t border-hotel-peach/20 shrink-0">
              <div className="flex items-center justify-center gap-2 text-hotel-charcoal font-bold text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]"></span>
                </span>
                {t('whatsapp_redirect')}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="relative text-start">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {categories.map((cat, idx) => (
          <div key={idx} className="bg-hotel-cream rounded-2xl sm:rounded-[2.5rem] border border-hotel-peach/30 shadow-xs overflow-hidden">
            <div className="bg-hotel-peachLight px-5 sm:px-7 py-3.5 sm:py-4 border-b border-hotel-peach/20 flex items-center justify-between">
              <h3 className="text-base sm:text-lg md:text-xl font-black text-hotel-charcoal flex items-center gap-2.5">
                <span className="text-xl sm:text-2xl">{cat.emoji}</span>
                {cat.title}
              </h3>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              {cat.items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex flex-col gap-2 pb-3 border-b border-hotel-peach/10 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-start flex-1 min-w-0">
                      <p className="font-bold text-hotel-charcoal text-sm sm:text-base leading-snug">{item.name}</p>
                      {item.description && <p className="text-xs text-hotel-grey mt-0.5 leading-relaxed">{item.description}</p>}
                    </div>
                    <div className="bg-hotel-peachLight px-2.5 py-1 rounded-lg text-hotel-charcoal font-black text-xs whitespace-nowrap shrink-0 border border-hotel-peach/30">
                      {item.priceText}
                    </div>
                  </div>
                  
                  {/* Plus / Minus & Quantity buttons with comfortable touch targets */}
                  <div className="flex items-center justify-start gap-3 mt-0.5">
                    <button 
                      onClick={() => updateQuantity(item.name, 1)}
                      className="w-10 h-10 rounded-full bg-hotel-peach flex items-center justify-center text-hotel-charcoal hover:bg-hotel-peachLight transition-all shadow-xs active:scale-90 border border-hotel-peach/60"
                      aria-label={`Add ${item.name}`}
                    >
                      <PlusIcon className="w-5 h-5 stroke-[2.5]" />
                    </button>
                    {order[item.name] > 0 ? (
                      <>
                        <span className="font-black text-hotel-charcoal text-base w-6 text-center">{order[item.name]}</span>
                        <button 
                          onClick={() => updateQuantity(item.name, -1)}
                          className="w-10 h-10 rounded-full border-2 border-hotel-peach bg-white flex items-center justify-center text-hotel-charcoal hover:bg-hotel-peach transition-colors active:scale-90"
                          aria-label={`Remove ${item.name}`}
                        >
                          <MinusIcon className="w-5 h-5 stroke-[2.5]" />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-hotel-grey font-bold select-none">{t('add_to_order')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {floatingUI && createPortal(floatingUI, document.body)}
    </div>
  );
};

export default RestaurantMenu;
