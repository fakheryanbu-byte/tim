import React, { useState } from 'react';
import { useTranslation, Language } from '../LanguageContext';
import { GlobeAltIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, isRtl } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  ];

  const currentLang = languages.find(l => l.code === language);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 bg-hotel-cream border border-hotel-peach/40 px-2.5 sm:px-3 py-1.5 rounded-full text-hotel-charcoal font-bold text-xs hover:bg-hotel-peach transition-all shadow-2xs active:scale-95 min-h-[36px]"
        aria-label="Change Language"
        aria-expanded={isOpen}
      >
        <GlobeAltIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-hotel-charcoal shrink-0" />
        <span className="text-xs">{currentLang?.flag} <span className="hidden xs:inline">{currentLang?.name}</span></span>
        <ChevronDownIcon className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/10" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute top-full mt-2 ${isRtl ? 'left-0' : 'right-0'} bg-white border border-hotel-peach/30 rounded-2xl shadow-xl z-50 overflow-hidden min-w-[150px] animate-in fade-in slide-in-from-top-2 duration-200`}>
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-start px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-between hover:bg-hotel-peachLight transition-colors ${
                    language === lang.code ? 'bg-hotel-peachLight text-hotel-charcoal font-black' : 'text-hotel-charcoal/80'
                  }`}
                >
                  <span>{lang.name}</span>
                  <span className="text-base">{lang.flag}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
