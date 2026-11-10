import React from 'react';
import { TvIcon, RadioIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../LanguageContext';

const SaudiMedia: React.FC = () => {
  const { t, isRtl } = useTranslation();
  const channels = [
    { name: "القناة السعودية", url: "https://aloula.sba.sa/live/saudi", type: "TV" },
    { name: "قناة SBC", url: "https://aloula.sba.sa/live/sbc", type: "TV" },
    { name: "قناة الإخبارية", url: "https://aloula.sba.sa/live/ekhbariya", type: "TV" },
    { name: "قناة القرآن الكريم", url: "https://aloula.sba.sa/live/quran", type: "TV" },
    { name: "قناة السنة النبوية", url: "https://aloula.sba.sa/live/sunnah", type: "TV" },
    { name: "القناة الثقافية", url: "https://aloula.sba.sa/live/thaqafia", type: "TV" },
  ];

  const radioStations = [
    { name: "إذاعة الرياض", url: "https://aloula.sba.sa/radio/riyadh", type: "Radio" },
    { name: "إذاعة جدة", url: "https://aloula.sba.sa/radio/jeddah", type: "Radio" },
    { name: "إذاعة القرآن الكريم", url: "https://aloula.sba.sa/radio/quran", type: "Radio" },
    { name: "إذاعة نداء الإسلام", url: "https://aloula.sba.sa/radio/neda", type: "Radio" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-hotel-charcoal mb-4 sm:mb-6 flex items-center gap-2">
          <span className="w-2 h-6 sm:h-8 bg-hotel-blue rounded-full"></span>
          {t('saudi_tv')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {channels.map((ch, idx) => (
            <a 
              key={idx}
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 sm:p-4 bg-hotel-cream border border-hotel-blue/15 rounded-2xl hover:border-hotel-blue/40 hover:shadow-xs transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-hotel-blue/10 text-hotel-blue rounded-xl shrink-0">
                  <TvIcon className="w-5 h-5" />
                </div>
                <span className="font-bold text-hotel-charcoal text-sm sm:text-base">{ch.name}</span>
              </div>
              <ArrowTopRightOnSquareIcon className={`w-4 h-4 text-hotel-grey group-hover:text-hotel-blue transition-colors shrink-0 ${isRtl ? 'rotate-180' : ''}`} />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg sm:text-xl font-bold text-hotel-charcoal mb-4 sm:mb-6 flex items-center gap-2">
          <span className="w-2 h-6 sm:h-8 bg-hotel-yellow rounded-full"></span>
          {t('saudi_radio')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {radioStations.map((radio, idx) => (
            <a 
              key={idx}
              href={radio.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 sm:p-4 bg-hotel-cream border border-hotel-yellow/20 rounded-2xl hover:border-hotel-yellow/50 hover:shadow-xs transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-hotel-yellow/15 text-hotel-charcoal rounded-xl shrink-0">
                  <RadioIcon className="w-5 h-5" />
                </div>
                <span className="font-bold text-hotel-charcoal text-sm sm:text-base">{radio.name}</span>
              </div>
              <ArrowTopRightOnSquareIcon className={`w-4 h-4 text-hotel-grey group-hover:text-hotel-charcoal transition-colors shrink-0 ${isRtl ? 'rotate-180' : ''}`} />
            </a>
          ))}
        </div>
      </div>

      <div className="bg-hotel-blue/5 border border-hotel-blue/15 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-center">
        <p className="text-hotel-charcoal font-medium text-xs sm:text-sm mb-3 sm:mb-4">{t('more_saudi_content')}</p>
        <a 
          href="https://aloula.sba.sa/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-hotel-blue text-white px-6 sm:px-8 py-3 rounded-full font-bold text-xs sm:text-sm hover:bg-blue-600 transition-all shadow-sm active:scale-95 w-full sm:w-auto"
        >
          <span>{t('aloula_platform')}</span>
          <ArrowTopRightOnSquareIcon className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
        </a>
      </div>
    </div>
  );
};

export default SaudiMedia;
