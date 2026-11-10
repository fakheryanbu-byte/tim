import React, { useState, useEffect } from 'react';
import { StarIcon, ChatBubbleBottomCenterTextIcon, UserIcon, HomeIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { supabase } from '../supabase';
import { useTranslation } from '../LanguageContext';

interface Feedback {
  id: string;
  guest_name: string;
  room_number: string;
  rating: number;
  comment: string;
  created_at: string;
}

const GuestFeedback: React.FC = () => {
  const { t } = useTranslation();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching feedback:', error);
    } else {
      setFeedbacks(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    setSubmitting(true);
    const { error } = await supabase
      .from('feedback')
      .insert([
        { guest_name: name, room_number: room, rating, comment }
      ]);

    if (error) {
      setMessage({ type: 'error', text: t('feedback_error') });
    } else {
      setMessage({ type: 'success', text: t('feedback_success') });
      setName('');
      setRoom('');
      setRating(5);
      setComment('');
      fetchFeedbacks();
      setTimeout(() => setMessage(null), 5000);
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Feedback Form */}
      <div className="bg-white border-2 border-hotel-peach/30 rounded-2xl sm:rounded-[3rem] p-5 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="p-2.5 sm:p-3 bg-hotel-peachLight text-hotel-charcoal rounded-xl sm:rounded-2xl shrink-0">
            <ChatBubbleBottomCenterTextIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-hotel-charcoal">{t('share_opinion')}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-hotel-charcoal">{t('name')}</label>
              <div className="relative">
                <UserIcon className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pr-11 pl-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-hotel-peach focus:bg-white text-base text-hotel-charcoal transition-all outline-none"
                  placeholder={t('enter_name')}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-hotel-charcoal">{t('room_number_optional')}</label>
              <div className="relative">
                <HomeIcon className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full pr-11 pl-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-hotel-peach focus:bg-white text-base text-hotel-charcoal transition-all outline-none"
                  placeholder={t('room_number')}
                />
              </div>
            </div>
          </div>

          {/* Star Rating selector with large touch targets */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-hotel-charcoal">{t('rating')}</label>
            <div className="flex gap-2 sm:gap-3 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform active:scale-90"
                  aria-label={`${star} Stars`}
                >
                  {star <= rating ? (
                    <StarIconSolid className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 drop-shadow-2xs" />
                  ) : (
                    <StarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-hotel-charcoal">{t('notes')}</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3.5 sm:p-4 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-hotel-peach focus:bg-white text-base text-hotel-charcoal transition-all outline-none min-h-[100px] sm:min-h-[120px]"
              placeholder={t('write_notes')}
              required
            />
          </div>

          {message && (
            <div className={`p-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full min-h-[48px] py-3.5 sm:py-4 bg-hotel-peach text-hotel-charcoal border border-hotel-peach/60 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base hover:bg-hotel-peachLight transition-all active:scale-[0.98] disabled:opacity-50 shadow-xs"
          >
            {submitting ? t('sending') : t('send_feedback')}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-4 sm:space-y-6">
        <h3 className="text-lg sm:text-2xl font-bold text-hotel-charcoal flex items-center gap-2 px-1">
          <span className="w-2 h-6 sm:h-8 bg-hotel-peach rounded-full"></span>
          {t('latest_reviews')}
        </h3>
        
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">{t('loading_reviews')}</div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 text-sm">{t('no_reviews')}</div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-2xs animate-slide-up">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-hotel-peachLight rounded-full flex items-center justify-center text-hotel-charcoal font-black text-sm">
                      {fb.guest_name ? fb.guest_name[0].toUpperCase() : 'G'}
                    </div>
                    <div>
                      <h4 className="font-bold text-hotel-charcoal text-sm sm:text-base">{fb.guest_name}</h4>
                      {fb.room_number && <p className="text-[11px] text-gray-400">{t('room')} {fb.room_number}</p>}
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <StarIconSolid key={i} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < fb.rating ? 'text-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-hotel-charcoal/90 leading-relaxed text-xs sm:text-sm">{fb.comment}</p>
                <p className="text-[10px] text-gray-400 mt-3 text-start">
                  {new Date(fb.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestFeedback;
