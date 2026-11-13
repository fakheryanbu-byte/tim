import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

export interface ExtractRequestBody {
  imageBase64?: string;
  mimeType?: string;
  documentType?: string;
}

export interface ExtractServiceResponse {
  status: number;
  payload: Record<string, unknown>;
}

const DEFAULT_GEMINI_MODEL = 'gemini-4-hydrogen';

export async function extractCheckInDocument(
  body: ExtractRequestBody
): Promise<ExtractServiceResponse> {
  try {
    const { imageBase64, mimeType, documentType } = body || {};

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return {
        status: 400,
        payload: { error: 'Image data is required.' },
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        status: 500,
        payload: { error: 'Gemini API key is not configured on the server.' },
      };
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const docLabelMap: Record<string, string> = {
      national_id: 'الهوية الوطنية / الإقامة (National ID or Iqama)',
      passport: 'جواز السفر (Passport)',
      family_card: 'كرت العائلة / سجل الأسرة (Saudi Family Card)',
    };
    const expectedDocLabel =
      docLabelMap[documentType || ''] || 'وثيقة إثبات شخصية (هوية / جواز سفر / كرت عائلة)';

    const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const safeMimeType = mimeType && mimeType.startsWith('image/') ? mimeType : 'image/jpeg';

    const modelName = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
    const supportsThinkingLevel =
      modelName.startsWith('gemini-3') || modelName.startsWith('gemini-4');

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: safeMimeType,
              data: cleanBase64,
            },
          },
          {
            text: `اقرأ هذه الصورة بعناية واستخرج بيانات النزيل لتسجيل الدخول الفندقي. نوع الوثيقة المختار من النزيل هو: ${expectedDocLabel}.
استخرج بدقة ما هو مكتوب في الوثيقة فقط دون تخمين أي حقل غير واضح أو غير موجود (اترك الحقل نصاً فارغاً "" إذا لم يكن موجوداً أو غير مقروء).
- استخرج الاسم الكامل في fullName، وقم أيضاً بتقسيمه قدر الإمكان إلى: firstName (الإسم الأول)، secondName (الإسم الثاني)، middleName (الإسم الأوسط)، lastName (الإسم الأخير).
- استخرج مكان الإصدار (placeOfIssue) إن وجد، والجنس (gender: ذكر أو أنثى) إن وجد.
- إذا كانت الوثيقة دفتر عائلة (سجل أسرة / مواطن سعودي)، فاجعل الجنسية "المملكة العربية السعودية"، واستخرج رقم دفتر العائلة / السجل المدني في idNumber، واستخرج كل تابع في مصفوفة dependents مع (الاسم name، رقم الهوية idNumber، صلة القرابة relation).
- اكتب التواريخ بصيغة واضحة كما هي ظاهرة في الوثيقة، وحدد هل تاريخ الميلاد هجري ("hijri") أم ميلادي ("gregorian") في birthDateCalendar.
- اكتب الجنسية باللغة العربية إذا أمكن.`,
          },
        ],
      },
      config: {
        ...(supportsThinkingLevel ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } } : {}),
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedDocumentType: {
              type: Type.STRING,
              description:
                'Detected document type in Arabic, e.g., هوية وطنية، هوية مقيم، جواز سفر، دفتر عائلة (مواطن)',
            },
            fullName: {
              type: Type.STRING,
              description: 'Full name of the primary guest as shown on the document',
            },
            firstName: {
              type: Type.STRING,
              description: 'First name (الإسم الأول)',
            },
            secondName: {
              type: Type.STRING,
              description: 'Second / father name (الإسم الثاني)',
            },
            middleName: {
              type: Type.STRING,
              description: 'Middle / grandfather name (الإسم الأوسط)',
            },
            lastName: {
              type: Type.STRING,
              description: 'Last / family name (الإسم الأخير)',
            },
            idNumber: {
              type: Type.STRING,
              description: 'National ID, Iqama number, Passport number, or Family Book number',
            },
            placeOfIssue: {
              type: Type.STRING,
              description: 'Place of issue if shown on the document (مكان الإصدار)',
            },
            nationality: {
              type: Type.STRING,
              description:
                'Nationality shown on the document (المملكة العربية السعودية for Saudi Family Book)',
            },
            dateOfBirth: {
              type: Type.STRING,
              description: 'Date of birth shown on the document',
            },
            birthDateCalendar: {
              type: Type.STRING,
              description: 'Either "hijri" or "gregorian" based on the date of birth format shown',
            },
            expiryDate: {
              type: Type.STRING,
              description: 'Document expiry date if visible',
            },
            gender: {
              type: Type.STRING,
              description: 'Gender in Arabic: "ذكر" or "أنثى" if visible/inferred from document, otherwise ""',
            },
            dependents: {
              type: Type.ARRAY,
              description: 'Family members / dependents listed on a family book, if applicable',
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  idNumber: { type: Type.STRING },
                  relation: { type: Type.STRING },
                },
              },
            },
            isReadable: {
              type: Type.BOOLEAN,
              description: 'Whether the document image was clear enough to extract at least name or ID number',
            },
            note: {
              type: Type.STRING,
              description: 'Brief Arabic note if image is unclear or partially obscured',
            },
          },
        },
      },
    });

    const rawText = (response.text || '{}').trim();
    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = {
        isReadable: false,
        note: 'تعذر تحليل البيانات تلقائياً، يرجى مراجعتها وإدخالها يدوياً.',
      };
    }

    return {
      status: 200,
      payload: { ok: true, data: parsed },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to extract document data';
    console.error('Check-in extraction error:', err);
    return {
      status: 500,
      payload: { error: message },
    };
  }
}
