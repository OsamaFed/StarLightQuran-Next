import type { AdhkarCategory, CategorizedData } from '@/types/adhkar';
import adhkarData from '@/data/adhkar.json';

const MORNING_SPECIFIC_KEYWORDS = [
  'أصبحنا',
  'أصبحت',
  'إذا أصبح',
  'إذا أصبحَ',
  'هذا اليوم',
  'خير هذا اليوم'
];

const EVENING_SPECIFIC_KEYWORDS = [
  'أمسينا',
  'أمسيت',
  'إذا أمسى',
  'هذه الليلة',
  'خير هذه الليلة'
];

const GENERAL_ADHKAR_CATEGORIES = [
  'أذكار النوم',
  'أذكار الاستيقاظ من النوم',
  'الذكر قبل الوضوء',
  'الذكر بعد الفراغ من الوضوء',
  'الذكر عند الخروج من المنزل',
  'الذكر عند دخول المنزل',
  'أذكار الآذان',
  'الأذكار بعد السلام من الصلاة',
  'الذكر عقب السلام من الوتر',
  'التشهد',
  'الصلاة على النبي بعد التشهد',
  'الذكر بعد نزول المطر',
  'التسبيح والتحميد والتهليل والتكبير',
  'كفارة المجلس',
  'ما يقال في المجلس',
  'أذكار الحج والعمرة',
  'التكبير والتسبيح في سير الحج والعمرة',
  'التهليل',
  'كيف كان النبي يسبح؟',
  'أفضل الدعاء',
  'ما يقوله عند ذبح الأضحية أو العقيقة',
  'ما يعوذ به الأولاد',
  'ما يفعل من رأى الرؤيا أو الحلم',
  'ما يقول من خاف قوما',
  'ما يقول ويفعل من أذنب ذنبا',
  'ما يعصم الله به من الدجال',
  'ما يقول إذا وضع ثوبه',
  'ما يقال للكافر إذا عطس فحمد الله',
  'ما يقول الصائم إذا سابه أحد',
  'تهنئة المولود له وجوابه',
  'ﺗﻬنئة المولود له وجوابه',
  'تلقين المحتضر',
  'فضل عيادة المريض'
];

const ADHKAR_CATEGORY_PATTERNS = [
  'أذكار',
  'الذكر',
  'الأذكار',
  'ما يقول',
  'ما يقال',
  'ما يفعل',
  'ما يعوذ',
  'ما يعصم',
  'فضل',
  'تهنئة',
  'ﺗﻬنئة',
  'تلقين',
  'كفارة',
  'التشهد',
  'الصلاة على النبي'
];

function containsMorningKeywords(text: string): boolean {
  return MORNING_SPECIFIC_KEYWORDS.some(keyword => text.includes(keyword));
}

function containsEveningKeywords(text: string): boolean {
  return EVENING_SPECIFIC_KEYWORDS.some(keyword => text.includes(keyword));
}

function isMorningAndEveningCategory(category: string): boolean {
  return category === 'أذكار الصباح والمساء';
}

function isDuaCategory(category: string): boolean {
  const lowerCategory = category.trim();
  
  if (isExplicitAdhkarCategory(lowerCategory)) {
    return false;
  }
  
  return lowerCategory.startsWith('دعاء') || 
         lowerCategory.startsWith('الدعاء') ||
         lowerCategory.includes('دعاء') ||
         lowerCategory.includes('القرآن') ||
         lowerCategory.includes('استغفار') ||
         lowerCategory.includes('توبة');
}

function isExplicitAdhkarCategory(category: string): boolean {
  if (GENERAL_ADHKAR_CATEGORIES.includes(category)) {
    return true;
  }
  
  return ADHKAR_CATEGORY_PATTERNS.some(pattern => category.includes(pattern));
}

export function categorizeAdhkar(): CategorizedData {
  const data = adhkarData as AdhkarCategory[];
  
  const adhkarSabah: AdhkarCategory[] = [];
  const adhkarMasa: AdhkarCategory[] = [];
  const adhkarGeneral: AdhkarCategory[] = [];
  const duas: AdhkarCategory[] = [];
  
  for (const item of data) {
    const category = item.category;
    
    if (isMorningAndEveningCategory(category)) {
      const morningOnlyItems: typeof item.array = [];
      const eveningOnlyItems: typeof item.array = [];
      const sharedItems: typeof item.array = [];
      
      for (const adhkar of item.array) {
        const text = adhkar.text;
        const hasMorning = containsMorningKeywords(text);
        const hasEvening = containsEveningKeywords(text);
        
        if (hasMorning && hasEvening) {
          sharedItems.push(adhkar);
        } else if (hasMorning && !hasEvening) {
          morningOnlyItems.push(adhkar);
        } else if (hasEvening && !hasMorning) {
          eveningOnlyItems.push(adhkar);
        } else {
          sharedItems.push(adhkar);
        }
      }
      
      const sabahItems = [...sharedItems, ...morningOnlyItems];
      const masaItems = [...sharedItems, ...eveningOnlyItems];
      
      if (sabahItems.length > 0) {
        adhkarSabah.push({
          ...item,
          category: 'أذكار الصباح',
          array: sabahItems
        });
      }
      
      if (masaItems.length > 0) {
        adhkarMasa.push({
          ...item,
          category: 'أذكار المساء',
          array: masaItems
        });
      }
    } else if (isDuaCategory(category)) {
      duas.push(item);
    } else if (isExplicitAdhkarCategory(category)) {
      adhkarGeneral.push(item);
    } else {
      duas.push(item);
    }
  }
  
  return {
    adhkarSabah,
    adhkarMasa,
    adhkarGeneral: adhkarGeneral.sort((a, b) => a.category.localeCompare(b.category, 'ar')),
    duas: duas.sort((a, b) => a.category.localeCompare(b.category, 'ar'))
  };
}

export function getAdhkarSabah(): AdhkarCategory[] {
  return categorizeAdhkar().adhkarSabah;
}

export function getAdhkarMasa(): AdhkarCategory[] {
  return categorizeAdhkar().adhkarMasa;
}

export function getAdhkarGeneral(): AdhkarCategory[] {
  return categorizeAdhkar().adhkarGeneral;
}

export function getDuas(): AdhkarCategory[] {
  const categorized = categorizeAdhkar();
  const duas = categorized.duas;
  
  const sampleDuas = [
    {
      id: 1001,
      category: "دعاء قبل الصلاة",
      array: [
        { id: 1, text: "اللهم اجعلني من التوابين واجعلني من المتطهرين", count: 1 },
      ],
    },
    {
      id: 1002,
      category: "دعاء الاستفتاح",
      array: [
        { id: 1, text: "سبحانك اللهم وبحمدك، وتبارك اسمك، وتعالى جدك، ولا إله غيرك", count: 1 },
      ],
    },
    {
      id: 1003,
      category: "دعاء بعد الصلاة",
      array: [
        { id: 1, text: "أستغفر الله، أستغفر الله، أستغفر الله، اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام", count: 1 },
      ],
    },
    {
      id: 1004,
      category: "دعاء الفرج",
      array: [
        { id: 1, text: "لا إله إلا الله العظيم الحليم، لا إله إلا الله رب العرش العظيم، لا إله إلا الله رب السماوات ورب الأرض ورب العرش الكريم", count: 7 },
      ],
    },
    {
      id: 1005,
      category: "دعاء الراحة النفسية",
      array: [
        { id: 1, text: "اللهم إني أعوذ بك من الهم والحزن، وأعوذ بك من العجز والكسل، وأعوذ بك من الجبن والبخل، وأعوذ بك من غلبة الدين وقهر الرجال", count: 3 },
      ],
    },
    {
      id: 1006,
      category: "دعاء دخول المنزل",
      array: [
        { id: 1, text: "بسم الله ولجنا، وبسم الله خرجنا، وعلى ربنا توكلنا", count: 1 },
      ],
    },
    {
      id: 1007,
      category: "دعاء زيارة القبور",
      array: [
        { id: 1, text: "السلام عليكم أهل الديار من المؤمنين والمسلمين، وإنا إن شاء الله بكم لاحقون، أسأل الله لنا ولكم العافية", count: 1 },
      ],
    },
    {
      id: 1008,
      category: "دعاء ربنا آتنا",
      array: [
        { id: 1, text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", count: 3 },
      ],
    },
    {
      id: 1009,
      category: "دعاء يونس عليه السلام",
      array: [
        { id: 1, text: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ", count: 7 },
      ],
    },
    {
      id: 1010,
      category: "دعاء موسى عليه السلام",
      array: [
        { id: 1, text: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي", count: 3 },
        { id: 2, text: "رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ", count: 1 },
        { id: 3, text: "رَبِّ إِنِّي ظَلَمْتُ نَفْسِي فَاغْفِرْ لي", count: 1 },
      ],
    },
    {
      id: 1011,
      category: "دعاء زكريا عليه السلام",
      array: [
        { id: 1, text: "رَبِّ لَا تَذَرْني فَرْدًا وَأَنتَ خَيْرُ الْوارِثِينَ", count: 1 },
      ],
    },
    {
      id: 1012,
      category: "دعاء إبراهيم عليه السلام",
      array: [
        { id: 1, text: "رَبِّ اجْعَلِنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاء", count: 1 },
      ],
    },
    {
      id: 1013,
      category: "دعاء أيوب عليه السلام",
      array: [
        { id: 1, text: "رَبِّ إني مسنيَ الضُر وأنت أرحم الراحمين", count: 1 },
      ],
    },
    {
      id: 1014,
      category: "دعاء نوح عليه السلام",
      array: [
        { id: 1, text: "ربِ إني مغلوبٍ فأنتصر", count: 1 },
        { id: 2, text: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَنْ دَخَلَ بَيْتِي مُؤْمِناً وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ", count: 1 },
      ],
    },
    {
      id: 1015,
      category: "دعاء يعقوب عليه السلام",
      array: [
        { id: 1, text: "إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ", count: 1 },
      ],
    },
    {
      id: 1016,
      category: "دعاء سليمان عليه السلام",
      array: [
        { id: 1, text: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ", count: 1 },
      ],
    },
    {
      id: 1017,
      category: "دعاء يوسف عليه السلام",
      array: [
        { id: 1, text: "اللَّهُم يا فَاطِرَ السَّمَوَاتِ وَالأَرْضِ أَنْتَ وَلِيِّي فِي الدُّنْيَا وَالآخِرَةِ تَوَفَّنِي مُسْلِمًا وَأَلْحِقْنِي بِالصَّالِحِينَ", count: 1 },
      ],
    },
    {
      id: 1018,
      category: "سيد الاستغفار",
      array: [
        { id: 1, text: "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك علي، وأبوء بذنبي، فاغفر لي، فإنه لا يغفر الذنوب إلا أنت", count: 1 },
      ],
    },
    {
      id: 1019,
      category: "الاستغفار",
      array: [
        { id: 1, text: "أستغفر الله الذي لا إله إلا هو الحي القيوم وأتوب إليه", count: 3 },
        { id: 2, text: "رب اغفر لي وتب علي إنك أنت التواب الغفور", count: 100 },
      ],
    },
  ] as AdhkarCategory[];

  const combined = [...duas, ...sampleDuas];
  
  // Filter out duplicates and sort by category name
  const uniqueDuas = Array.from(new Map(combined.map(item => [item.category, item])).values());
  return uniqueDuas.sort((a, b) => a.category.localeCompare(b.category, 'ar'));
}

export function getTotalItemsCount(categories: AdhkarCategory[]): number {
  return categories.reduce((total, cat) => total + cat.array.length, 0);
}
