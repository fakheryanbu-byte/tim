import React, { useState, useRef, useEffect } from 'react';
import {
  CameraIcon,
  ArrowUpTrayIcon,
  IdentificationIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  ClipboardDocumentIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { useTranslation } from '../LanguageContext';
import { policiesData } from '../policiesData';

type DocumentType = 'national_id' | 'passport' | 'family_card';
type CalendarType = 'gregorian' | 'hijri';

interface Dependent {
  name: string;
  idNumber: string;
  relation: string;
}

interface GuestCheckInData {
  detectedDocumentType: string;
  fullName: string;
  firstName: string;
  secondName: string;
  middleName: string;
  lastName: string;
  idNumber: string;
  placeOfIssue: string;
  nationality: string;
  dateOfBirth: string;
  birthDateCalendar: CalendarType;
  expiryDate: string;
  phoneNumber: string;
  gender: string;
  visitReason: string;
  bookingSource: string;
  dependents: Dependent[];
}

const HOTEL_WHATSAPP_NUMBER = '966599410597';

const splitFullNameParts = (rawName: string) => {
  const parts = rawName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: '', secondName: '', middleName: '', lastName: '' };
  }
  if (parts.length === 1) {
    return { firstName: parts[0], secondName: '', middleName: '', lastName: '' };
  }
  if (parts.length === 2) {
    return { firstName: parts[0], secondName: '', middleName: '', lastName: parts[1] };
  }
  if (parts.length === 3) {
    return { firstName: parts[0], secondName: parts[1], middleName: '', lastName: parts[2] };
  }
  return {
    firstName: parts[0],
    secondName: parts[1],
    middleName: parts.slice(2, -1).join(' '),
    lastName: parts[parts.length - 1],
  };
};

const CheckInSection: React.FC = () => {
  const { t, language } = useTranslation();

  const [docType, setDocType] = useState<DocumentType>('national_id');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractStatus, setExtractStatus] = useState<'idle' | 'success' | 'warning' | 'error'>('idle');
  const [extractMessage, setExtractMessage] = useState('');

  const [formData, setFormData] = useState<GuestCheckInData>({
    detectedDocumentType: '',
    fullName: '',
    firstName: '',
    secondName: '',
    middleName: '',
    lastName: '',
    idNumber: '',
    placeOfIssue: '',
    nationality: '',
    dateOfBirth: '',
    birthDateCalendar: 'hijri',
    expiryDate: '',
    phoneNumber: '',
    gender: '',
    visitReason: '',
    bookingSource: '',
    dependents: [],
  });

  const [showAllPolicies, setShowAllPolicies] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [sentToWhatsApp, setSentToWhatsApp] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const handleSelectDocType = (nextType: DocumentType) => {
    setDocType(nextType);
    setValidationError('');
    setFormData((prev) => {
      const next: GuestCheckInData = {
        ...prev,
        detectedDocumentType: '',
      };
      if (nextType === 'family_card') {
        next.nationality = t('saudi_arabia');
        if (!prev.firstName && !prev.lastName && prev.fullName.trim()) {
          const split = splitFullNameParts(prev.fullName);
          next.firstName = split.firstName;
          next.secondName = split.secondName;
          next.middleName = split.middleName;
          next.lastName = split.lastName;
        }
      }
      return next;
    });
  };

  const getDocTypeLabel = (type: DocumentType) => {
    if (type === 'passport') return t('doc_passport');
    if (type === 'family_card') return t('doc_family_card');
    return t('doc_national_id');
  };

  const compressImageToDataUrl = (fileOrBlob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1400;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width >= height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(reader.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = reader.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(fileOrBlob);
    });
  };

  const processCapturedImage = async (dataUrl: string) => {
    setPreviewUrl(dataUrl);
    setIsExtracting(true);
    setExtractStatus('idle');
    setExtractMessage('');
    setValidationError('');

    try {
      const response = await fetch('/api/checkin/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: dataUrl,
          mimeType: 'image/jpeg',
          documentType: docType,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Extraction request failed');
      }

      const extracted = result.data || {};
      const extractedDependents: Dependent[] = Array.isArray(extracted.dependents)
        ? extracted.dependents
            .filter((d: any) => d && (d.name || d.idNumber))
            .map((d: any) => ({
              name: String(d.name || '').trim(),
              idNumber: String(d.idNumber || '').trim(),
              relation: String(d.relation || '').trim(),
            }))
        : [];

      const rawFullName = String(extracted.fullName || '').trim();
      const fallbackSplit = splitFullNameParts(rawFullName);

      const firstName = String(extracted.firstName || fallbackSplit.firstName || '').trim();
      const secondName = String(extracted.secondName || fallbackSplit.secondName || '').trim();
      const middleName = String(extracted.middleName || fallbackSplit.middleName || '').trim();
      const lastName = String(extracted.lastName || fallbackSplit.lastName || '').trim();

      const rawGender = String(extracted.gender || '').trim();
      const normalizedGender =
        rawGender === 'ذكر' || rawGender.toLowerCase() === 'male'
          ? 'ذكر'
          : rawGender === 'أنثى' || rawGender === 'انثى' || rawGender.toLowerCase() === 'female'
          ? 'أنثى'
          : '';

      const rawCal = String(extracted.birthDateCalendar || '').toLowerCase();
      const birthDateCalendar: CalendarType = rawCal === 'gregorian' ? 'gregorian' : rawCal === 'hijri' ? 'hijri' : docType === 'family_card' ? 'hijri' : 'gregorian';

      setFormData((prev) => ({
        ...prev,
        detectedDocumentType: String(extracted.detectedDocumentType || getDocTypeLabel(docType)).trim(),
        fullName: rawFullName || prev.fullName,
        firstName: firstName || prev.firstName,
        secondName: secondName || prev.secondName,
        middleName: middleName || prev.middleName,
        lastName: lastName || prev.lastName,
        idNumber: String(extracted.idNumber || prev.idNumber || '').trim(),
        placeOfIssue: String(extracted.placeOfIssue || prev.placeOfIssue || '').trim(),
        nationality:
          docType === 'family_card'
            ? t('saudi_arabia')
            : String(extracted.nationality || prev.nationality || '').trim(),
        dateOfBirth: String(extracted.dateOfBirth || prev.dateOfBirth || '').trim(),
        birthDateCalendar,
        expiryDate: String(extracted.expiryDate || prev.expiryDate || '').trim(),
        gender: normalizedGender || prev.gender,
        dependents: extractedDependents.length > 0 ? extractedDependents : prev.dependents,
      }));

      if (extracted.isReadable === false && !rawFullName && !extracted.idNumber) {
        setExtractStatus('warning');
        setExtractMessage(extracted.note || t('extract_manual_hint'));
      } else {
        setExtractStatus('success');
        setExtractMessage(t('extract_success'));
      }
    } catch (err) {
      console.error('Failed to extract document data:', err);
      setExtractStatus('error');
      setExtractMessage(t('extract_manual_hint'));
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageToDataUrl(file);
      await processCapturedImage(dataUrl);
    } catch (err) {
      console.error('Image load error:', err);
      setExtractStatus('error');
      setExtractMessage(t('extract_manual_hint'));
    } finally {
      e.target.value = '';
    }
  };

  const openLiveCameraOrFallback = async () => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile || !navigator.mediaDevices?.getUserMedia) {
      cameraInputRef.current?.click();
      return;
    }

    setCameraError('');
    setCameraModalOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraModalOpen(false);
      stopCameraStream();
      cameraInputRef.current?.click();
    }
  };

  const handleSnapFromLiveCamera = async () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      stopCameraStream();
      setCameraModalOpen(false);
      await processCapturedImage(dataUrl);
    }
  };

  const handleCloseLiveCamera = () => {
    stopCameraStream();
    setCameraModalOpen(false);
  };

  const handleAddDependent = () => {
    setFormData((prev) => ({
      ...prev,
      dependents: [...prev.dependents, { name: '', idNumber: '', relation: '' }],
    }));
  };

  const handleDependentChange = (idx: number, field: keyof Dependent, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.dependents];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, dependents: updated };
    });
  };

  const handleRemoveDependent = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      dependents: prev.dependents.filter((_, i) => i !== idx),
    }));
  };

  const getCombinedFamilyName = () => {
    return [
      formData.firstName.trim(),
      formData.secondName.trim(),
      formData.middleName.trim(),
      formData.lastName.trim(),
    ]
      .filter(Boolean)
      .join(' ');
  };

  const getMissingFields = (): string[] => {
    const missing: string[] = [];

    if (docType === 'family_card') {
      if (!formData.firstName.trim()) missing.push(t('field_first_name'));
      if (!formData.secondName.trim()) missing.push(t('field_second_name'));
      if (!formData.middleName.trim()) missing.push(t('field_middle_name'));
      if (!formData.lastName.trim()) missing.push(t('field_last_name'));
      if (!(formData.nationality || t('saudi_arabia')).trim()) missing.push(t('field_nationality'));
      if (!formData.idNumber.trim()) missing.push(t('field_family_book_number'));
      if (!formData.placeOfIssue.trim()) missing.push(t('field_place_of_issue'));
      if (!formData.expiryDate.trim()) missing.push(t('field_expiry'));
      if (!formData.dateOfBirth.trim()) missing.push(t('field_dob'));
      if (!formData.phoneNumber.trim()) missing.push(t('field_phone_required'));
      if (!formData.gender.trim()) missing.push(t('field_gender'));
    } else {
      if (!(formData.detectedDocumentType || getDocTypeLabel(docType)).trim()) missing.push(t('field_doc_type'));
      if (!formData.fullName.trim()) missing.push(t('field_full_name'));
      if (!formData.idNumber.trim()) missing.push(t('field_id_number'));
      if (!formData.nationality.trim()) missing.push(t('field_nationality'));
      if (!formData.dateOfBirth.trim()) missing.push(t('field_dob'));
      if (!formData.expiryDate.trim()) missing.push(t('field_expiry'));
      if (!formData.phoneNumber.trim()) missing.push(t('field_phone'));
    }

    if (!formData.visitReason.trim()) missing.push(t('field_visit_reason'));
    if (!formData.bookingSource.trim()) missing.push(t('field_booking_source'));

    return missing;
  };

  const isStep2Complete = () => {
    return getMissingFields().length === 0;
  };

  const validateBeforeSend = (): boolean => {
    setAttemptedSubmit(true);
    const missing = getMissingFields();
    if (missing.length > 0 || !agreed) {
      const baseMsg = docType === 'family_card' ? t('checkin_family_validation_error') : t('checkin_validation_error');
      const details = missing.length > 0 ? ` (${t('checkin_missing_fields_prefix')} ${missing.join('، ')})` : '';
      setValidationError(`${baseMsg}${details}`);
      return false;
    }
    return true;
  };

  const inputErrorClass = (isMissing: boolean) =>
    attemptedSubmit && isMissing
      ? 'border-red-400 bg-red-50/40 focus:border-red-500'
      : 'border-hotel-peach/40 bg-hotel-cream/70 focus:border-hotel-peach focus:bg-white';

  const familyNameInputErrorClass = (isMissing: boolean) =>
    attemptedSubmit && isMissing
      ? 'border-red-400 bg-red-50/40 focus:border-red-500'
      : 'border-hotel-peach/40 bg-white focus:border-hotel-peach';

  const buildWhatsAppMessage = () => {
    const docLabel = formData.detectedDocumentType || getDocTypeLabel(docType);
    const lines: string[] = [
      '🏨 *طلب تسجيل دخول - فندق تيم*',
      '',
      '📋 *البيانات الملتقطة:*',
      `• نوع الوثيقة: ${docLabel}`,
    ];

    if (docType === 'family_card') {
      const combinedName = getCombinedFamilyName();
      lines.push(`• الاسم كامل: ${combinedName}`);
      lines.push(`  - الإسم الأول: ${formData.firstName.trim()}`);
      if (formData.secondName.trim()) {
        lines.push(`  - الإسم الثاني: ${formData.secondName.trim()}`);
      }
      if (formData.middleName.trim()) {
        lines.push(`  - الإسم الأوسط: ${formData.middleName.trim()}`);
      }
      lines.push(`  - الإسم الأخير: ${formData.lastName.trim()}`);
      lines.push(`• الجنسية: ${formData.nationality.trim() || 'المملكة العربية السعودية'}`);
      lines.push(`• رقم دفتر العائلة: ${formData.idNumber.trim()}`);
      lines.push(`• مكان الإصدار: ${formData.placeOfIssue.trim()}`);
      lines.push(`• تاريخ الانتهاء: ${formData.expiryDate.trim()}`);
      lines.push(
        `• تاريخ الميلاد: ${formData.dateOfBirth.trim()} (${
          formData.birthDateCalendar === 'hijri' ? 'هجري' : 'ميلادي'
        })`
      );
      lines.push(`• رقم الجوال: ${formData.phoneNumber.trim()}`);
      lines.push(`• الجنس: ${formData.gender.trim()}`);
    } else {
      lines.push(`• الاسم الكامل: ${formData.fullName.trim()}`);
      lines.push(`• رقم الهوية / الجواز: ${formData.idNumber.trim()}`);
      if (formData.nationality.trim()) {
        lines.push(`• الجنسية: ${formData.nationality.trim()}`);
      }
      if (formData.dateOfBirth.trim()) {
        lines.push(`• تاريخ الميلاد: ${formData.dateOfBirth.trim()}`);
      }
      if (formData.expiryDate.trim()) {
        lines.push(`• تاريخ الانتهاء: ${formData.expiryDate.trim()}`);
      }
      if (formData.phoneNumber.trim()) {
        lines.push(`• رقم الجوال: ${formData.phoneNumber.trim()}`);
      }
    }

    const visitReasonArabicMap: Record<string, string> = {
      tourism: 'سياحة',
      religious: 'ديني',
      business: 'عمل',
      sports: 'رياضي',
      entertainment: 'ترفيه',
      other: 'أخرى',
    };
    const bookingSourceArabicMap: Record<string, string> = {
      booking: 'بوكينج',
      reception: 'استقبال',
    };

    if (formData.visitReason) {
      lines.push(`• سبب الزيارة: ${visitReasonArabicMap[formData.visitReason] || formData.visitReason}`);
    }
    if (formData.bookingSource) {
      lines.push(`• مصدر الحجز: ${bookingSourceArabicMap[formData.bookingSource] || formData.bookingSource}`);
    }

    const validDependents = formData.dependents.filter((d) => d.name.trim() || d.idNumber.trim());
    if (validDependents.length > 0) {
      lines.push('');
      lines.push('👨‍👩‍👧‍👦 *أفراد العائلة / المرافقون:*');
      validDependents.forEach((d, idx) => {
        const details = [d.name.trim(), d.idNumber.trim() ? `هوية: ${d.idNumber.trim()}` : '', d.relation.trim()]
          .filter(Boolean)
          .join(' - ');
        lines.push(`${idx + 1}. ${details}`);
      });
    }

    lines.push('');
    lines.push('📜 *شروط الحجز والإقرار:*');
    lines.push(
      'اطلعت على شروط العقد وسياسات الفندق وانا موافق على مافيها من بنود ، واقر بصحة المعلومات المرسلة من جوالي إلى جوال الفندق'
    );

    return lines.join('\n');
  };

  const handleSendWhatsApp = () => {
    if (!validateBeforeSend()) return;

    setValidationError('');
    const message = buildWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    setSentToWhatsApp(true);
    window.location.href = `https://wa.me/${HOTEL_WHATSAPP_NUMBER}?text=${encoded}`;
  };

  const handleCopyMessage = () => {
    if (!validateBeforeSend()) return;
    setValidationError('');
    navigator.clipboard.writeText(buildWhatsAppMessage());
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2500);
  };

  const keyBookingPolicies = policiesData.filter((p) => [1, 2, 3, 5, 10, 11].includes(p.id));
  const displayedPolicies = showAllPolicies ? policiesData : keyBookingPolicies;

  return (
    <section id="checkin" className="my-8 sm:my-10 animate-slide-up">
      <div className="bg-hotel-cream border-2 border-hotel-peach/45 rounded-2xl sm:rounded-[3rem] p-5 sm:p-8 shadow-sm">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-5 border-b border-hotel-peach/25">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <div className="p-3 bg-hotel-peach text-hotel-charcoal rounded-2xl shrink-0 shadow-xs border border-hotel-peach/60">
              <IdentificationIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-hotel-charcoal">{t('checkin_title')}</h2>
              <p className="text-xs sm:text-sm text-hotel-charcoal/75 font-medium mt-1 leading-relaxed">
                {t('checkin_subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* 3-Step Visual Progress Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-6 sm:mb-8">
          <div
            className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
              previewUrl
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-hotel-peachLight border-hotel-peach/50 text-hotel-charcoal'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center font-black shrink-0 text-xs">
              1
            </span>
            <span className="truncate">{t('checkin_step_1')}</span>
          </div>
          <div
            className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
              isStep2Complete()
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-white/80 border-hotel-peach/30 text-hotel-charcoal/80'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-hotel-peachLight flex items-center justify-center font-black shrink-0 text-xs">
              2
            </span>
            <span className="truncate">{t('checkin_step_2')}</span>
          </div>
          <div
            className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
              agreed
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-white/80 border-hotel-peach/30 text-hotel-charcoal/80'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-hotel-peachLight flex items-center justify-center font-black shrink-0 text-xs">
              3
            </span>
            <span className="truncate">{t('checkin_step_3')}</span>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* STEP 1: Document Type Selection & Photo Capture */}
          <div className="bg-white/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-hotel-peach/30 shadow-2xs space-y-5">
            <div>
              <label className="block text-sm sm:text-base font-black text-hotel-charcoal mb-3">
                {t('doc_type_label')}
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {(
                  [
                    { id: 'national_id', label: t('doc_national_id'), emoji: '🪪' },
                    { id: 'passport', label: t('doc_passport'), emoji: '🛂' },
                    { id: 'family_card', label: t('doc_family_card'), emoji: '👨‍👩‍👧‍👦' },
                  ] as const
                ).map((item) => {
                  const active = docType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectDocType(item.id)}
                      className={`min-h-[52px] px-2 sm:px-4 py-2.5 rounded-xl sm:rounded-2xl border-2 font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 transition-all active:scale-95 ${
                        active
                          ? 'bg-hotel-peach text-hotel-charcoal border-hotel-peach shadow-xs font-black'
                          : 'bg-hotel-cream/70 text-hotel-charcoal/80 border-hotel-peach/25 hover:border-hotel-peach/60'
                      }`}
                    >
                      <span className="text-lg sm:text-xl leading-none">{item.emoji}</span>
                      <span className="text-center leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hidden file inputs for Camera Capture and File Upload */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Capture / Preview Area */}
            {!previewUrl ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={openLiveCameraOrFallback}
                  className="min-h-[56px] bg-hotel-peach hover:bg-hotel-peachLight text-hotel-charcoal font-black px-5 py-3.5 rounded-2xl border border-hotel-peach/70 shadow-xs flex items-center justify-center gap-2.5 transition-all active:scale-95 text-sm sm:text-base"
                >
                  <CameraIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  <span>{t('capture_camera')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[56px] bg-hotel-peachLight hover:bg-hotel-peach/40 text-hotel-charcoal font-bold px-5 py-3.5 rounded-2xl border border-hotel-peach/50 flex items-center justify-center gap-2.5 transition-all active:scale-95 text-sm sm:text-base"
                >
                  <ArrowUpTrayIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  <span>{t('upload_photo')}</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3 sm:p-4 bg-hotel-cream rounded-2xl border border-hotel-peach/30">
                <div className="w-full sm:w-44 h-32 rounded-xl overflow-hidden bg-white border border-hotel-peach/30 shrink-0 flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt={getDocTypeLabel(docType)}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 w-full space-y-3 text-start">
                  {isExtracting ? (
                    <div className="flex items-center gap-2.5 text-hotel-charcoal font-bold text-sm">
                      <ArrowPathIcon className="w-5 h-5 animate-spin text-amber-600 shrink-0" />
                      <span>{t('extracting_data')}</span>
                    </div>
                  ) : (
                    extractMessage && (
                      <div
                        className={`flex items-start gap-2 text-xs sm:text-sm font-bold p-3 rounded-xl border ${
                          extractStatus === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {extractStatus === 'success' ? (
                          <CheckCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                        ) : (
                          <ExclamationCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                        )}
                        <span>{extractMessage}</span>
                      </div>
                    )
                  )}

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={openLiveCameraOrFallback}
                      disabled={isExtracting}
                      className="min-h-[42px] px-4 py-2 bg-hotel-peach hover:bg-hotel-peachLight text-hotel-charcoal rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 border border-hotel-peach/60 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <CameraIcon className="w-4 h-4" />
                      <span>{t('retake_photo')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isExtracting}
                      className="min-h-[42px] px-4 py-2 bg-white hover:bg-hotel-peachLight text-hotel-charcoal rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 border border-hotel-peach/40 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <ArrowUpTrayIcon className="w-4 h-4" />
                      <span>{t('upload_photo')}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: Captured / Editable Guest Information */}
          <div className="bg-white/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-hotel-peach/30 shadow-2xs space-y-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <DocumentCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-hotel-charcoal shrink-0" />
                <h3 className="text-base sm:text-xl font-black text-hotel-charcoal">{t('checkin_step_2')}</h3>
              </div>
              {isExtracting && (
                <span className="text-xs font-bold text-amber-700 animate-pulse">{t('extracting_data')}</span>
              )}
            </div>

            {docType === 'family_card' ? (
              /* Family Book (Citizen) Dedicated Form Layout */
              <div className="space-y-4">
                {/* Split Full Name into 4 fields */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-hotel-cream/60 border border-hotel-peach/30 space-y-3">
                  <label className="block text-xs sm:text-sm font-black text-hotel-charcoal">
                    {t('field_full_name_split')} <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-hotel-charcoal/80 mb-1">
                        {t('field_first_name')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder={t('field_first_name')}
                        className={`w-full min-h-[44px] px-3 py-2 rounded-xl border text-hotel-charcoal font-bold text-sm focus:outline-none ${familyNameInputErrorClass(!formData.firstName.trim())}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-hotel-charcoal/80 mb-1">
                        {t('field_second_name')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.secondName}
                        onChange={(e) => setFormData({ ...formData, secondName: e.target.value })}
                        placeholder={t('field_second_name')}
                        className={`w-full min-h-[44px] px-3 py-2 rounded-xl border text-hotel-charcoal font-bold text-sm focus:outline-none ${familyNameInputErrorClass(!formData.secondName.trim())}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-hotel-charcoal/80 mb-1">
                        {t('field_middle_name')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.middleName}
                        onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                        placeholder={t('field_middle_name')}
                        className={`w-full min-h-[44px] px-3 py-2 rounded-xl border text-hotel-charcoal font-bold text-sm focus:outline-none ${familyNameInputErrorClass(!formData.middleName.trim())}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-hotel-charcoal/80 mb-1">
                        {t('field_last_name')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder={t('field_last_name')}
                        className={`w-full min-h-[44px] px-3 py-2 rounded-xl border text-hotel-charcoal font-bold text-sm focus:outline-none ${familyNameInputErrorClass(!formData.lastName.trim())}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Core Family Book Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Nationality pre-set to Saudi Arabia */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-hotel-charcoal/85 mb-1.5">
                      {t('field_nationality')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nationality || t('saudi_arabia')}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-hotel-peachLight/50 border border-hotel-peach/50 text-hotel-charcoal font-black text-sm focus:outline-none focus:border-hotel-peach focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Family Book Number */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-hotel-charcoal/85 mb-1.5">
                      {t('field_family_book_number')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.idNumber}
                      onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                      dir="ltr"
                      placeholder="10xxxxxxxx"
                      className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-hotel-charcoal font-bold text-sm text-start tabular-nums focus:outline-none transition-colors ${inputErrorClass(!formData.idNumber.trim())}`}
                    />
                  </div>

                  {/* Place of Issue */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-hotel-charcoal/85 mb-1.5">
                      {t('field_place_of_issue')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.placeOfIssue}
                      onChange={(e) => setFormData({ ...formData, placeOfIssue: e.target.value })}
                      placeholder={t('riyadh')}
                      className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-hotel-charcoal font-bold text-sm focus:outline-none transition-colors ${inputErrorClass(!formData.placeOfIssue.trim())}`}
                    />
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-hotel-charcoal/85 mb-1.5">
                      {t('field_expiry')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      placeholder="YYYY/MM/DD"
                      className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-hotel-charcoal font-bold text-sm tabular-nums focus:outline-none transition-colors ${inputErrorClass(!formData.expiryDate.trim())}`}
                    />
                  </div>

                  {/* Date of Birth (Gregorian or Hijri) */}
                  <div className="sm:col-span-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <label className="text-xs sm:text-sm font-bold text-hotel-charcoal/85">
                        {t('field_dob')} <span className="text-red-500">*</span>{' '}
                        <span className="text-[11px] text-hotel-grey font-medium">({t('field_dob_hint')})</span>
                      </label>
                      <div className="inline-flex rounded-xl bg-hotel-cream p-1 border border-hotel-peach/40">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, birthDateCalendar: 'hijri' })}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                            formData.birthDateCalendar === 'hijri'
                              ? 'bg-hotel-peach text-hotel-charcoal font-black'
                              : 'text-hotel-charcoal/70 hover:text-hotel-charcoal'
                          }`}
                        >
                          {t('calendar_hijri')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, birthDateCalendar: 'gregorian' })}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                            formData.birthDateCalendar === 'gregorian'
                              ? 'bg-hotel-peach text-hotel-charcoal font-black'
                              : 'text-hotel-charcoal/70 hover:text-hotel-charcoal'
                          }`}
                        >
                          {t('calendar_gregorian')}
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      placeholder={formData.birthDateCalendar === 'hijri' ? '1410/05/12' : '1990/01/15'}
                      className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-hotel-charcoal font-bold text-sm tabular-nums focus:outline-none transition-colors ${inputErrorClass(!formData.dateOfBirth.trim())}`}
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-hotel-charcoal/85 mb-1.5">
                      {t('field_phone_required')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      dir="ltr"
                      placeholder="05xxxxxxxx"
                      className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-hotel-charcoal font-bold text-sm text-start tabular-nums focus:outline-none transition-colors ${inputErrorClass(!formData.phoneNumber.trim())}`}
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-hotel-charcoal/85 mb-1.5">
                      {t('field_gender')} <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { value: 'ذكر', label: t('gender_male') },
                        { value: 'أنثى', label: t('gender_female') },
                      ].map((opt) => {
                        const selected = formData.gender === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, gender: opt.value })}
                            className={`min-h-[44px] rounded-xl border-2 font-bold text-sm transition-all ${
                              selected
                                ? 'bg-hotel-peach text-hotel-charcoal border-hotel-peach font-black shadow-2xs'
                                : attemptedSubmit && !formData.gender.trim()
                                ? 'bg-red-50/50 text-hotel-charcoal border-red-400'
                                : 'bg-hotel-cream/70 text-hotel-charcoal/80 border-hotel-peach/30 hover:border-hotel-peach/70'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* National ID / Iqama / Passport Form Layout */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-hotel-charcoal/85 mb-1.5">
                    {t('field_doc_type')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.detectedDocumentType || getDocTypeLabel(docType)}
                    onChange={(e) => setFormData({ ...formData, detectedDocumentType: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-hotel-cream/70 border border-hotel-peach/40 text-hotel-charcoal font-bold text-sm focus:outline-none focus:border-hotel-peach focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-hotel-charcoal/85 mb-1.5">
                    {t('field_full_name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={t('enter_name')}
                    className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-hotel-charcoal font-bold text-sm focus:outline-none transition-colors ${inputErrorClass(!formData.fullName.trim())}`}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-hotel-charcoal/85 mb-1.5">
                    {t('field_id_number')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    dir="ltr"
                    placeholder="10xxxxxxxx / Axxxxxxxx"
                    className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-hotel-charcoal font-bold text-sm text-start tabular-nums focus:outline-none transition-colors ${inputErrorClass(!formData.idNumber.trim())}`}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-hotel-charcoal/85 mb-1.5">
                    {t('field_nationality')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-hotel-charcoal font-bold text-sm focus:outline-none transition-colors ${inputErrorClass(!formData.nationality.trim())}`}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-hotel-charcoal/85 mb-1.5">
                    {t('field_dob')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    placeholder="YYYY/MM/DD"
                    className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-hotel-charcoal font-bold text-sm tabular-nums focus:outline-none transition-colors ${inputErrorClass(!formData.dateOfBirth.trim())}`}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-hotel-charcoal/85 mb-1.5">
                    {t('field_expiry')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    placeholder="YYYY/MM/DD"
                    className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-hotel-charcoal font-bold text-sm tabular-nums focus:outline-none transition-colors ${inputErrorClass(!formData.expiryDate.trim())}`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-bold text-hotel-charcoal/85 mb-1.5">
                    {t('field_phone')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    dir="ltr"
                    placeholder="05xxxxxxxx"
                    className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-hotel-charcoal font-bold text-sm text-start tabular-nums focus:outline-none transition-colors ${inputErrorClass(!formData.phoneNumber.trim())}`}
                  />
                </div>
              </div>
            )}

            {/* Visit Reason Dropdown & Booking Source (Mandatory) */}
            <div className="pt-4 mt-2 border-t border-hotel-peach/25 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-hotel-charcoal/85 mb-1.5">
                  {t('field_visit_reason')} <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.visitReason}
                  onChange={(e) => setFormData({ ...formData, visitReason: e.target.value })}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-hotel-charcoal font-bold text-sm focus:outline-none transition-colors cursor-pointer ${inputErrorClass(!formData.visitReason.trim())}`}
                >
                  <option value="">{t('select_visit_reason')}</option>
                  <option value="tourism">{t('visit_tourism')}</option>
                  <option value="religious">{t('visit_religious')}</option>
                  <option value="business">{t('visit_business')}</option>
                  <option value="sports">{t('visit_sports')}</option>
                  <option value="entertainment">{t('visit_entertainment')}</option>
                  <option value="other">{t('visit_other')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-hotel-charcoal/85 mb-1.5">
                  {t('field_booking_source')} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { value: 'booking', label: t('source_booking') },
                    { value: 'reception', label: t('source_reception') },
                  ].map((opt) => {
                    const selected = formData.bookingSource === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, bookingSource: opt.value })}
                        className={`min-h-[44px] rounded-xl border-2 font-bold text-sm transition-all ${
                          selected
                            ? 'bg-hotel-peach text-hotel-charcoal border-hotel-peach font-black shadow-2xs'
                            : attemptedSubmit && !formData.bookingSource.trim()
                            ? 'bg-red-50/50 text-hotel-charcoal border-red-400'
                            : 'bg-hotel-cream/70 text-hotel-charcoal/80 border-hotel-peach/30 hover:border-hotel-peach/70'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Family Book Dependents */}
            {(docType === 'family_card' || formData.dependents.length > 0) && (
              <div className="pt-4 mt-4 border-t border-hotel-peach/25 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-black text-hotel-charcoal">{t('dependents_title')}</h4>
                  <button
                    type="button"
                    onClick={handleAddDependent}
                    className="px-3 py-1.5 rounded-xl bg-hotel-peachLight hover:bg-hotel-peach text-hotel-charcoal font-bold text-xs flex items-center gap-1 border border-hotel-peach/40 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>{t('add_dependent')}</span>
                  </button>
                </div>

                {formData.dependents.map((dep, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-hotel-cream/60 p-2.5 rounded-xl border border-hotel-peach/20"
                  >
                    <input
                      type="text"
                      value={dep.name}
                      onChange={(e) => handleDependentChange(idx, 'name', e.target.value)}
                      placeholder={t('dependent_name')}
                      className="sm:col-span-5 min-h-[40px] px-3 py-1.5 rounded-lg bg-white border border-hotel-peach/30 text-xs sm:text-sm font-bold text-hotel-charcoal"
                    />
                    <input
                      type="text"
                      value={dep.idNumber}
                      onChange={(e) => handleDependentChange(idx, 'idNumber', e.target.value)}
                      placeholder={t('dependent_id')}
                      className="sm:col-span-4 min-h-[40px] px-3 py-1.5 rounded-lg bg-white border border-hotel-peach/30 text-xs sm:text-sm font-bold text-hotel-charcoal tabular-nums"
                    />
                    <input
                      type="text"
                      value={dep.relation}
                      onChange={(e) => handleDependentChange(idx, 'relation', e.target.value)}
                      placeholder={t('dependent_relation')}
                      className="sm:col-span-2 min-h-[40px] px-3 py-1.5 rounded-lg bg-white border border-hotel-peach/30 text-xs sm:text-sm font-bold text-hotel-charcoal"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveDependent(idx)}
                      className="sm:col-span-1 min-h-[40px] flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove dependent"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STEP 3: Booking Terms, Policies, Acknowledgment & WhatsApp Send */}
          <div className="bg-hotel-peachLight/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-hotel-peach/50 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-hotel-charcoal shrink-0" />
                <h3 className="text-base sm:text-xl font-black text-hotel-charcoal">{t('booking_terms_title')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAllPolicies(!showAllPolicies)}
                className="text-xs sm:text-sm font-extrabold text-hotel-charcoal bg-white px-3.5 py-1.5 rounded-xl border border-hotel-peach/50 hover:bg-hotel-cream flex items-center gap-1.5 transition-colors"
              >
                <span>{showAllPolicies ? t('hide_all_policies') : t('show_all_policies')}</span>
                {showAllPolicies ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto bg-white/95 rounded-2xl p-3.5 sm:p-4 border border-hotel-peach/30 space-y-2.5 text-xs sm:text-sm">
              {displayedPolicies.map((policy) => {
                const langKey = (language as keyof typeof policy) || 'ar';
                const text = policy[langKey] || policy.ar;
                return (
                  <div
                    key={policy.id}
                    className="flex items-start gap-2.5 pb-2 border-b border-hotel-peach/15 last:border-0 last:pb-0"
                  >
                    <span className="w-6 h-6 rounded-full bg-hotel-peachLight text-hotel-charcoal font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {policy.id}
                    </span>
                    <p className="text-hotel-charcoal/90 font-medium leading-relaxed">{text}</p>
                  </div>
                );
              })}
            </div>

            {/* Required Acknowledgment Checkbox */}
            <label
              className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-colors select-none ${
                attemptedSubmit && !agreed
                  ? 'bg-red-50/50 border-red-400'
                  : 'bg-white border-hotel-peach/60 hover:border-hotel-peach'
              }`}
            >
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  if (e.target.checked) setValidationError('');
                }}
                className="mt-1 w-5 h-5 rounded accent-emerald-600 shrink-0 cursor-pointer"
              />
              <span className="text-xs sm:text-sm font-black text-hotel-charcoal leading-relaxed">
                {t('checkin_agree_label')} <span className="text-red-500">*</span>
              </span>
            </label>

            {validationError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-bold flex items-center gap-2">
                <ExclamationCircleIcon className="w-5 h-5 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="flex-1 min-h-[52px] bg-[#25D366] hover:bg-[#1ebd5a] text-white font-black px-5 py-3.5 rounded-2xl shadow-sm flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] text-sm sm:text-base"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                <span>{t('send_checkin_whatsapp')}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="min-h-[52px] bg-white hover:bg-hotel-cream text-hotel-charcoal font-bold px-5 py-3.5 rounded-2xl border border-hotel-peach/60 flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-xs sm:text-sm"
              >
                <ClipboardDocumentIcon className="w-5 h-5 shrink-0" />
                <span>{copiedMsg ? t('checkin_msg_copied') : t('copy_checkin_msg')}</span>
              </button>
            </div>

            {sentToWhatsApp && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{t('whatsapp_photo_note')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Camera Capture Modal (Desktop / Supported Browsers) */}
      {cameraModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-hotel-cream w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border-2 border-hotel-peach/50">
            <div className="px-5 py-4 bg-hotel-peachLight flex items-center justify-between border-b border-hotel-peach/30">
              <h3 className="font-black text-hotel-charcoal text-base sm:text-lg">{t('capture_camera')}</h3>
              <button
                type="button"
                onClick={handleCloseLiveCamera}
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-hotel-charcoal hover:bg-hotel-peach transition-colors"
                aria-label={t('camera_cancel_btn')}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-4 border-2 border-dashed border-hotel-peach/80 rounded-xl pointer-events-none" />
              </div>

              {cameraError ? (
                <p className="text-xs text-red-600 font-bold text-center">{cameraError}</p>
              ) : (
                <p className="text-xs sm:text-sm text-hotel-charcoal/80 font-bold text-center">
                  {t('camera_hint')}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSnapFromLiveCamera}
                  className="flex-1 min-h-[48px] bg-hotel-peach hover:bg-hotel-peachLight text-hotel-charcoal font-black rounded-2xl flex items-center justify-center gap-2 border border-hotel-peach/70"
                >
                  <CameraIcon className="w-5 h-5" />
                  <span>{t('camera_capture_btn')}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCloseLiveCamera}
                  className="min-h-[48px] px-5 bg-white text-hotel-charcoal font-bold rounded-2xl border border-hotel-peach/40"
                >
                  {t('camera_cancel_btn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CheckInSection;
