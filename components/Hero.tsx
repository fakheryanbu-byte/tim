import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { useTranslation } from '../LanguageContext';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-[320px] sm:min-h-[380px] w-full rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-md group border-2 sm:border-3 border-hotel-peach/40 bg-gradient-to-br from-hotel-peachLight via-white to-hotel-cream flex flex-col justify-center items-center text-center p-6 sm:p-10 md:p-14">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-hotel-peach/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-hotel-peach/25 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl pointer-events-none"></div>
      
      <div className="relative z-10 animate-slide-up max-w-2xl mx-auto">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-5 sm:mb-7">
          <span className="bg-hotel-peach text-hotel-charcoal text-[10px] sm:text-xs font-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-full uppercase tracking-wider inline-block shadow-xs border border-hotel-peach/60">
            {t('guest_guide')}
          </span>
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-hotel-peach/40 shadow-xs">
            <StarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500" />
            <span className="text-[11px] sm:text-xs text-hotel-charcoal font-bold">{t('star_rating')}</span>
          </div>
        </div>
        
        {/* Main Titles */}
        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-hotel-charcoal mb-3 sm:mb-4 leading-tight tracking-tight">
          {t('hotel_name').split(' ')[0]} <span className="text-hotel-peach drop-shadow-xs">{t('hotel_name').split(' ')[1] || ''}</span>
        </h1>
        
        <h2 className="text-lg sm:text-2xl font-extrabold text-hotel-charcoal/85 mb-5 sm:mb-6 tracking-wide flex items-center justify-center gap-2">
          <span>{t('hotel_tim')}</span>
          <span className="text-hotel-peach">•</span>
          <span>{t('riyadh')}</span>
        </h2>
        
        <div className="w-16 sm:w-24 h-1 bg-hotel-peach mx-auto mb-5 sm:mb-6 rounded-full opacity-90"></div>
        
        <p className="text-hotel-charcoal/80 text-sm sm:text-base md:text-lg leading-relaxed font-medium px-2">
          {t('hero_desc')}
        </p>
      </div>
    </div>
  );
};

export default Hero;
