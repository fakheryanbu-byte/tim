
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { MicrophoneIcon, StopIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';
import { useTranslation } from '../LanguageContext';

const AIConcierge: React.FC = () => {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('');
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  const hotelInfo = `
    بيانات فندق تيم (Team Hotel) الرياض:
    
    1. الموقع والعنوان الدقيق (Location & Coordinates):
    - الإحداثيات الجغرافية: Latitude: 24.8197, Longitude: 46.8407 (حي المعيزلة).
    - رابط جوجل ماب: https://maps.app.goo.gl/4fwNFeubUnDjxfEg8
    - العنوان الوطني: 6815 البسالة، RFMB6815، 3406، حي المعيزلة، الرياض 13231.

    2. المرافق والأدوار:
    - البدروم: مواقف سيارات خاصة للنزلاء.
    - الدور الأرضي: الاستقبال (24/7)، مطعم الفندق، سينما داخلية، دورات مياه عامة، غرف (1102 إلى 1108).
    - الدور الثاني: غرف سكنية (1201 إلى 1220).
    - الدور الثالث: غرف سكنية (1301 إلى 1308).

    3. السياسات:
    - الدخول: 4:00 عصراً | الخروج: 2:00 ظهراً.
    - التدخين: ممنوع تماماً.
    - الخصوصية: استخدم القفل اليدوي دائماً.

    4. منيو المطعم:
    - فطور سعودي (20 ريال)، فطور شرقي (35 ريال)، فطور ملكي (50 ريال).
    - مشروبات حارة (قهوة سعودية 25 ريال)، مشروبات باردة (بيبسي 3 ريال).

    5. المسافات والوقت (باستخدام أدوات البحث):
    - الفندق يقع في شرق الرياض (حي المعيزلة)، بالقرب من استاد الملك فهد الدولي.
    - المطار (RUH): يبعد حوالي 25-30 دقيقة في الظروف العادية.
  `;

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const createBlob = (data: Float32Array): any => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const startSession = async () => {
    try {
      setStatus(t('ai_connecting'));
      setIsActive(true);
      
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        setStatus(t('ai_error_key'));
        setIsActive(false);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          tools: [{ googleSearch: {} }], // تفعيل ميزة البحث الأرضي للمعلومات اللحظية
          systemInstruction: `أنت المساعد الصوتي الرسمي لفندق تيم (Team Hotel) في الرياض.
          
          قواعد هامة جداً:
          1. الترحيب عند البدء: "حياك الله ضيفنا الغالي اقامة سعيدة في فندق تيم".
          2. الختام دائماً: "فندق تيم اقامة سعيدة".
          
          3. صلاحيات تحديد الموقع والوقت:
          - عند سؤال الضيف عن المسافة أو الوقت للوصول إلى وجهات مثل (المطار، الرياض بارك، استاد الملك فهد، حي طريف، أو أي سوق)، استخدم أداة البحث لتقدير الوقت بناءً على موقع الفندق في حي المعيزلة (24.8197, 46.8407).
          - يجب أن تذكر المسافة التقريبية والوقت المتوقع بالسيارة.
          - تنبيه إلزامي: عند تقديم أي تقدير للوقت، يجب أن تقول: "هذه الإجابة تقريبية بناءً على خرائط جوجل وحالة المرور الحالية، لذا يرجى الاحتياط والتحرك مبكراً، خاصة إذا كنت متوجهاً للمطار لضمان وصولك في الموعد المحدد".
          
          4. نطاق المعلومات:
          - استخدم هذه البيانات: ${hotelInfo}.
          - لا تشارك في أي مواضيع تخرج عن نطاق الفندق وخدماته ومحيطه السياحي في الرياض.
          - إذا سُئلت عن معلومات خارج الرياض أو لا تتعلق بإقامة الضيف، اعتذر بلباقة.`,
        },
        callbacks: {
          onopen: () => {
            setStatus(t('ai_ready'));
            setIsListening(true);
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((s) => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
            
            sessionPromise.then(session => {
              session.sendRealtimeInput({
                media: { data: "", mimeType: "audio/pcm;rate=16000" } 
              });
            });
          },
          onmessage: async (msg) => {
            const base64Audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error(e);
            setStatus(t('ai_error_conn'));
            stopSession();
          },
          onclose: () => {
            setIsActive(false);
            setStatus('');
          }
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus(t('ai_error_mic'));
      setIsActive(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (inputAudioContextRef.current) inputAudioContextRef.current.close();
    if (audioContextRef.current) audioContextRef.current.close();
    setIsActive(false);
    setIsListening(false);
    setStatus('');
  };

  return (
    <div className="mb-12">
      {!isActive ? (
        <button 
          onClick={startSession}
          className="w-full bg-hotel-charcoal text-hotel-peach p-8 rounded-[2.5rem] border-2 border-hotel-peach shadow-xl hover:scale-[1.02] transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-hotel-peach/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="bg-hotel-peach p-4 rounded-full text-hotel-charcoal shadow-lg animate-pulse">
              <MicrophoneIcon className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-1">{t('ai_assistant')}</h3>
              <p className="text-hotel-peach/80 font-medium">{t('ai_desc')}</p>
            </div>
          </div>
        </button>
      ) : (
        <div className="bg-hotel-cream border-2 border-hotel-peach p-8 rounded-[2.5rem] shadow-2xl animate-slide-up">
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              <span className="text-hotel-charcoal font-black">{status}</span>
            </div>
            
            <div className="flex justify-center gap-4 items-center">
               <div className="flex items-end gap-1 h-12">
                 {[1,2,3,4,5,4,3,2,1].map((h, i) => (
                   <div key={i} className="w-1 bg-hotel-peach rounded-full animate-bounce" style={{ height: `${h * 10}%`, animationDelay: `${i * 0.1}s` }}></div>
                 ))}
               </div>
               <SpeakerWaveIcon className="w-12 h-12 text-hotel-charcoal" />
               <div className="flex items-end gap-1 h-12">
                 {[1,2,3,4,5,4,3,2,1].map((h, i) => (
                   <div key={i} className="w-1 bg-hotel-peach rounded-full animate-bounce" style={{ height: `${h * 10}%`, animationDelay: `${i * 0.1}s` }}></div>
                 ))}
               </div>
            </div>

            <button 
              onClick={stopSession}
              className="bg-red-50 text-red-600 px-8 py-3 rounded-full font-bold flex items-center gap-2 border border-red-200 hover:bg-red-600 hover:text-white transition-all shadow-sm"
            >
              <StopIcon className="w-5 h-5" />
              {t('end_chat')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIConcierge;
