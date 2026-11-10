import React from 'react';
import { PhoneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { useTranslation } from '../LanguageContext';

const ContactBar: React.FC = () => {
  const { t } = useTranslation();
  
  const handleCall = () => {
    window.location.href = 'tel:0599410597';
  };

  const handleWhatsApp = () => {
    window.location.href = 'https://wa.me/966599410597';
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-[94%] max-w-md pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-md text-hotel-charcoal rounded-full p-1.5 sm:p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border-2 border-hotel-peach/60 flex items-center justify-between gap-1.5 sm:gap-2">
        <button 
          onClick={handleCall}
          className="flex-1 min-h-[48px] sm:min-h-[52px] bg-hotel-peach hover:bg-hotel-peachLight text-hotel-charcoal font-black py-3 sm:py-3.5 px-3 sm:px-4 rounded-full flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs text-xs sm:text-sm md:text-base whitespace-nowrap border border-hotel-peach/50"
          aria-label={t('call_reception')}
        >
          <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="truncate">{t('call_reception')}</span>
        </button>
        
        <button 
          onClick={handleWhatsApp}
          className="flex-1 min-h-[48px] sm:min-h-[52px] bg-[#25D366] hover:bg-[#1ebd5a] text-white font-black py-3 sm:py-3.5 px-3 sm:px-4 rounded-full flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs text-xs sm:text-sm md:text-base whitespace-nowrap"
          aria-label={t('whatsapp')}
        >
          <ChatBubbleLeftRightIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="truncate">{t('whatsapp')}</span>
        </button>
      </div>
    </div>
  );
};

export default ContactBar;
