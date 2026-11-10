import React, { useState, useMemo } from 'react';
import { 
  ClipboardDocumentCheckIcon, 
  MagnifyingGlassIcon, 
  XMarkIcon,
  ExclamationCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { lostDamagedData, LostDamagedItem } from '../lostDamagedData';
import { useTranslation, Language } from '../LanguageContext';

export const LostDamagedInventory: React.FC = () => {
  const { t, language, isRtl } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentLang = (language as Language) || 'ar';

  const categories = [
    { key: 'all', labelKey: 'all_items', icon: '📋' },
    { key: 'bedroom_furniture', labelKey: 'cat_furniture', icon: '🛏️' },
    { key: 'bedding', labelKey: 'cat_bedding', icon: '🪶' },
    { key: 'electronics', labelKey: 'cat_electronics', icon: '🔌' },
    { key: 'bathroom', labelKey: 'cat_bathroom', icon: '🚿' },
    { key: 'room_amenities', labelKey: 'cat_amenities', icon: '🪞' },
    { key: 'fees', labelKey: 'cat_fees', icon: '⚙️' },
  ];

  const filteredItems = useMemo(() => {
    return lostDamagedData.filter((item: LostDamagedItem) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      const itemName = item.name[currentLang] || item.name.ar;
      const itemPrice = item.price[currentLang] || item.price.ar;
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch = !query || 
        itemName.toLowerCase().includes(query) || 
        itemPrice.toLowerCase().includes(query) ||
        item.id.toString() === query;

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, currentLang]);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'bedroom_furniture':
        return { label: t('cat_furniture'), color: 'bg-amber-100/80 text-amber-800 border-amber-200' };
      case 'bedding':
        return { label: t('cat_bedding'), color: 'bg-blue-100/80 text-blue-800 border-blue-200' };
      case 'electronics':
        return { label: t('cat_electronics'), color: 'bg-purple-100/80 text-purple-800 border-purple-200' };
      case 'bathroom':
        return { label: t('cat_bathroom'), color: 'bg-teal-100/80 text-teal-800 border-teal-200' };
      case 'room_amenities':
        return { label: t('cat_amenities'), color: 'bg-orange-100/80 text-orange-800 border-orange-200' };
      case 'fees':
        return { label: t('cat_fees'), color: 'bg-rose-100/80 text-rose-800 border-rose-200' };
      default:
        return { label: t('all_items'), color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Subtitle & Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-hotel-charcoal/10 shadow-xs">
        <p className="text-xs sm:text-sm md:text-base text-hotel-charcoal/90 font-medium leading-relaxed">
          {t('lost_damaged_subtitle')}
        </p>
        <div className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 bg-hotel-peachLight text-hotel-charcoal border border-hotel-peach rounded-full text-xs font-extrabold whitespace-nowrap shadow-xs">
          <span>{t('total_items_count')}</span>
          <span className="bg-hotel-peach text-hotel-charcoal px-2 py-0.5 rounded-full font-black text-xs border border-hotel-peach/60">
            {lostDamagedData.length}
          </span>
          <span>{t('item_unit')}</span>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-3 sm:space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-hotel-grey">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_items')}
            className="w-full ps-10 pe-10 py-3 sm:py-3.5 bg-white border-2 border-hotel-peach/30 focus:border-hotel-charcoal rounded-2xl text-hotel-charcoal placeholder-hotel-grey/70 text-base font-medium outline-none transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-hotel-grey hover:text-hotel-charcoal transition-colors p-2"
              aria-label="Clear search"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category Scrollable Pills for Mobile & Desktop */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none touch-pan-x">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all border shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-hotel-peach text-hotel-charcoal border-hotel-peach shadow-xs font-black'
                    : 'bg-white/90 text-hotel-charcoal/80 border-hotel-peach/20 hover:border-hotel-peach hover:bg-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{t(cat.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Card-List View (< sm) */}
      <div className="block sm:hidden space-y-2.5">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const badge = getCategoryBadge(item.category);
            const isSpecialFee = item.category === 'fees';
            return (
              <div 
                key={item.id}
                className="bg-white p-3.5 rounded-2xl border border-hotel-peach/25 shadow-xs flex items-center justify-between gap-3 active:bg-hotel-peachLight/30 transition-colors"
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-hotel-cream font-bold text-xs text-hotel-charcoal/80 border border-hotel-peach/30 shrink-0 mt-0.5">
                    {item.id}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-hotel-charcoal text-sm leading-snug break-words">
                      {item.name[currentLang] || item.name.ar}
                    </p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-end">
                  <span className={`inline-block px-2.5 py-1.5 rounded-xl font-black text-xs whitespace-nowrap ${
                    isSpecialFee 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                      : 'bg-hotel-peachLight text-hotel-charcoal border border-hotel-peach/40'
                  }`}>
                    {item.price[currentLang] || item.price.ar}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-10 bg-white rounded-2xl text-center text-hotel-grey border border-hotel-peach/20">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-sm font-bold text-hotel-charcoal">{t('no_items_found')}</p>
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-3 text-xs font-bold text-hotel-charcoal underline"
              >
                {t('all_items')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Desktop & Tablet Table View (>= sm) */}
      <div className="hidden sm:block bg-white rounded-3xl border border-hotel-peach/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="bg-hotel-peachLight/90 text-hotel-charcoal text-xs sm:text-sm uppercase tracking-wider font-extrabold border-b-2 border-hotel-peach/40">
                <th className="py-4 px-4 sm:px-6 text-center w-16 sm:w-20">
                  {t('item_number')}
                </th>
                <th className="py-4 px-4 sm:px-6 text-start">
                  {t('item_name')}
                </th>
                <th className="py-4 px-4 sm:px-6 text-end font-bold w-36 sm:w-52">
                  {t('item_compensation')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hotel-peach/15 text-sm sm:text-base">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => {
                  const badge = getCategoryBadge(item.category);
                  const isEven = idx % 2 === 0;
                  const isSpecialFee = item.category === 'fees';
                  return (
                    <tr 
                      key={item.id}
                      className={`transition-colors hover:bg-hotel-peachLight/20 ${
                        isEven ? 'bg-white' : 'bg-hotel-cream/40'
                      }`}
                    >
                      {/* Item Number */}
                      <td className="py-3.5 px-4 sm:px-6 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-hotel-cream font-bold text-xs sm:text-sm text-hotel-charcoal/80 border border-hotel-peach/30">
                          {item.id}
                        </span>
                      </td>

                      {/* Item Name and Category Tag */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                          <span className="font-bold text-hotel-charcoal text-sm sm:text-base">
                            {item.name[currentLang] || item.name.ar}
                          </span>
                          <span className={`inline-block self-start px-2.5 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                      </td>

                      {/* Compensation Price */}
                      <td className="py-3.5 px-4 sm:px-6 text-end">
                        <span className={`inline-block px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm sm:text-base tracking-tight shadow-2xs ${
                          isSpecialFee 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200 font-extrabold'
                            : 'bg-hotel-peachLight/60 text-hotel-charcoal border border-hotel-peach/40'
                        }`}>
                          {item.price[currentLang] || item.price.ar}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="py-12 px-4 text-center text-hotel-grey">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-hotel-cream flex items-center justify-center text-2xl">
                        🔍
                      </div>
                      <p className="text-base font-bold text-hotel-charcoal/70">
                        {t('no_items_found')}
                      </p>
                      {searchQuery && (
                        <button
                          onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                          className="text-xs font-bold text-hotel-charcoal underline hover:opacity-80"
                        >
                          {t('all_items')}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Important Policy Note */}
      <div className="bg-amber-50/90 border-2 border-amber-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs">
        <div className="flex items-start gap-3 sm:gap-3.5">
          <div className="p-2 sm:p-2.5 bg-amber-100 text-amber-900 rounded-xl shrink-0 mt-0.5">
            <ExclamationCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-amber-950 text-sm sm:text-base">
              {t('important_note')}
            </h4>
            <p className="text-amber-900/90 text-xs sm:text-sm leading-relaxed font-medium">
              {t('lost_damaged_note')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostDamagedInventory;
