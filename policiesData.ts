export interface Policy {
  id: number;
  ar: string;
  en: string;
  ur: string;
  fr: string;
  zh: string;
}

export const policiesData: Policy[] = [
  {
    id: 1,
    ar: "وقت تسجيل الدخول من الساعة 4:00 مساءً، ووقت تسجيل المغادرة حتى الساعة 2:00 ظهرا، ما لم يتم الاتفاق على غير ذلك.",
    en: "Check-in time is from 4:00 PM, and check-out time is until 2:00 PM, unless agreed otherwise.",
    ur: "چیک ان کا وقت شام 4:00 بجے سے ہے، اور چیک آؤٹ کا وقت دوپہر 2:00 بجے تک ہے، جب تک کہ دوسری صورت میں اتفاق نہ ہو۔",
    fr: "L'heure d'arrivée est à partir de 16h00, et l'heure de départ est jusqu'à 14h00, sauf accord contraire.",
    zh: "入住时间为下午 16:00 起，退房时间为中午 14:00 前，除非另有约定。"
  },
  {
    id: 2,
    ar: "عند التأخر في تسجيل المغادرة بعد الوقت المحدد، يتم احتساب رسوم إضافية وفق سياسة الفندق، ولا يعتبر ذلك تجديدًا تلقائيًا للحجز أو تمديدًا للإقامة.",
    en: "In case of late check-out, additional fees will apply per hotel policy; this is not considered an automatic booking renewal or extension.",
    ur: "مقررہ وقت کے بعد تاخیر سے چیک آؤٹ کی صورت میں، ہوٹل کی پالیسی کے تحت اضافی فیس لاگو ہوگی، اور اسے بکنگ کی خودکار تجدید نہیں مانا جائے گا۔",
    fr: "En cas de départ tardif, des frais supplémentaires s'appliqueront selon les politiques de l'hôtel, sans que cela constitue un renouvellement automatique du séjour.",
    zh: "延迟退房将按照酒店政策收取额外费用，这不视为自动续订或延长住宿。"
  },
  {
    id: 3,
    ar: "يُمنع التدخين بجميع أنواعه (السجائر العادية، الإلكترونية، والشيشة) داخل جميع الغرف والمرافق المغلقة. وفي حال المخالفة، يُفرض مقابل مالي قدره 500 ريال سعودي لتغطية تكاليف التنظيف العميق، التعقيم، وتعطيل الغرفة.",
    en: "Smoking of all kinds (regular cigarettes, e-cigarettes/vapes, and shisha) is strictly prohibited inside all rooms and indoor facilities. In case of violation, a 500 SAR fee applies to cover deep cleaning, sanitization, and room downtime costs.",
    ur: "تمام کمروں اور بند سہولیات کے اندر ہر قسم کی تمباکو نوشی (عام سگریٹ، الیکٹرانک سگریٹ/ویپ، اور شیشہ) سختی سے ممنوع ہے۔ خلاف ورزی کی صورت میں، گہری صفائی، جراثیم کشی اور کمرے کے تعطل کے اخراجات پورے کرنے کے لیے 500 سعودی ریال جرمانہ عائد کیا جائے گا۔",
    fr: "Il est strictement interdit de fumer sous toutes ses formes (cigarettes classiques, électroniques et chicha) dans toutes les chambres et espaces clos. En cas d'infraction, des frais de 500 SAR seront appliqués pour le nettoyage en profondeur, la désinfection et l'immobilisation de la chambre.",
    zh: "严禁在所有客房和封闭设施内进行任何形式的吸烟（包括传统香烟、电子烟和水烟）。如有违反，将收取 500 沙特里亚尔的费用，用于支付深度清洁、消毒以及客房停用损失的成本。"
  },
  {
    id: 4,
    ar: "يمنع إدخال أو اصطحاب الحيوانات الأليفة داخل الفندق.",
    en: "Pets are strictly prohibited inside the hotel premises.",
    ur: "ہوٹل کے احاطے میں پالتو جانوروں کا لانا سخت منع ہے۔",
    fr: "Les animaux de compagnie sont strictement interdits dans l'établissement.",
    zh: "酒店内严禁携带或携带宠物。"
  },
  {
    id: 5,
    ar: "يلتزم النزيل بالمحافظة على الغرفة وجميع مرافق وممتلكات الفندق، ويتحمل تكلفة أي تلف أو فقد أو ضرر ناتج عن سوء الاستخدام أو الإهمال.",
    en: "Guests must preserve rooms/facilities, and bear the financial costs of any damages or losses due to misuse or negligence.",
    ur: "مہمان کمرے اور ہوٹل کی تمام سہولیات اور املاک کی حفاظت کے ذمہ دار ہیں، اور غفلت یا غلط استعمال پر آنے والے تمام اخراجات کے خود ذمہ دار ہوں گے۔",
    fr: "Le client s'engage à préserver la chambre et les installations. En cas de dégradation ou négligence, il prendra en charge les frais de remplacement ou réparation.",
    zh: "住客有义务爱护客房及所有酒店设施，并承担因滥用或疏忽造成的任何损坏或损失的费用。"
  },
  {
    id: 6,
    ar: "يوصى باستخدام القفل اليدوي ووسائل الأمان المتوفرة داخل الغرفة أثناء الإقامة، ويتحمل النزيل مسؤولية التأكد من إغلاق الغرفة وحفظ متعلقاته الشخصية.",
    en: "Manual locks and security amenities should be utilized; guests are fully responsible for locking rooms and securing personal items.",
    ur: "دستی لاک اور فراہم کردہ حفاظتی آلات کا استعمال تجویز کیا جاتا ہے، مہمان کمرے کو بند رکھنے اور اپنے ذاتی سامان کی حفاظت کے خود ذمہ دار ہیں۔",
    fr: "L'utilisation des verrous manuels et dispositifs de sécurité fournis est recommandée; le client est responsable de la sécurité de ses biens.",
    zh: "建议在住宿期间使用手动锁和客房内提供的安全设施。住客需负责确保锁好房门并保管好个人物品。"
  },
  {
    id: 7,
    ar: "يحتفظ الفندق بالمفقودات التي يتم العثور عليها لمدة لا تتجاوز (30) يومًا من تاريخ العثور عليها، ويتم التواصل مع صاحبها عبر رقم الجوال أو تطبيق واتساب المسجل في بيانات الحجز.",
    en: "Found items are retained for up to 30 days. Attempts to contact owner will be made via phone number or WhatsApp provided in booking.",
    ur: "گمشدہ اشیاء کو زیادہ سے زیادہ 30 دن تک رکھا جائے گا۔ مالک سے بکنگ میں درج موبائل نمبر یا واٹس ایپ کے ذریعے رابطہ کیا جائے گا۔",
    fr: "Les objets trouvés sont conservés pendant une période maximale de 30 jours, et le propriétaire sera contacté par téléphone ou WhatsApp via les coordonnées de réservation.",
    zh: "遗失物品自发现之日起保留不超过（30）天，我们将通过预订信息中登记的手机号或微信（WhatsApp）与失主联系。"
  },
  {
    id: 8,
    ar: "الفندق غير مسؤول عن الأموال النقدية أو المجوهرات أو المقتنيات الثمينة أو المتعلقات الشخصية التي لا يتم تسليمها لحفظها لدى الفندق وفق الأنظمة المعمول بها.",
    en: "The hotel is not responsible for cash, jewelry, or high-value belongings not declared and deposited for safe storage.",
    ur: "ہوٹل نقد رقم، زیورات یا قیمتی سامان کے نقصان کا ذمہ دار نہیں ہے جو ہوٹل کے پاس باقاعدہ جمع نہ کرائے گئے ہوں۔",
    fr: "L'hôtel n'est pas responsable de l'argent liquide, des bijoux ou des objets de valeur non déposés directement auprès du service de coffre-fort de l'hôtel.",
    zh: "酒店对未存放在指定贵重物品存放处的现金、珠宝、贵重物品或个人物品不承担任何责任。"
  },
  {
    id: 9,
    ar: "يلتزم جميع النزلاء والزوار بالأنظمة والتعليمات المعمول بها داخل الفندق، ويحق للإدارة اتخاذ الإجراءات المناسبة عند مخالفتها.",
    en: "All guests and visitors must comply with hotel regulations; management reserves the right to take necessary actions upon violations.",
    ur: "تمام مہمانوں اور زائرین کو ہوٹل کے تمام قوانین کی تعمیل کرنی ہوگی، خلاف ورزی پر انتظامیہ مناسب کارروائی کا حق محفوظ رکھتی ہے۔",
    fr: "Tous les clients et visiteurs doivent se conformer aux règlements internes; la direction se réserve le droit de prendre les mesures nécessaires en cas d'infraction.",
    zh: "所有住客和访客必须遵守酒店的规章制度。如有违反，管理层有权采取适当的法律和纪律措施。"
  },
  {
    id: 10,
    ar: "بإتمام الحجز أو تسجيل الدخول، يعد النزيل موافقًا على جميع سياسات وشروط الإقامة المعتمدة من الفندق.",
    en: "Completing a reservation or checking in constitutes full consent to all rules, terms, and policies approved by the hotel.",
    ur: "بکنگ مکمل کرنے یا چیک ان کرنے پر مہمان کو ہوٹل کی تمام منظور شدہ پالیسیوں اور شرائط سے مکمل متفق سمجھا جائے گا۔",
    fr: "La confirmation de la réservation ou l'enregistrement implique l'acceptation totale de toutes les conditions et politiques approuvées par l'hôtel.",
    zh: "完成预订或办理入住登记，即视为住客同意酒店批准的所有住宿政策和条款。"
  },
  {
    id: 11,
    ar: "يلتزم النزيل بجميع سياسات وتعليمات الفندق المعلنة أو التي يتم إبلاغه بها أثناء الإقامة، ويتحمل مسؤولية أي مخالفة أو أضرار أو تكاليف تترتب على عدم الالتزام بها، ويحق لإدارة الفندق اتخاذ الإجراءات المناسبة وفق الأنظمة والتعليمات المعمول بها.",
    en: "Guests are liable for any breach of explicit or announced hotel rules, assuming full responsibility for damages/penalties from violations.",
    ur: "مہمان قیام کے دوران ہوٹل کے تمام اعلانات اور قوانین کی کارروائی کے پابند ہیں اور خلاف ورزی پر آنے والے کسی بھی نتیجے یا جرمانے کے خود ذمہ دار ہوں گے۔",
    fr: "Le client doit respecter toutes les instructions déclarées pendant son séjour et assume l'entière responsabilité en cas de dommages ou pénalités résultant de leur non-respect.",
    zh: "住客住宿期间必须遵守所有公布或告知的酒店指南，并对因不合规行为导致的任何损失、违规或索赔承担全部责任，酒店管理层保留采取适当措施的权利。"
  }
];
