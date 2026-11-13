import React, { useState, useRef, useEffect } from 'react';
import {
  CameraIcon,
  ArrowUpTrayIcon,
  IdentificationIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardDocumentIcon,
  ExclamationCircleIcon,
  SparklesIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { useTranslation } from '../LanguageContext';
import { policiesData } from '../policiesData';

type DocChoice = 'national_id' | 'passport' | 'family_card';

interface DependentMember {
  name: string;
  idNumber: string;
  relation: string;
}

interface ExtractedData {
  documentType: string;
  fullName: string;
  idNumber: string;
  nationality: string;
  dateOfBirth: string;
  expiryDate: string;
  issuePlace: string;
  phone: string;
  dependents: DependentMember[];
}

const initialFormState: ExtractedData = {
  documentType: 'الهوية الوطنية / الإقامة',
  fullName: '',
  idNumber: '',
  nationality: '',
  dateOfBirth: '',
  expiryDate: '',
  issuePlace: '',
  phone: '',
  dependents: [],
};

const GuestCheckIn: React.FC = () => {
  const { t, language, isRtl } = useTranslation();

  const [docChoice, setDocChoice] = useState<DocChoice>('national_id');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractStatus, setExtractStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [extractMessage, setExtractMessage] = useState('');
  const [formData, setFormData] = useState<ExtractedData>(initialFormState);

  const [showAllPolicies, setShowAllPolicies] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [copiedMsg, setCopiedMsg] = useState(false);

  // Live Camera Modal state
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mobileCameraInputRef = useRef<HTMLInputElement | null>(null);

  const docLabels: Record<DocChoice, string> = {
    national_id: t('doc_national_id'),
    passport: t('doc_passport'),
    family_card: t('doc_family_card'),
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  };

  const handleSelectDocChoice = (choice: DocChoice) => {
    setDocChoice(choice);
    const arabicDefaultMap: Record<DocChoice, string> = {
      national_id: 'بطاقة هوية وطنية / إقامة',
      passport: 'جواز سفر',
      family_card: 'كرت عائلة',
    };
    setFormData((prev) => ({
      ...prev,
      documentType: prev.fullName ? prev.documentType : arabicDefaultMap[choice],
    }));
  };

  const compressImageToBase64 = (source: HTMLImageElement | HTMLVideoElement, maxDim = 1600): { dataUrl: string; base64: string; mimeType: string } => {
    const srcWidth = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
    const srcHeight = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;

    let targetWidth = srcWidth || 1280;
    let targetHeight = srcHeight || 720;

    if (targetWidth > maxDim || targetHeight > maxDim) {
      if (targetWidth >= targetHeight) {
        targetHeight = Math.round((targetHeight * maxDim) / targetWidth);
        targetWidth = maxDim;
      } else {
        targetWidth = Math.round((targetWidth * maxDim) / targetHeight);
        targetHeight = maxDim;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(source, 0, 0, targetWidth, targetHeight);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    const base64 = dataUrl.split(',')[1] || '';
    return { dataUrl, base64, mimeType: 'image/jpeg' };
  };

  const extractDocumentData = async (base64: string, mimeType: string) => {
    setExtracting(true);
    setExtractStatus('idle');
    setExtractMessage('');
    setValidationError('');

    try {
      const response = await fetch('/api/checkin/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
          documentType: docChoice,
        }),
      });

      const result = await response.json();

      if (!response.ok || result?.error) {
        throw new Error(result?.error || 'Failed to read document');
      }

      const data = result.data || {};
      const parsedDependents: DependentMember[] = Array.isArray(data.dependents)
        ? data.dependents
            .filter((d: unknown) => d && typeof d === 'object')
            .map((d: any) => ({
              name: String(d.name || '').trim(),
              idNumber: String(d.idNumber || '').trim(),
              relation: String(d.relation || '').trim(),
            }))
            .filter((d: DependentMember) => d.name || d.idNumber)
        : [];

      const detectedType = data.detectedDocumentType || data.documentType;
      const noteText = data.note || data.confidenceNote;

      setFormData((prev) => ({
        ...prev,
        documentType: detectedType ? String(detectedType).trim() : prev.documentType,
        fullName: data.fullName ? String(data.fullName).trim() : prev.fullName,
        idNumber: data.idNumber ? String(data.idNumber).trim() : prev.idNumber,
        nationality: data.nationality ? String(data.nationality).trim() : prev.nationality,
        dateOfBirth: data.dateOfBirth ? String(data.dateOfBirth).trim() : prev.dateOfBirth,
        expiryDate: data.expiryDate ? String(data.expiryDate).trim() : prev.expiryDate,
        issuePlace: data.issuePlace ? String(data.issuePlace).trim() : prev.issuePlace,
        dependents: parsedDependents.length > 0 ? parsedDependents : prev.dependents,
      }));

      setExtractStatus('success');
      setExtractMessage(
        noteText
          ? `${t('extract_success')} (${noteText})`
          : t('extract_success')
      );
    } catch (err: unknown) {
      console.error('Document extraction error:', err);
      setExtractStatus('error');
      setExtractMessage(t('extract_manual_hint'));
    } finally {
      setExtracting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const resultUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const { dataUrl, base64, mimeType } = compressImageToBase64(img);
        setPreviewUrl(dataUrl);
        extractDocumentData(base64, mimeType);
      };
      img.src = resultUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const openCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      mobileCameraInputRef.current?.click();
      return;
    }

    try {
      setCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraReady(true);
        };
      }
    } catch {
      setCameraOpen(false);
      stopCameraStream();
      mobileCameraInputRef.current?.click();
    }
  };

  const captureFromCamera = () => {
    if (!videoRef.current || !cameraReady) return;
    const { dataUrl, base64, mimeType } = compressImageToBase64(videoRef.current);
    setPreviewUrl(dataUrl);
    setCameraOpen(false);
    stopCameraStream();
    extractDocumentData(base64, mimeType);
  };

  const closeCamera = () => {
    setCameraOpen(false);
    stopCameraStream();
  };

  const handleFieldChange = (field: keyof Omit<ExtractedData, 'dependents'>, value: string) => {
    setValidationError('');
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addDependent = () => {
    setFormData((prev) => ({
      ...prev,
      dependents: [...prev.dependents, { name: '', idNumber: '', relation: '' }],
    }));
  };

  const updateDependent = (index: number, field: keyof DependentMember, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.dependents];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, dependents: updated };
    });
  };

  const removeDependent = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dependents: prev.dependents.filter((_, idx) => idx !== index),
    }));
  };

  const buildWhatsAppMessage = () => {
    const dependentsLines = formData.dependents
      .filter((d) => d.name.trim() || d.idNumber.trim())
      .map((d, idx) => {
        const parts = [
          `${idx + 1}. ${d.name.trim() || '-'}`,
          d.idNumber.trim() ? `رقم الهوية: ${d.idNumber.trim()}` : '',
          d.relation.trim() ? `(${d.relation.trim()})` : '',
        ].filter(Boolean);
        return parts.join(' - ');
      });

    const lines = [
      '🏨 *تسجيل دخول جديد - فندق تيم*',
      '',
      `*نوع الوثيقة:* ${formData.documentType || docLabels[docChoice]}`,
      `*الاسم الكامل:* ${formData.fullName.trim()}`,
      `*رقم الوثيقة:* ${formData.idNumber.trim()}`,
      formData.nationality.trim() ? `*الجنسية:* ${formData.nationality.trim()}` : '',
      formData.dateOfBirth.trim() ? `*تاريخ الميلاد:* ${formData.dateOfBirth.trim()}` : '',
      formData.expiryDate.trim() ? `*تاريخ الانتهاء:* ${formData.expiryDate.trim()}` : '',
      formData.phone.trim() ? `*رقم الجوال:* ${formData.phone.trim()}` : '',
      ...(dependentsLines.length > 0 ? ['', '*أفراد الأسرة المرافقون:*', ...dependentsLines] : []),
      '',
      '✅ *الإقرار والموافقة:*',
      'اطلعت على شروط العقد وسياسات الفندق وانا موافق على مافيها من بنود ، واقر بصحة المعلومات المرسلة من جوالي إلى جوال الفندق',
    ];

    return lines.filter((line, idx, arr) => {
      if (line !== '') return true;
      return idx > 0 && arr[idx - 1] !== '';
    }).join('\n');
  };

  const isReadyToSend =
    formData.fullName.trim().length > 0 &&
    formData.idNumber.trim().length > 0 &&
    agreedToTerms;

  const whatsappUrl = `https://wa.me/966599410597?text=${encodeURIComponent(buildWhatsAppMessage())}`;

  const handleInvalidClick = () => {
    setValidationError(t('checkin_validation_error'));
  };

  const handleCopyMessage = () => {
    if (!isReadyToSend) {
      setValidationError(t('checkin_validation_error'));
      return;
    }
    navigator.clipboard.writeText(buildWhatsAppMessage());
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2500);
  };

  const highlightPolicies = policiesData.filter((p) => [1, 3, 5, 6, 10, 11].includes(p.id));
  const displayedPolicies = showAllPolicies ? policiesData : highlightPolicies;

  return (
    <section
      id="checkin"
      className="my-8 sm:my-10 animate-slide-up bg-gradient-to-br from-white via-hotel-cream to-hotel-peachLight/60 border-2 border-hotel-peach/50 rounded-2xl sm:rounded-[3rem] p-5 sm:p-8 shadow-sm"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-5 border-b border-hotel-peach/30">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <div className="p-3 sm:p-3.5 bg-hotel-peach text-hotel-charcoal rounded-2xl shadow-xs shrink-0 border border-hotel-peach/60">
            <IdentificationIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-hotel-charcoal leading-tight">
              {t('checkin_title')}
            </h2>
            <p className="text-xs sm:text-sm text-hotel-charcoal/80 font-medium mt-1 leading-relaxed">
              {t('checkin_subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Document Type & Capture */}
      <div className="bg-white/90 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 border border-hotel-peach/30 shadow-2xs mb-5 sm:mb-6">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-7 h-7 rounded-full bg-hotel-peach text-hotel-charcoal font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
            1
          </span>
          <h3 className="text-base sm:text-xl font-extrabold text-hotel-charcoal">
            {t('checkin_step_1')}
          </h3>
        </div>

        {/* Document Type Selector */}
        <p className="text-xs sm:text-sm font-bold text-hotel-charcoal/80 mb-2.5">
          {t('doc_type_label')}
        </p>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
          {(['national_id', 'passport', 'family_card'] as DocChoice[]).map((choice) => {
            const active = docChoice === choice;
            const icon = choice === 'national_id' ? '🪪' : choice === 'passport' ? '🛂' : '👨‍👩‍👧‍👦';
            return (
              <button
                key={choice}
                type="button"
                onClick={() => handleSelectDocChoice(choice)}
                className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 text-center transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 font-bold text-xs sm:text-sm active:scale-[0.98] ${
                  active
                    ? 'bg-hotel-peachLight border-hotel-peach text-hotel-charcoal shadow-xs font-black'
                    : 'bg-hotel-cream/60 border-hotel-peach/20 text-hotel-charcoal/80 hover:border-hotel-peach/50'
                }`}
              >
                <span className="text-lg sm:text-xl leading-none">{icon}</span>
                <span>{docLabels[choice]}</span>
              </button>
            );
          })}
        </div>

        {/* Hidden Inputs */}
        <input
          ref={mobileCameraInputRef}
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

        {/* Capture / Upload Actions or Image Preview */}
        {!previewUrl ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={openCamera}
              className="min-h-[56px] py-3.5 px-5 bg-hotel-peach hover:bg-hotel-peachLight text-hotel-charcoal border border-hotel-peach/70 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xs transition-all active:scale-[0.98]"
            >
              <CameraIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              <span>{t('capture_camera')}</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="min-h-[56px] py-3.5 px-5 bg-hotel-cream hover:bg-hotel-peachLight/60 text-hotel-charcoal border-2 border-dashed border-hotel-peach/60 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
            >
              <ArrowUpTrayIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              <span>{t('upload_photo')}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden border-2 border-hotel-peach/40 bg-hotel-cream/50 max-h-64 flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Document preview"
                className="max-h-60 w-auto object-contain mx-auto"
              />
              {extracting && (
                <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex flex-col items-center justify-center gap-2.5 p-4 text-center">
                  <div className="w-9 h-9 border-4 border-hotel-peach border-t-hotel-charcoal rounded-full animate-spin" />
                  <p className="text-xs sm:text-sm font-black text-hotel-charcoal flex items-center gap-1.5">
                    <SparklesIcon className="w-4 h-4 text-amber-500" />
                    <span>{t('extracting_data')}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={openCamera}
                  disabled={extracting}
                  className="px-4 py-2 bg-hotel-peachLight hover:bg-hotel-peach text-hotel-charcoal rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 border border-hotel-peach/50 transition-all disabled:opacity-50"
                >
                  <CameraIcon className="w-4 h-4" />
                  <span>{t('retake_photo')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={extracting}
                  className="px-4 py-2 bg-hotel-cream hover:bg-white text-hotel-charcoal rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 border border-hotel-peach/40 transition-all disabled:opacity-50"
                >
                  <ArrowUpTrayIcon className="w-4 h-4" />
                  <span>{t('upload_photo')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Extraction Status Banner */}
        {extractStatus === 'success' && (
          <div className="mt-4 p-3 sm:p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-800 text-xs sm:text-sm font-bold">
            <CheckCircleIcon className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
            <span>{extractMessage}</span>
          </div>
        )}
        {extractStatus === 'error' && (
          <div className="mt-4 p-3 sm:p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-800 text-xs sm:text-sm font-bold">
            <ExclamationCircleIcon className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <span>{extractMessage}</span>
          </div>
        )}
      </div>

      {/* Step 2: Captured / Editable Data */}
      <div className="bg-white/90 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 border border-hotel-peach/30 shadow-2xs mb-5 sm:mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-hotel-peach text-hotel-charcoal font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
              2
            </span>
            <h3 className="text-base sm:text-xl font-extrabold text-hotel-charcoal">
              {t('checkin_step_2')}
            </h3>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-hotel-charcoal/65">
            {t('extract_manual_hint')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          <div>
            <label className="block text-xs font-bold text-hotel-charcoal/80 mb-1.5">
              {t('field_doc_type')}
            </label>
            <input
              type="text"
              value={formData.documentType}
              onChange={(e) => handleFieldChange('documentType', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-hotel-cream/60 border border-hotel-peach/40 focus:border-hotel-peach focus:bg-white outline-none text-sm font-bold text-hotel-charcoal transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-hotel-charcoal/80 mb-1.5">
              {t('field_full_name')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleFieldChange('fullName', e.target.value)}
              placeholder={t('enter_name')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-hotel-cream/60 border border-hotel-peach/40 focus:border-hotel-peach focus:bg-white outline-none text-sm font-bold text-hotel-charcoal transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-hotel-charcoal/80 mb-1.5">
              {t('field_id_number')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.idNumber}
              onChange={(e) => handleFieldChange('idNumber', e.target.value)}
              dir="ltr"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-hotel-cream/60 border border-hotel-peach/40 focus:border-hotel-peach focus:bg-white outline-none text-sm font-bold text-hotel-charcoal transition-all ${isRtl ? 'text-right' : 'text-left'}`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-hotel-charcoal/80 mb-1.5">
              {t('field_nationality')}
            </label>
            <input
              type="text"
              value={formData.nationality}
              onChange={(e) => handleFieldChange('nationality', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-hotel-cream/60 border border-hotel-peach/40 focus:border-hotel-peach focus:bg-white outline-none text-sm font-bold text-hotel-charcoal transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-hotel-charcoal/80 mb-1.5">
              {t('field_dob')}
            </label>
            <input
              type="text"
              value={formData.dateOfBirth}
              onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
              dir="ltr"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-hotel-cream/60 border border-hotel-peach/40 focus:border-hotel-peach focus:bg-white outline-none text-sm font-bold text-hotel-charcoal transition-all ${isRtl ? 'text-right' : 'text-left'}`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-hotel-charcoal/80 mb-1.5">
              {t('field_expiry')}
            </label>
            <input
              type="text"
              value={formData.expiryDate}
              onChange={(e) => handleFieldChange('expiryDate', e.target.value)}
              dir="ltr"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-hotel-cream/60 border border-hotel-peach/40 focus:border-hotel-peach focus:bg-white outline-none text-sm font-bold text-hotel-charcoal transition-all ${isRtl ? 'text-right' : 'text-left'}`}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-hotel-charcoal/80 mb-1.5">
              {t('field_phone')}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              placeholder="05XXXXXXXX"
              dir="ltr"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-hotel-cream/60 border border-hotel-peach/40 focus:border-hotel-peach focus:bg-white outline-none text-sm font-bold text-hotel-charcoal transition-all ${isRtl ? 'text-right' : 'text-left'}`}
            />
          </div>
        </div>

        {/* Dependents section (Family Card or manually added) */}
        {(docChoice === 'family_card' || formData.dependents.length > 0) && (
          <div className="mt-5 pt-4 border-t border-hotel-peach/25">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h4 className="text-xs sm:text-sm font-black text-hotel-charcoal">
                {t('dependents_title')}
              </h4>
              <button
                type="button"
                onClick={addDependent}
                className="px-3 py-1.5 bg-hotel-peachLight hover:bg-hotel-peach text-hotel-charcoal rounded-xl text-xs font-bold flex items-center gap-1 border border-hotel-peach/50 transition-all"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>{t('add_dependent')}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {formData.dependents.map((dep, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 rounded-xl bg-hotel-cream/60 border border-hotel-peach/25 items-center"
                >
                  <input
                    type="text"
                    value={dep.name}
                    onChange={(e) => updateDependent(idx, 'name', e.target.value)}
                    placeholder={t('dependent_name')}
                    className="sm:col-span-5 px-3 py-2 rounded-lg bg-white border border-hotel-peach/30 text-xs sm:text-sm font-bold text-hotel-charcoal outline-none"
                  />
                  <input
                    type="text"
                    value={dep.idNumber}
                    onChange={(e) => updateDependent(idx, 'idNumber', e.target.value)}
                    placeholder={t('dependent_id')}
                    dir="ltr"
                    className={`sm:col-span-4 px-3 py-2 rounded-lg bg-white border border-hotel-peach/30 text-xs sm:text-sm font-bold text-hotel-charcoal outline-none ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                  <input
                    type="text"
                    value={dep.relation}
                    onChange={(e) => updateDependent(idx, 'relation', e.target.value)}
                    placeholder={t('dependent_relation')}
                    className="sm:col-span-2 px-3 py-2 rounded-lg bg-white border border-hotel-peach/30 text-xs sm:text-sm font-bold text-hotel-charcoal outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeDependent(idx)}
                    aria-label="Remove dependent"
                    className="sm:col-span-1 p-2 text-red-500 hover:bg-red-50 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Step 3: Booking Terms, Agreement & Send to Hotel WhatsApp */}
      <div className="bg-white/90 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 border border-hotel-peach/30 shadow-2xs">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-7 h-7 rounded-full bg-hotel-peach text-hotel-charcoal font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
            3
          </span>
          <h3 className="text-base sm:text-xl font-extrabold text-hotel-charcoal">
            {t('checkin_step_3')}
          </h3>
        </div>

        {/* Booking Terms Box */}
        <div className="bg-hotel-cream/70 border border-hotel-yellow/40 rounded-2xl p-4 sm:p-5 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h4 className="text-sm sm:text-base font-black text-hotel-charcoal flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{t('booking_terms_title')}</span>
            </h4>
            <button
              type="button"
              onClick={() => setShowAllPolicies(!showAllPolicies)}
              className="text-xs font-extrabold text-hotel-charcoal bg-white px-3 py-1.5 rounded-xl border border-hotel-peach/40 hover:bg-hotel-peachLight transition-all flex items-center gap-1"
            >
              <span>{showAllPolicies ? t('hide_all_policies') : t('show_all_policies')}</span>
              {showAllPolicies ? (
                <ChevronUpIcon className="w-3.5 h-3.5" />
              ) : (
                <ChevronDownIcon className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <ul className="space-y-2 max-h-60 overflow-y-auto pe-1">
            {displayedPolicies.map((item) => {
              const langKey = (language as keyof typeof item) || 'ar';
              const policyText = item[langKey] || item.ar;
              return (
                <li
                  key={item.id}
                  className="text-xs sm:text-sm text-hotel-charcoal/90 font-medium bg-white/80 p-2.5 sm:p-3 rounded-xl border border-hotel-peach/20 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-hotel-yellow/30 text-hotel-charcoal font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {item.id}
                  </span>
                  <span className="leading-relaxed">{policyText}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mandatory Consent Checkbox */}
        <label className="flex items-start gap-3 p-4 rounded-2xl bg-hotel-peachLight/70 border-2 border-hotel-peach/60 cursor-pointer hover:bg-hotel-peachLight transition-all mb-4 select-none">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => {
              setAgreedToTerms(e.target.checked);
              setValidationError('');
            }}
            className="mt-1 w-5 h-5 accent-emerald-600 rounded shrink-0 cursor-pointer"
          />
          <span className="text-xs sm:text-sm md:text-base font-black text-hotel-charcoal leading-relaxed">
            {t('checkin_agree_label')}
          </span>
        </label>

        {validationError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-bold flex items-center gap-2">
            <ExclamationCircleIcon className="w-5 h-5 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* WhatsApp Send & Copy Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {isReadyToSend ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-h-[54px] py-3.5 px-6 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-black text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-[0.98]"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              <span>{t('send_checkin_whatsapp')}</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={handleInvalidClick}
              className="flex-1 min-h-[54px] py-3.5 px-6 bg-[#25D366]/70 hover:bg-[#25D366]/85 text-white font-black text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2.5 shadow-xs transition-all active:scale-[0.98]"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              <span>{t('send_checkin_whatsapp')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyMessage}
            className="min-h-[54px] py-3 px-5 bg-hotel-cream hover:bg-hotel-peachLight text-hotel-charcoal border border-hotel-peach/50 font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <ClipboardDocumentIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>{copiedMsg ? t('checkin_msg_copied') : t('copy_checkin_msg')}</span>
          </button>
        </div>

        <p className="mt-3 text-[11px] sm:text-xs text-hotel-charcoal/70 font-medium text-center">
          {t('whatsapp_photo_note')}
        </p>
      </div>

      {/* Live Camera Modal */}
      {cameraOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-hotel-peach">
            <div className="px-5 py-3.5 bg-hotel-cream border-b border-hotel-peach/30 flex items-center justify-between">
              <span className="font-black text-sm sm:text-base text-hotel-charcoal flex items-center gap-2">
                <CameraIcon className="w-5 h-5" />
                <span>{t('capture_camera')}</span>
              </span>
              <button
                type="button"
                onClick={closeCamera}
                className="p-1.5 rounded-full hover:bg-hotel-peachLight text-hotel-charcoal"
                aria-label={t('camera_cancel_btn')}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="relative bg-black aspect-[4/3] w-full flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="w-full h-full object-cover"
              />
              {/* Alignment Frame */}
              <div className="absolute inset-6 border-2 border-dashed border-hotel-peach/80 rounded-2xl pointer-events-none" />
              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="w-8 h-8 border-4 border-hotel-peach border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="p-4 bg-hotel-cream text-center space-y-3">
              <p className="text-xs sm:text-sm font-bold text-hotel-charcoal/80">
                {t('camera_hint')}
              </p>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={captureFromCamera}
                  disabled={!cameraReady}
                  className="flex-1 py-3 bg-hotel-peach hover:bg-hotel-peachLight text-hotel-charcoal font-black rounded-2xl border border-hotel-peach/70 shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CameraIcon className="w-5 h-5" />
                  <span>{t('camera_capture_btn')}</span>
                </button>
                <button
                  type="button"
                  onClick={closeCamera}
                  className="px-5 py-3 bg-white hover:bg-gray-50 text-hotel-charcoal font-bold rounded-2xl border border-hotel-peach/40"
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

export default GuestCheckIn;
