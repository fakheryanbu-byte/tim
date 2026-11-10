import React from 'react';
import { MapPinIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../LanguageContext';

interface AttractionCardProps {
  name: string;
  desc: string;
  emoji: string;
  mapUrl: string;
}

const AttractionCard: React.FC<AttractionCardProps> = ({ name, desc, emoji, mapUrl }) => {
  const { t, isRtl } = useTranslation();
  const openMap = () => {
    window.open(mapUrl, '_blank');
  };

  return (
    <div className="overflow-hidden rounded-2xl sm:rounded-[2.5rem] bg-hotel-cream border border-hotel-peach/30 shadow-xs hover:shadow-md transition-all flex flex-col h-full group">
      {/* Visual Header with Emoji */}
      <div className="h-24 sm:h-32 bg-hotel-peachLight flex items-center justify-center text-5xl sm:text-6xl group-hover:scale-105 transition-transform duration-300 select-none">
        {emoji}
      </div>
      
      <div className="p-5 sm:p-7 text-start flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3 mb-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-hotel-peachLight rounded-xl flex items-center justify-center text-hotel-charcoal shrink-0">
              <MapPinIcon className="w-5 h-5" />
            </div>
            <h4 className="text-lg sm:text-2xl font-bold text-hotel-charcoal leading-snug">{name}</h4>
          </div>
          <p className="text-hotel-grey text-xs sm:text-sm md:text-base leading-relaxed mb-6 font-medium">
            {desc}
          </p>
        </div>
        
        <button 
          onClick={openMap}
          className="bg-hotel-peach text-hotel-charcoal text-xs sm:text-sm font-black px-6 sm:px-8 py-3.5 rounded-full hover:bg-hotel-peachLight border border-hotel-peach/60 transition-all w-full flex items-center justify-center gap-2 shadow-xs active:scale-95 min-h-[44px]"
        >
          <span>{t('open_maps')}</span>
          <ArrowTopRightOnSquareIcon className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default AttractionCard;
