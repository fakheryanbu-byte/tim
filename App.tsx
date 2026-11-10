import React, { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon, 
  ShieldCheckIcon, 
  MapIcon, 
  PhoneIcon, 
  GlobeAltIcon,
  HomeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon,
  TruckIcon,
  UserGroupIcon,
  StarIcon,
  MapPinIcon,
  ClipboardDocumentIcon,
  TvIcon
} from '@heroicons/react/24/outline';
import { MessageCircle } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import AttractionCard from './components/AttractionCard';
import ContactBar from './components/ContactBar';
import RestaurantMenu from './components/RestaurantMenu';
import SaudiMedia from './components/SaudiMedia';
import LostDamagedInventory from './components/LostDamagedInventory';
import { policiesData } from './policiesData';

import { useTranslation } from './LanguageContext';

const App: React.FC = () => {
  const { t, isRtl, language } = useTranslation();
  const [activeSection, setActiveSection] = useState('welcome');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['welcome', 'location', 'facilities', 'restaurant', 'policies', 'damages', 'safety', 'attractions', 'media'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 200) {
          setActiveSection(id);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const handleCopyAddress = () => {
    const address = "6815 البسالة، RFMB6815، 3406، حي المعيزلة، الرياض 13231";
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmergencyCall = (num: string) => {
    window.location.href = `tel:${num}`;
  };

  const generateRooms = (start: number, end: number) => {
    const rooms = [];
    for (let i = start; i <= end; i++) {
      rooms.push(i.toString());
    }
    return rooms;
  };

  return (
    <div className="min-h-screen pb-36 text-hotel-charcoal text-start selection:bg-hotel-peach selection:text-hotel-charcoal">
      <Header activeSection={activeSection} onNavClick={scrollTo} />
      
      <main className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-28 sm:pt-32">
        
        {/* Welcome & Hero Section */}
        <div id="welcome" className="pt-2 sm:pt-4">
          <Hero />
        </div>

        {/* Location & National Address Section */}
        <section id="location" className="my-8 sm:my-12 animate-slide-up">
          <div className="bg-hotel-cream border-2 border-hotel-peach/30 rounded-2xl sm:rounded-[3rem] p-5 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="p-2.5 sm:p-3 bg-hotel-peachLight text-hotel-charcoal rounded-xl sm:rounded-2xl shrink-0">
                <MapPinIcon className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-hotel-charcoal">{t('location_title')}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-xl font-bold flex items-center gap-2">
                  <span className="w-2 h-5 sm:h-6 bg-hotel-peach rounded-full"></span>
                  {t('national_address')}
                </h3>
                <div className="p-4 sm:p-6 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                  <p className="text-hotel-charcoal font-medium text-xs sm:text-sm md:text-base leading-relaxed pe-16">
                    6815 البسالة<br />
                    RFMB6815، 3406، حي المعيزلة<br />
                    الرياض 13231
                  </p>
                  <button 
                    onClick={handleCopyAddress}
                    className={`absolute top-3.5 ${isRtl ? 'left-3.5' : 'right-3.5'} p-2 bg-hotel-cream rounded-xl shadow-xs border border-hotel-peach/20 hover:bg-hotel-peach transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold`}
                    aria-label="Copy address"
                  >
                    <span>{copied ? t('copied') : t('copy_address')}</span>
                    <ClipboardDocumentIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-xl font-bold flex items-center gap-2">
                  <span className="w-2 h-5 sm:h-6 bg-hotel-peach rounded-full"></span>
                  {t('google_maps')}
                </h3>
                <a 
                  href="https://maps.app.goo.gl/4fwNFeubUnDjxfEg8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-4 sm:p-6 bg-gradient-to-r from-hotel-peachLight to-white text-hotel-charcoal rounded-2xl hover:bg-hotel-peachLight transition-all border-2 border-hotel-peach/50 shadow-xs group active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-base sm:text-lg mb-0.5 text-hotel-charcoal">{t('open_maps')}</p>
                      <p className="text-xs text-hotel-charcoal/70">{t('maps_desc')}</p>
                    </div>
                    <ArrowTopRightOnSquareIcon className={`w-6 h-6 sm:w-8 sm:h-8 text-hotel-peach group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Environmental Commitment */}
        <section className="my-8 sm:my-12 animate-slide-up">
          <div className="bg-hotel-peachLight border border-hotel-peach rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col md:flex-row items-center gap-4 sm:gap-6">
            <div className="bg-hotel-peach p-3 sm:p-4 rounded-2xl shadow-xs shrink-0 self-start md:self-auto">
              <GlobeAltIcon className="w-7 h-7 sm:w-10 sm:h-10 text-hotel-charcoal" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-hotel-charcoal mb-2 sm:mb-3">{t('sustainability')}</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 text-hotel-charcoal/80 text-xs sm:text-sm font-medium">
                <li className="flex items-center gap-2"><span>•</span> {t('sustainability_1')}</li>
                <li className="flex items-center gap-2"><span>•</span> {t('sustainability_2')}</li>
                <li className="flex items-center gap-2"><span>•</span> {t('sustainability_3')}</li>
                <li className="flex items-center gap-2"><span>•</span> {t('sustainability_4')}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Facilities & Floor Directory Section */}
        <section id="facilities" className="mt-10 sm:mt-16 pt-8 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-6 rounded-2xl sm:rounded-[3rem] bg-hotel-blue/5 border border-hotel-blue/10">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="p-2.5 sm:p-3 bg-hotel-blue/20 text-hotel-blue rounded-xl shadow-xs shrink-0">
              <BuildingOfficeIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold">{t('floor_directory')}</h2>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-hotel-cream rounded-2xl sm:rounded-[2.5rem] border border-hotel-blue/20 shadow-xs overflow-hidden">
              <div className="bg-hotel-blue/10 px-5 sm:px-8 py-3.5 sm:py-5 border-b border-hotel-blue/10">
                <h3 className="text-sm sm:text-lg font-bold text-hotel-blue flex items-center gap-2">
                   {t('floor_dist')}
                </h3>
              </div>
              
              <div className="divide-y divide-hotel-peach/10">
                <FloorRow 
                  floor={t('basement')} 
                  title={t('parking')} 
                  items={[t('parking_desc')]}
                  icon={<TruckIcon className="w-5 h-5" />}
                />
                <FloorRow 
                  floor={t('ground_floor')} 
                  title={t('ground_desc')} 
                  items={[t('reception'), t('hotel_restaurant'), t('cinema'), t('public_toilets'), ...generateRooms(1102, 1108)]}
                  icon={<UserGroupIcon className="w-5 h-5" />}
                  highlight
                />
                <FloorRow 
                  floor={t('second_floor')} 
                  title={t('residential_rooms')} 
                  items={[...generateRooms(1201, 1220)]}
                  icon={<HomeIcon className="w-5 h-5" />}
                />
                <FloorRow 
                  floor={t('third_floor')} 
                  title={t('residential_rooms')} 
                  items={[...generateRooms(1301, 1308)]}
                  icon={<HomeIcon className="w-5 h-5" />}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
              <FacilityCard 
                icon={<ClockIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                title={t('reception_24')}
                description={t('reception_24_desc')}
              />
              <FacilityCard 
                icon={<ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                title={t('cleaning')}
                description={t('cleaning_desc')}
              />
            </div>
          </div>
        </section>

        {/* Restaurant Menu Section */}
        <section id="restaurant" className="mt-10 sm:mt-16 pt-8 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-6 rounded-2xl sm:rounded-[3rem] bg-hotel-peachLight/50 border border-hotel-peach/20">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="p-2.5 sm:p-3 bg-hotel-peach text-hotel-charcoal rounded-xl shadow-xs shrink-0">
              <span className="text-xl sm:text-2xl">🍽️</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-hotel-charcoal">{t('restaurant_menu')}</h2>
          </div>
          <RestaurantMenu />
        </section>

        {/* Policies Section */}
        <section id="policies" className="mt-10 sm:mt-16 pt-8 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-6 rounded-2xl sm:rounded-[3rem] bg-hotel-yellow/5 border border-hotel-yellow/10">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="p-2.5 sm:p-3 bg-hotel-yellow/20 text-hotel-yellow rounded-xl shrink-0">
              <ShieldCheckIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-hotel-charcoal">{t('hotel_policies')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            {policiesData.map((item) => {
              const langKey = (language as keyof typeof item) || 'ar';
              const text = item[langKey] || item['ar'];
              const isHighlight = item.id === 1 || item.id === 10 || item.id === 11;
              return (
                <div 
                  key={item.id} 
                  className={`p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border-2 transition-all flex items-start gap-3 sm:gap-4 ${
                    isHighlight 
                      ? 'bg-hotel-cream border-hotel-yellow/60 shadow-xs' 
                      : 'bg-hotel-cream/80 border-hotel-yellow/15 hover:border-hotel-yellow/30 shadow-2xs'
                  }`}
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-sm sm:text-lg shrink-0 mt-0.5 ${
                    isHighlight ? 'bg-hotel-yellow text-hotel-charcoal shadow-xs' : 'bg-gray-100 text-hotel-charcoal/70'
                  }`}>
                    {item.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs sm:text-sm md:text-base ${isHighlight ? 'font-black text-hotel-charcoal' : 'font-medium text-hotel-charcoal/90'} leading-relaxed`}>
                      {text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Lost and Damaged Inventory Section */}
        <section id="damages" className="mt-10 sm:mt-16 pt-8 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-6 rounded-2xl sm:rounded-[3rem] bg-amber-500/5 border border-amber-500/15">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="p-2.5 sm:p-3 bg-amber-500/20 text-amber-900 rounded-xl shadow-xs shrink-0">
              <span className="text-xl sm:text-2xl">📋</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-hotel-charcoal leading-tight">
                {t('lost_damaged_title')}
              </h2>
            </div>
          </div>
          <LostDamagedInventory />
        </section>

        {/* Safety Section */}
        <section id="safety" className="mt-10 sm:mt-16 pt-8 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-6 rounded-2xl sm:rounded-[3rem] bg-red-50 border border-red-100">
          <div className={`bg-white ${isRtl ? 'border-r-4 sm:border-r-8' : 'border-l-4 sm:border-l-8'} border-red-400 p-5 sm:p-8 rounded-2xl sm:rounded-l-[2.5rem] sm:rounded-r-2xl shadow-xs`}>
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <ExclamationTriangleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 shrink-0" />
              <h2 className="text-xl sm:text-3xl font-extrabold text-hotel-charcoal">{t('safety_guidelines')}</h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <p className="flex items-start gap-2.5 sm:gap-3 text-hotel-charcoal text-sm sm:text-base md:text-lg">
                <span className="font-bold text-red-400 text-lg sm:text-xl mt-[-2px]">•</span> 
                <span>{t('safety_1')}</span>
              </p>
              <p className="flex items-start gap-2.5 sm:gap-3 text-hotel-charcoal text-sm sm:text-base md:text-lg">
                <span className="font-bold text-red-400 text-lg sm:text-xl mt-[-2px]">•</span> 
                <span>{t('safety_2')}</span>
              </p>
              <p className="flex items-start gap-2.5 sm:gap-3 text-hotel-charcoal text-sm sm:text-base md:text-lg">
                <span className="font-bold text-red-400 text-lg sm:text-xl mt-[-2px]">•</span> 
                <span>{t('safety_3')}</span>
              </p>
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-red-100">
                <h3 className="font-bold text-hotel-charcoal mb-3 sm:mb-4 text-sm sm:text-base">{t('emergency_numbers')}</h3>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                  <EmergencyButton num="999" label={t('police')} onClick={() => handleEmergencyCall('999')} colorClass="text-blue-600" />
                  <EmergencyButton num="997" label={t('ambulance')} onClick={() => handleEmergencyCall('997')} colorClass="text-red-600" />
                  <EmergencyButton num="998" label={t('civil_defense')} onClick={() => handleEmergencyCall('998')} colorClass="text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Attractions Section */}
        <section id="attractions" className="mt-10 sm:mt-16 pt-8 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-6 rounded-2xl sm:rounded-[3rem] bg-hotel-mauve/5 border border-hotel-mauve/10 mb-8 sm:mb-12">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="p-2.5 sm:p-3 bg-hotel-mauve/20 text-hotel-mauve rounded-xl shadow-xs shrink-0">
              <MapIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-hotel-charcoal">{t('nearby_attractions')}</h2>
          </div>

          <a 
            href={language === 'ar' ? "https://www.visitsaudi.com/ar" : "https://www.visitsaudi.com/en"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block mb-8 sm:mb-10 bg-gradient-to-r from-hotel-peachLight via-white to-hotel-peachLight rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 text-hotel-charcoal relative overflow-hidden group hover:shadow-md transition-all border-2 border-hotel-peach/50 active:scale-[0.98]"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="text-start">
                <h3 className="text-lg sm:text-2xl font-black mb-1.5 flex items-center gap-2 text-hotel-charcoal">
                  <span>{t('visit_saudi')}</span>
                  <ArrowTopRightOnSquareIcon className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                </h3>
                <p className="text-hotel-charcoal/80 font-medium text-xs sm:text-sm md:text-base leading-relaxed">{t('visit_saudi_desc')}</p>
              </div>
              <div className="bg-hotel-peach text-hotel-charcoal px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-black text-xs sm:text-sm hover:bg-hotel-peachLight transition-colors w-full md:w-auto text-center border border-hotel-peach/60 shadow-xs">
                {t('visit_site')}
              </div>
            </div>
          </a>

          <div className="space-y-8 sm:space-y-12">
            <div>
              <h3 className="text-base sm:text-xl font-bold text-hotel-charcoal mb-4 sm:mb-6 flex items-center gap-2">
                <span className="w-2 h-6 sm:h-8 bg-purple-400 rounded-full"></span>
                {t('markets_malls')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <AttractionCard 
                  name={t('riyadh_park')} 
                  desc={t('riyadh_park_desc')} 
                  emoji="🛍️"
                  mapUrl="https://maps.google.com/?q=Riyadh+Park"
                />
                <AttractionCard 
                  name={t('souq_al_zal')} 
                  desc={t('souq_al_zal_desc')} 
                  emoji="🕌"
                  mapUrl="https://maps.google.com/?q=Souq+Al+Zal+Riyadh"
                />
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-xl font-bold text-hotel-charcoal mb-4 sm:mb-6 flex items-center gap-2">
                <span className="w-2 h-6 sm:h-8 bg-purple-400 rounded-full"></span>
                {t('historical_modern')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <AttractionCard 
                  name={t('diriyah')} 
                  desc={t('diriyah_desc')} 
                  emoji="🏰"
                  mapUrl="https://maps.google.com/?q=Diriyah+Riyadh"
                />
                <AttractionCard 
                  name={t('kafd')} 
                  desc={t('kafd_desc')} 
                  emoji="🏙️"
                  mapUrl="https://maps.google.com/?q=KAFD+Riyadh"
                />
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-xl font-bold text-hotel-charcoal mb-4 sm:mb-6 flex items-center gap-2">
                <span className="w-2 h-6 sm:h-8 bg-purple-400 rounded-full"></span>
                {t('parks_gardens')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <AttractionCard 
                  name={t('king_abdullah_park')} 
                  desc={t('king_abdullah_park_desc')} 
                  emoji="⛲"
                  mapUrl="https://maps.google.com/?q=King+Abdullah+Park+Riyadh"
                />
                <AttractionCard 
                  name={t('king_salman_park')} 
                  desc={t('king_salman_park_desc')} 
                  emoji="🌳"
                  mapUrl="https://maps.google.com/?q=King+Salman+Park+Riyadh"
                />
              </div>
            </div>

            <div className="mt-8 sm:mt-12 bg-purple-100/50 border border-purple-200 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 text-center shadow-2xs">
              <h3 className="text-base sm:text-lg font-bold text-hotel-charcoal mb-2 sm:mb-4">{t('need_tourist_help')}</h3>
              <p className="text-hotel-charcoal/70 mb-4 sm:mb-6 text-xs sm:text-sm">{t('tourist_help_desc')}</p>
              <button 
                onClick={() => handleEmergencyCall('930')}
                className="inline-flex items-center justify-center gap-2 bg-hotel-peach text-hotel-charcoal font-black px-6 sm:px-10 py-3.5 sm:py-4 rounded-full hover:bg-hotel-peachLight transition-all shadow-xs active:scale-95 text-xs sm:text-sm w-full sm:w-auto border border-hotel-peach/60"
              >
                <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{t('tourist_call_center')} (930)</span>
              </button>
            </div>
          </div>
        </section>

        {/* Saudi Media Section */}
        <section id="media" className="mt-10 sm:mt-16 pt-8 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-6 rounded-2xl sm:rounded-[3rem] bg-hotel-blue/5 border border-hotel-blue/10">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="p-2.5 sm:p-3 bg-hotel-blue/20 text-hotel-blue rounded-xl shadow-xs shrink-0">
              <TvIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-hotel-charcoal">{t('saudi_media')}</h2>
          </div>
          <SaudiMedia />
        </section>

        {/* Closing Word */}
        <section className="relative bg-gradient-to-br from-hotel-peachLight via-white to-hotel-cream text-hotel-charcoal rounded-2xl sm:rounded-[3rem] p-6 sm:p-12 text-center my-12 sm:my-20 border-2 sm:border-3 border-hotel-peach/40 overflow-hidden shadow-md">
          <div className="absolute top-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-hotel-peach/15 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-hotel-peach/20 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-hotel-peach rounded-2xl flex items-center justify-center text-hotel-charcoal font-black text-2xl sm:text-4xl shadow-md mb-4 sm:mb-6 border border-hotel-peach/60">T</div>
            <h3 className="text-hotel-peach text-xs sm:text-sm font-black uppercase tracking-widest mb-1 sm:mb-2">{t('team_group')}</h3>
            <h2 className="text-2xl sm:text-4xl font-black mb-4 sm:mb-6 text-hotel-charcoal drop-shadow-xs">{t('happy_stay')}</h2>
            
            <div className="flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-8">
              <StarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500" />
            </div>

            <p className="text-hotel-charcoal/80 leading-relaxed max-w-2xl mx-auto text-sm sm:text-lg font-medium px-2">
              {t('closing_desc')}
            </p>
            
            <div className="mt-6 sm:mt-10 pt-6 sm:pt-8 border-t border-hotel-peach/30 w-full max-w-xs mx-auto">
              <span className="text-hotel-charcoal/70 text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                {t('hotel_name')} {t('riyadh')} • {t('star_rating')}
              </span>
            </div>
          </div>
        </section>

        {/* Design Credit */}
        <div className="mt-8 mb-28 sm:mb-36 text-center">
          <a 
            href="https://wa.me/966560334697" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex flex-col items-center gap-1.5 sm:gap-2 group transition-all"
          >
            <div className="text-hotel-charcoal font-black text-lg sm:text-2xl tracking-[0.08em] uppercase flex flex-col items-center gap-1.5 group-hover:text-[#25D366] transition-colors">
              <span className="font-arabic text-sm sm:text-base">تصميم QUI</span>
              <span className="text-sm sm:text-xl font-mono border-t border-hotel-charcoal/20 group-hover:border-[#25D366]/30 pt-1.5 sm:pt-2 px-4 sm:px-6 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                0560334697
              </span>
            </div>
          </a>
        </div>
      </main>

      <ContactBar />
    </div>
  );
};

// Internal Components
const FloorRow: React.FC<{ 
  floor: string, 
  title: string, 
  items: string[], 
  icon: React.ReactNode,
  highlight?: boolean 
}> = ({ floor, title, items, icon, highlight }) => (
  <div className={`p-4 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-10 transition-colors ${highlight ? 'bg-hotel-cream' : 'hover:bg-hotel-peachLight/20'}`}>
    <div className="sm:w-36 shrink-0">
      <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider mb-1 ${highlight ? 'bg-hotel-peach text-hotel-charcoal' : 'bg-hotel-cream border border-hotel-peach/30 text-hotel-charcoal/70'}`}>
        {floor}
      </span>
      <div className="flex items-center gap-1.5 text-hotel-charcoal font-bold text-xs sm:text-base">
        <span className="text-hotel-peach">{icon}</span>
        <span>{title}</span>
      </div>
    </div>
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {items.map((item, idx) => (
        <span key={idx} className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border ${highlight ? 'bg-white border-hotel-peach/40 text-hotel-charcoal font-bold shadow-2xs' : 'bg-white/70 border-hotel-peach/20 text-hotel-charcoal/80'}`}>
          {item}
        </span>
      ))}
    </div>
  </div>
);

const FacilityCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="p-4 sm:p-6 bg-hotel-cream rounded-2xl sm:rounded-[2rem] border border-hotel-blue/15 hover:border-hotel-blue/35 transition-all shadow-2xs">
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-hotel-blue/10 text-hotel-blue rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shrink-0">
      {icon}
    </div>
    <h3 className="text-base sm:text-lg font-bold text-hotel-charcoal mb-1 sm:mb-2">{title}</h3>
    <p className="text-hotel-charcoal/75 text-xs sm:text-sm leading-relaxed">{description}</p>
  </div>
);

const EmergencyButton: React.FC<{ num: string, label: string, onClick: () => void, colorClass?: string }> = ({ num, label, onClick, colorClass }) => (
  <button 
    onClick={onClick}
    className="bg-hotel-cream p-3 sm:p-5 rounded-xl sm:rounded-2xl text-center shadow-2xs border-2 border-red-50 hover:border-red-400 hover:bg-red-50 transition-all group flex flex-col items-center justify-center gap-0.5 sm:gap-1 active:scale-95 min-h-[64px]"
    aria-label={`Call ${label} ${num}`}
  >
    <div className={`font-black text-xl sm:text-3xl ${colorClass || 'text-hotel-charcoal'}`}>{num}</div>
    <div className="text-[10px] sm:text-xs text-hotel-charcoal font-bold opacity-80 group-hover:opacity-100 truncate w-full">{label}</div>
  </button>
);

export default App;
