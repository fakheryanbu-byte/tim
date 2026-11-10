import React, { useState, useEffect } from 'react';
import { 
  Bars3Icon, 
  XMarkIcon, 
  PhoneIcon, 
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  TvIcon,
  MapIcon,
  StarIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '../LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  activeSection: string;
  onNavClick: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onNavClick }) => {
  const { t, isRtl } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on ESC or window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (id: string) => {
    onNavClick(id);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'facilities', label: t('facilities'), icon: '🏢' },
    { id: 'restaurant', label: t('restaurant'), icon: '🍽️' },
    { id: 'policies', label: t('policies'), icon: '📜' },
    { id: 'damages', label: t('lost_and_damaged'), icon: '📋' },
    { id: 'safety', label: t('safety'), icon: '🚨' },
    { id: 'attractions', label: t('attractions'), icon: '🗺️' },
    { id: 'media', label: t('media'), icon: '📺' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 shadow-sm border-b border-hotel-peach/30 bg-hotel-cream/95 backdrop-blur-md">
        {/* Top Brand Bar */}
        <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2 border-b border-hotel-peach/20">
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none" 
            onClick={() => handleNavClick('welcome')}
            role="button"
            tabIndex={0}
          >
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-hotel-peach border border-hotel-peach/70 rounded-xl flex items-center justify-center text-hotel-charcoal font-black text-base sm:text-lg shadow-xs group-hover:scale-105 transition-transform">
                T
              </div>
              <div className={`absolute -top-1 ${isRtl ? '-right-1' : '-left-1'} w-2.5 sm:w-3 h-2.5 sm:h-3 bg-hotel-peach rounded-full border-2 border-hotel-cream`}></div>
            </div>
            <div className="flex flex-col leading-tight text-start">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-xl font-black tracking-tight text-hotel-charcoal">
                  {t('hotel_name')}
                </span>
                <span className="text-[9px] sm:text-[10px] bg-hotel-peach/70 text-hotel-charcoal px-2 py-0.5 rounded-md font-extrabold hidden xs:inline-block">
                  {t('star_rating')}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] sm:text-[10px] font-bold text-hotel-grey tracking-wider uppercase">{t('team_group')}</span>
                <span className="w-1 h-1 bg-hotel-peach rounded-full"></span>
                <span className="text-[9px] sm:text-[10px] font-bold text-hotel-peach">{t('riyadh')}</span>
              </div>
            </div>
          </div>
          
          {/* Desktop Right Action Bar: Language + Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            
            <div className="hidden md:flex items-center gap-2">
              <span className="text-[11px] bg-hotel-peach text-hotel-charcoal px-3 py-1 rounded-full font-black uppercase shadow-xs">
                {t('guest_guide_short')}
              </span>
            </div>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-hotel-peachLight border border-hotel-peach/40 flex items-center justify-center text-hotel-charcoal hover:bg-hotel-peach transition-colors active:scale-90"
              aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              ) : (
                <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Fixed Persistent Quick Navigation Chips Sub-Bar (Visible & Fixed on all screens) */}
        <nav 
          aria-label="Quick Section Navigation"
          className="w-full bg-hotel-cream/90 backdrop-blur-md px-2 sm:px-4 py-2 overflow-x-auto scrollbar-none touch-pan-x"
        >
          <div className="max-w-6xl mx-auto flex items-center gap-1.5 sm:gap-2 min-w-max px-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border shrink-0 active:scale-95 ${
                    isActive
                      ? 'bg-hotel-peach text-hotel-charcoal border-hotel-peach shadow-xs scale-[1.02] font-black'
                      : 'bg-white/90 text-hotel-charcoal/90 border-hotel-peach/30 hover:bg-white hover:border-hotel-peach'
                  }`}
                >
                  <span className="text-sm sm:text-base leading-none">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Mobile Drawer / Slide-Over Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-hotel-charcoal/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div className={`fixed top-[108px] sm:top-[116px] bottom-0 ${isRtl ? 'right-0' : 'left-0'} w-[85%] max-w-sm bg-hotel-cream shadow-2xl border-e border-hotel-peach/30 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top duration-300 p-5`}>
            <div className="space-y-4">
              {/* Quick Hotel Status Pill */}
              <div className="bg-hotel-peachLight/80 p-4 rounded-2xl border border-hotel-peach/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🏨</span>
                  <div>
                    <h4 className="font-extrabold text-sm text-hotel-charcoal">{t('hotel_name')} - {t('riyadh')}</h4>
                    <p className="text-[11px] text-hotel-grey font-bold">{t('star_rating')}</p>
                  </div>
                </div>
                <span className="text-xs bg-hotel-peach text-hotel-charcoal font-black px-2.5 py-1 rounded-full">
                  {t('happy_stay')}
                </span>
              </div>

              {/* Navigation Links Grid / List */}
              <div className="space-y-1.5 pt-1">
                <p className="text-xs font-bold text-hotel-grey px-2 uppercase tracking-wider mb-2">
                  {t('guest_guide_short')}
                </p>
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-extrabold text-sm transition-all active:scale-[0.98] ${
                        isActive
                          ? 'bg-hotel-peach text-hotel-charcoal shadow-xs scale-[1.01] border border-hotel-peach'
                          : 'bg-white/70 text-hotel-charcoal hover:bg-white border border-hotel-peach/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-hotel-charcoal"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Mobile Action Buttons inside Drawer */}
            <div className="pt-6 mt-6 border-t border-hotel-peach/30 space-y-2.5">
              <a 
                href="tel:0599410597"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-hotel-peach text-hotel-charcoal font-black text-sm rounded-2xl shadow-sm hover:bg-hotel-peachLight transition-all active:scale-95"
              >
                <PhoneIcon className="w-4 h-4" />
                <span>{t('call_reception')} (0599410597)</span>
              </a>

              <a 
                href="https://wa.me/966599410597"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-[#25D366] text-white font-black text-sm rounded-2xl shadow-sm hover:bg-[#1ebd5a] transition-all active:scale-95"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                <span>{t('whatsapp')}</span>
              </a>

              <a 
                href="https://maps.app.goo.gl/4fwNFeubUnDjxfEg8"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white border border-hotel-peach/50 text-hotel-charcoal font-bold text-xs rounded-xl hover:bg-hotel-peachLight transition-all"
              >
                <MapPinIcon className="w-4 h-4" />
                <span>{t('open_maps')}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const NavButton: React.FC<{ active: boolean, onClick: () => void, children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button 
    onClick={onClick}
    className={`text-sm font-bold transition-all relative py-1 px-2 rounded-lg ${
      active 
        ? 'text-hotel-charcoal font-black bg-hotel-peach/30' 
        : 'text-hotel-grey hover:text-hotel-charcoal hover:bg-hotel-peach/10'
    }`}
  >
    {children}
    {active && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-hotel-peach rounded-full"></span>}
  </button>
);

export default Header;
