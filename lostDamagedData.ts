export interface LostDamagedItem {
  id: number;
  category: 'bedroom_furniture' | 'bedding' | 'electronics' | 'bathroom' | 'room_amenities' | 'fees';
  name: {
    ar: string;
    en: string;
    fr: string;
    ur: string;
    zh: string;
  };
  price: {
    ar: string;
    en: string;
    fr: string;
    ur: string;
    zh: string;
  };
}

export const lostDamagedData: LostDamagedItem[] = [
  {
    id: 1,
    category: 'bedroom_furniture',
    name: {
      ar: "سرير فندقي",
      en: "Hotel Bed",
      fr: "Lit d'hôtel",
      ur: "ہوٹل بیڈ",
      zh: "酒店客房床"
    },
    price: {
      ar: "1,500 ريال",
      en: "1,500 SAR",
      fr: "1 500 SAR",
      ur: "1,500 ریال",
      zh: "1,500 沙特里亚尔"
    }
  },
  {
    id: 2,
    category: 'bedroom_furniture',
    name: {
      ar: "مرتبة",
      en: "Mattress",
      fr: "Matelas",
      ur: "گدّا",
      zh: "床垫"
    },
    price: {
      ar: "1,200 ريال",
      en: "1,200 SAR",
      fr: "1 200 SAR",
      ur: "1,200 ریال",
      zh: "1,200 沙特里亚尔"
    }
  },
  {
    id: 3,
    category: 'bedroom_furniture',
    name: {
      ar: "ظهر السرير المنجد",
      en: "Upholstered Headboard",
      fr: "Tête de lit capitonnée",
      ur: "بیڈ ہیڈ بورڈ",
      zh: "软包床头板"
    },
    price: {
      ar: "800 ريال",
      en: "800 SAR",
      fr: "800 SAR",
      ur: "800 ریال",
      zh: "800 沙特里亚尔"
    }
  },
  {
    id: 4,
    category: 'bedding',
    name: {
      ar: "مخدة",
      en: "Pillow",
      fr: "Oreiller",
      ur: "تکیہ",
      zh: "枕头"
    },
    price: {
      ar: "100 ريال",
      en: "100 SAR",
      fr: "100 SAR",
      ur: "100 ریال",
      zh: "100 沙特里亚尔"
    }
  },
  {
    id: 5,
    category: 'bedding',
    name: {
      ar: "لحاف",
      en: "Duvet / Quilt",
      fr: "Couette",
      ur: "لحاف",
      zh: "被子"
    },
    price: {
      ar: "250 ريال",
      en: "250 SAR",
      fr: "250 SAR",
      ur: "250 ریال",
      zh: "250 沙特里亚尔"
    }
  },
  {
    id: 6,
    category: 'bedding',
    name: {
      ar: "شرشف سرير",
      en: "Bedsheet",
      fr: "Drap de lit",
      ur: "بیڈ شیٹ",
      zh: "床单"
    },
    price: {
      ar: "100 ريال",
      en: "100 SAR",
      fr: "100 SAR",
      ur: "100 ریال",
      zh: "100 沙特里亚尔"
    }
  },
  {
    id: 7,
    category: 'bedding',
    name: {
      ar: "غطاء / كيس لحاف",
      en: "Duvet Cover",
      fr: "Housse de couette",
      ur: "لحاف کا کور",
      zh: "被套"
    },
    price: {
      ar: "120 ريال",
      en: "120 SAR",
      fr: "120 SAR",
      ur: "120 ریال",
      zh: "120 沙特里亚尔"
    }
  },
  {
    id: 8,
    category: 'bedding',
    name: {
      ar: "بيت مخدة",
      en: "Pillowcase",
      fr: "Taie d'oreiller",
      ur: "تکیہ غلاف",
      zh: "枕套"
    },
    price: {
      ar: "40 ريال",
      en: "40 SAR",
      fr: "40 SAR",
      ur: "40 ریال",
      zh: "40 沙特里亚尔"
    }
  },
  {
    id: 9,
    category: 'bedroom_furniture',
    name: {
      ar: "كومودينو / طاولة جانبية",
      en: "Nightstand / Side Table",
      fr: "Table de chevet",
      ur: "سائیڈ ٹیبل",
      zh: "床头柜 / 边桌"
    },
    price: {
      ar: "500 ريال",
      en: "500 SAR",
      fr: "500 SAR",
      ur: "500 ریال",
      zh: "500 沙特里亚尔"
    }
  },
  {
    id: 10,
    category: 'electronics',
    name: {
      ar: "هاتف الغرفة",
      en: "Room Landline Phone",
      fr: "Téléphone de chambre",
      ur: "کمرے کا ٹیلی فون",
      zh: "客房分机电话"
    },
    price: {
      ar: "250 ريال",
      en: "250 SAR",
      fr: "250 SAR",
      ur: "250 ریال",
      zh: "250 沙特里亚尔"
    }
  },
  {
    id: 11,
    category: 'electronics',
    name: {
      ar: "تلفزيون",
      en: "Television (TV)",
      fr: "Télévision (TV)",
      ur: "ٹیلی ویژن",
      zh: "电视机"
    },
    price: {
      ar: "1,500 ريال",
      en: "1,500 SAR",
      fr: "1 500 SAR",
      ur: "1,500 ریال",
      zh: "1,500 沙特里亚尔"
    }
  },
  {
    id: 12,
    category: 'electronics',
    name: {
      ar: "ريموت التلفزيون",
      en: "TV Remote Control",
      fr: "Télécommande TV",
      ur: "ٹی وی ریموٹ",
      zh: "电视遥控器"
    },
    price: {
      ar: "150 ريال",
      en: "150 SAR",
      fr: "150 SAR",
      ur: "150 ریال",
      zh: "150 沙特里亚尔"
    }
  },
  {
    id: 13,
    category: 'electronics',
    name: {
      ar: "جهاز كنترول المكيف",
      en: "AC Remote / Controller",
      fr: "Télécommande de climatiseur",
      ur: "اے سی ریموٹ کنٹرول",
      zh: "空调遥控器"
    },
    price: {
      ar: "250 ريال",
      en: "250 SAR",
      fr: "250 SAR",
      ur: "250 ریال",
      zh: "250 沙特里亚尔"
    }
  },
  {
    id: 14,
    category: 'electronics',
    name: {
      ar: "ثلاجة صغيرة",
      en: "Mini Fridge",
      fr: "Mini-réfrigérateur",
      ur: "چھوٹا فرج (منی بار)",
      zh: "迷你冰箱"
    },
    price: {
      ar: "800 ريال",
      en: "800 SAR",
      fr: "800 SAR",
      ur: "800 ریال",
      zh: "800 沙特里亚尔"
    }
  },
  {
    id: 15,
    category: 'electronics',
    name: {
      ar: "غلاية كهربائية",
      en: "Electric Kettle",
      fr: "Bouilloire électrique",
      ur: "الیکٹرک کیتلی",
      zh: "电热水壶"
    },
    price: {
      ar: "150 ريال",
      en: "150 SAR",
      fr: "150 SAR",
      ur: "150 ریال",
      zh: "150 沙特里亚尔"
    }
  },
  {
    id: 16,
    category: 'room_amenities',
    name: {
      ar: "صينية ضيافة",
      en: "Hospitality / Tea Tray",
      fr: "Plateau de courtoisie",
      ur: "مہمان نوازی کی ٹرے",
      zh: "客房迎宾托盘"
    },
    price: {
      ar: "100 ريال",
      en: "100 SAR",
      fr: "100 SAR",
      ur: "100 ریال",
      zh: "100 沙特里亚尔"
    }
  },
  {
    id: 17,
    category: 'room_amenities',
    name: {
      ar: "كوب",
      en: "Cup / Mug",
      fr: "Tasse / Verre",
      ur: "کپ",
      zh: "杯子"
    },
    price: {
      ar: "30 ريال",
      en: "30 SAR",
      fr: "30 SAR",
      ur: "30 ریال",
      zh: "30 沙特里亚尔"
    }
  },
  {
    id: 18,
    category: 'electronics',
    name: {
      ar: "خزنة إلكترونية",
      en: "Electronic Safe Box",
      fr: "Coffre-fort électronique",
      ur: "الیکٹرانک سیف",
      zh: "电子保险箱"
    },
    price: {
      ar: "700 ريال",
      en: "700 SAR",
      fr: "700 SAR",
      ur: "700 ریال",
      zh: "700 沙特里亚尔"
    }
  },
  {
    id: 19,
    category: 'bedroom_furniture',
    name: {
      ar: "دولاب ملابس",
      en: "Wardrobe / Closet",
      fr: "Armoire / Penderie",
      ur: "کپڑوں کی الماری",
      zh: "衣柜"
    },
    price: {
      ar: "1,500 ريال",
      en: "1,500 SAR",
      fr: "1 500 SAR",
      ur: "1,500 ریال",
      zh: "1,500 沙特里亚尔"
    }
  },
  {
    id: 20,
    category: 'room_amenities',
    name: {
      ar: "علاقة ملابس خشبية",
      en: "Wooden Clothes Hanger",
      fr: "Cintre en bois",
      ur: "لکڑی کا کپڑے کا ہینگر",
      zh: "木质衣架"
    },
    price: {
      ar: "30 ريال للحبة",
      en: "30 SAR / piece",
      fr: "30 SAR / pièce",
      ur: "30 ریال فی عدد",
      zh: "30 沙特里亚尔/个"
    }
  },
  {
    id: 21,
    category: 'bedroom_furniture',
    name: {
      ar: "مكتب / طاولة عمل",
      en: "Work Desk / Table",
      fr: "Bureau de travail",
      ur: "ورک ڈیسک / میز",
      zh: "书桌 / 办公桌"
    },
    price: {
      ar: "1,000 ريال",
      en: "1,000 SAR",
      fr: "1 000 SAR",
      ur: "1,000 ریال",
      zh: "1,000 沙特里亚尔"
    }
  },
  {
    id: 22,
    category: 'bedroom_furniture',
    name: {
      ar: "كرسي مكتب",
      en: "Desk Chair",
      fr: "Chaise de bureau",
      ur: "ڈیسک کرسی",
      zh: "办公椅"
    },
    price: {
      ar: "500 ريال",
      en: "500 SAR",
      fr: "500 SAR",
      ur: "500 ریال",
      zh: "500 沙特里亚尔"
    }
  },
  {
    id: 23,
    category: 'bedroom_furniture',
    name: {
      ar: "تسريحة بأدراج",
      en: "Dresser / Vanity with Drawers",
      fr: "Coiffeuse avec tiroirs",
      ur: "ڈریسر مع دراز",
      zh: "带抽屉梳妆台"
    },
    price: {
      ar: "1,200 ريال",
      en: "1,200 SAR",
      fr: "1 200 SAR",
      ur: "1,200 ریال",
      zh: "1,200 沙特里亚尔"
    }
  },
  {
    id: 24,
    category: 'bedroom_furniture',
    name: {
      ar: "مرآة التسريحة",
      en: "Dresser Mirror",
      fr: "Miroir de coiffeuse",
      ur: "ڈریسر کا آئینہ",
      zh: "梳妆台镜子"
    },
    price: {
      ar: "500 ريال",
      en: "500 SAR",
      fr: "500 SAR",
      ur: "500 ریال",
      zh: "500 沙特里亚尔"
    }
  },
  {
    id: 25,
    category: 'bedroom_furniture',
    name: {
      ar: "رف جداري",
      en: "Wall Shelf",
      fr: "Étagère murale",
      ur: "دیواری شیلف",
      zh: "墙面置物架"
    },
    price: {
      ar: "250 ريال",
      en: "250 SAR",
      fr: "250 SAR",
      ur: "250 ریال",
      zh: "250 沙特里亚尔"
    }
  },
  {
    id: 26,
    category: 'room_amenities',
    name: {
      ar: "ستارة الغرفة",
      en: "Room Curtain",
      fr: "Rideau de chambre",
      ur: "کمرے کا پردہ",
      zh: "客房窗帘"
    },
    price: {
      ar: "150 ريال للمتر",
      en: "150 SAR / meter",
      fr: "150 SAR / mètre",
      ur: "150 ریال فی میٹر",
      zh: "150 沙特里亚尔/米"
    }
  },
  {
    id: 27,
    category: 'room_amenities',
    name: {
      ar: "سلة مهملات الغرفة",
      en: "Room Trash Bin",
      fr: "Poubelle de chambre",
      ur: "کمرے کا کوڑے دان",
      zh: "客房垃圾桶"
    },
    price: {
      ar: "150 ريال",
      en: "150 SAR",
      fr: "150 SAR",
      ur: "150 ریال",
      zh: "150 沙特里亚尔"
    }
  },
  {
    id: 28,
    category: 'room_amenities',
    name: {
      ar: "علبة مناديل",
      en: "Tissue Box Cover",
      fr: "Boîte à mouchoirs",
      ur: "ٹشو باکس",
      zh: "纸巾盒"
    },
    price: {
      ar: "100 ريال",
      en: "100 SAR",
      fr: "100 SAR",
      ur: "100 ریال",
      zh: "100 沙特里亚尔"
    }
  },
  {
    id: 29,
    category: 'room_amenities',
    name: {
      ar: "مرآة طويلة",
      en: "Full-Length Mirror",
      fr: "Miroir plein pied",
      ur: "لمبا آئینہ",
      zh: "全身穿衣镜"
    },
    price: {
      ar: "500 ريال",
      en: "500 SAR",
      fr: "500 SAR",
      ur: "500 ریال",
      zh: "500 沙特里亚尔"
    }
  },
  {
    id: 30,
    category: 'electronics',
    name: {
      ar: "وحدات الإنارة والمفاتيح الكهربائية",
      en: "Lighting Units & Electrical Switches",
      fr: "Unités d'éclairage et interrupteurs",
      ur: "لائٹنگ یونٹس اور سوئچز",
      zh: "照明灯具及电源开关"
    },
    price: {
      ar: "حسب تكلفة الإصلاح",
      en: "According to repair cost",
      fr: "Selon coût de réparation",
      ur: "مرمت کے خرچ کے مطابق",
      zh: "按实际维修费用收取"
    }
  },
  {
    id: 31,
    category: 'bathroom',
    name: {
      ar: "منشفة",
      en: "Bath Towel",
      fr: "Serviette de bain",
      ur: "تولیہ",
      zh: "毛巾 / 浴巾"
    },
    price: {
      ar: "80 ريال",
      en: "80 SAR",
      fr: "80 SAR",
      ur: "80 ریال",
      zh: "80 沙特里亚尔"
    }
  },
  {
    id: 32,
    category: 'bathroom',
    name: {
      ar: "مغسلة الحمام",
      en: "Bathroom Sink / Basin",
      fr: "Lavabo de salle de bain",
      ur: "باتھ روم سنک",
      zh: "浴室洗脸盆"
    },
    price: {
      ar: "800 ريال",
      en: "800 SAR",
      fr: "800 SAR",
      ur: "800 ریال",
      zh: "800 沙特里亚尔"
    }
  },
  {
    id: 33,
    category: 'bathroom',
    name: {
      ar: "خلاط المغسلة",
      en: "Sink Mixer Tap / Faucet",
      fr: "Mitigeur de lavabo",
      ur: "سنک مکسر ٹوٹی",
      zh: "洗脸盆水龙头"
    },
    price: {
      ar: "500 ريال",
      en: "500 SAR",
      fr: "500 SAR",
      ur: "500 ریال",
      zh: "500 沙特里亚尔"
    }
  },
  {
    id: 34,
    category: 'bathroom',
    name: {
      ar: "مرآة الحمام",
      en: "Bathroom Mirror",
      fr: "Miroir de salle de bain",
      ur: "باتھ روم کا آئینہ",
      zh: "浴室镜"
    },
    price: {
      ar: "500 ريال",
      en: "500 SAR",
      fr: "500 SAR",
      ur: "500 ریال",
      zh: "500 沙特里亚尔"
    }
  },
  {
    id: 35,
    category: 'bathroom',
    name: {
      ar: "مرآة مكبرة متحركة",
      en: "Magnifying Shaving Mirror",
      fr: "Miroir grossissant orientable",
      ur: "بڑا آئینہ (متحرک)",
      zh: "伸缩放大化妆镜"
    },
    price: {
      ar: "300 ريال",
      en: "300 SAR",
      fr: "300 SAR",
      ur: "300 ریال",
      zh: "300 沙特里亚尔"
    }
  },
  {
    id: 36,
    category: 'electronics',
    name: {
      ar: "مجفف شعر جداري",
      en: "Wall-mounted Hairdryer",
      fr: "Sèche-cheveux mural",
      ur: "دیواری ہیئر ڈرائر",
      zh: "壁挂式吹风机"
    },
    price: {
      ar: "350 ريال",
      en: "350 SAR",
      fr: "350 SAR",
      ur: "350 ریال",
      zh: "350 沙特里亚尔"
    }
  },
  {
    id: 37,
    category: 'bathroom',
    name: {
      ar: "موزع / حامل مستلزمات الحمام",
      en: "Bathroom Amenities Dispenser / Holder",
      fr: "Distributeur / Support produits de bain",
      ur: "باتھ روم ہولڈر / ڈسپنسر",
      zh: "浴室洗漱用品挂架/分配器"
    },
    price: {
      ar: "150 ريال",
      en: "150 SAR",
      fr: "150 SAR",
      ur: "150 ریال",
      zh: "150 沙特里亚尔"
    }
  },
  {
    id: 38,
    category: 'bathroom',
    name: {
      ar: "رف المناشف",
      en: "Towel Shelf / Rack",
      fr: "Porte-serviettes mural",
      ur: "تولیہ شیلف",
      zh: "毛巾架 / 置物架"
    },
    price: {
      ar: "250 ريال",
      en: "250 SAR",
      fr: "250 SAR",
      ur: "250 ریال",
      zh: "250 沙特里亚尔"
    }
  },
  {
    id: 39,
    category: 'bathroom',
    name: {
      ar: "سلة مهملات الحمام",
      en: "Bathroom Trash Bin",
      fr: "Poubelle de salle de bain",
      ur: "باتھ روم کوڑے دان",
      zh: "浴室垃圾桶"
    },
    price: {
      ar: "150 ريال",
      en: "150 SAR",
      fr: "150 SAR",
      ur: "150 ریال",
      zh: "150 沙特里亚尔"
    }
  },
  {
    id: 40,
    category: 'bathroom',
    name: {
      ar: "مرحاض",
      en: "Toilet Unit",
      fr: "Toilette / WC",
      ur: "ٹوائلٹ سیٹ",
      zh: "马桶"
    },
    price: {
      ar: "1,000 ريال",
      en: "1,000 SAR",
      fr: "1 000 SAR",
      ur: "1,000 ریال",
      zh: "1,000 沙特里亚尔"
    }
  },
  {
    id: 41,
    category: 'bathroom',
    name: {
      ar: "شطاف",
      en: "Bidet Sprayer / Shattaf",
      fr: "Douchette WC / Shattaf",
      ur: "مسلم شاور",
      zh: "洁身喷头 / 妇洗器"
    },
    price: {
      ar: "200 ريال",
      en: "200 SAR",
      fr: "200 SAR",
      ur: "200 ریال",
      zh: "200 沙特里亚尔"
    }
  },
  {
    id: 42,
    category: 'bathroom',
    name: {
      ar: "دش يدوي",
      en: "Handheld Shower Head",
      fr: "Douchette à main",
      ur: "ہینڈ شاور",
      zh: "手持淋浴花洒"
    },
    price: {
      ar: "250 ريال",
      en: "250 SAR",
      fr: "250 SAR",
      ur: "250 ریال",
      zh: "250 沙特里亚尔"
    }
  },
  {
    id: 43,
    category: 'bathroom',
    name: {
      ar: "خلاط الدش",
      en: "Shower Mixer Valve",
      fr: "Mitigeur de douche",
      ur: "شاور مکسر والو",
      zh: "淋浴混水阀龙头"
    },
    price: {
      ar: "600 ريال",
      en: "600 SAR",
      fr: "600 SAR",
      ur: "600 ریال",
      zh: "600 沙特里亚尔"
    }
  },
  {
    id: 44,
    category: 'bathroom',
    name: {
      ar: "حاجز / باب الدش الزجاجي",
      en: "Glass Shower Door / Screen",
      fr: "Paroi / Porte de douche en verre",
      ur: "شیشے کا شاور دروازہ",
      zh: "玻璃淋浴门 / 隔断"
    },
    price: {
      ar: "1,500 ريال",
      en: "1,500 SAR",
      fr: "1 500 SAR",
      ur: "1,500 ریال",
      zh: "1,500 沙特里亚尔"
    }
  },
  {
    id: 45,
    category: 'bathroom',
    name: {
      ar: "حامل المناشف",
      en: "Towel Ring / Holder",
      fr: "Porte-serviette anneau",
      ur: "تولیہ ہولڈر",
      zh: "毛巾挂杆 / 环"
    },
    price: {
      ar: "250 ريال",
      en: "250 SAR",
      fr: "250 SAR",
      ur: "250 ریال",
      zh: "250 沙特里亚尔"
    }
  },
  {
    id: 46,
    category: 'room_amenities',
    name: {
      ar: "تلبيسة الجدار الخشبية",
      en: "Wooden Wall Cladding",
      fr: "Habillage mural en bois",
      ur: "لکڑی کا وال پینل",
      zh: "木质护墙板"
    },
    price: {
      ar: "1,200 ريال للمتر",
      en: "1,200 SAR / meter",
      fr: "1 200 SAR / mètre",
      ur: "1,200 ریال فی میٹر",
      zh: "1,200 沙特里亚尔/米"
    }
  },
  {
    id: 47,
    category: 'fees',
    name: {
      ar: "رسوم الصيانة",
      en: "Maintenance Fee",
      fr: "Frais de maintenance",
      ur: "مرمت فیس",
      zh: "维修人工费"
    },
    price: {
      ar: "200 ريال",
      en: "200 SAR",
      fr: "200 SAR",
      ur: "200 ریال",
      zh: "200 沙特里亚尔"
    }
  },
  {
    id: 48,
    category: 'fees',
    name: {
      ar: "رسوم التوصيل",
      en: "Delivery / Shipping Fee",
      fr: "Frais de livraison",
      ur: "ڈیلیوری فیس",
      zh: "配送运费"
    },
    price: {
      ar: "100 ريال",
      en: "100 SAR",
      fr: "100 SAR",
      ur: "100 ریال",
      zh: "100 沙特里亚尔"
    }
  }
];
