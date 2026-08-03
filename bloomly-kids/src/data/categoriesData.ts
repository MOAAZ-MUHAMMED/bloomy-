export interface GameItem {
  id: string;
  title: string;
  titleEn: string;
  icon: string;
  category: string;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  description: string;
  games: GameItem[];
}

export const CATEGORIES_DATA: Category[] = [
  {
    id: 'english',
    name: 'اللغة الإنجليزية',
    nameEn: 'English Learning',
    icon: '🔤',
    color: 'from-cyan-500 to-blue-600',
    description: 'تعلم تتبع الحروف ونطق الكلمات الإنجليزية بأسلوب تفاعلي',
    games: [
      { id: 'tracing-b', title: 'تتبع حرف B', titleEn: 'Trace Letter B', icon: '🐝', category: 'english', color: '#0EA5E9', difficulty: 'easy' },
      { id: 'phonics-a', title: 'صوتيات الحروف A-Z', titleEn: 'Phonics Fun', icon: '🎧', category: 'english', color: '#0284C7', difficulty: 'medium' },
      { id: 'words-matching', title: 'توصيل الكلمات بالصور', titleEn: 'Word Match', icon: '🧩', category: 'english', color: '#38BDF8', difficulty: 'medium' }
    ]
  },
  {
    id: 'math',
    name: 'الرياضيات والأرقام',
    nameEn: 'Math & Numbers',
    icon: '🔢',
    color: 'from-amber-500 to-orange-600',
    description: 'بطاقات الأرقام 3D، العمليات الحسابية، وقطار الأرقام',
    games: [
      { id: 'math-cards', title: 'بطاقات الحساب 3D', titleEn: 'Math Cards 3D', icon: '✏️', category: 'math', color: '#F59E0B', difficulty: 'easy' },
      { id: 'number-train', title: 'قطار الأرقام', titleEn: 'Number Train', icon: '🚂', category: 'math', color: '#EA580C', difficulty: 'medium' },
      { id: 'counting-objects', title: 'عد الفواكه والمجسمات', titleEn: 'Fruit Counting', icon: '🍎', category: 'math', color: '#D97706', difficulty: 'easy' }
    ]
  },
  {
    id: 'colors',
    name: 'عالم الألوان',
    nameEn: 'Colors World',
    icon: '🎨',
    color: 'from-pink-500 to-rose-600',
    description: 'استكشاف وتلوين الأشكال والمجسمات بالألوان البراقة',
    games: [
      { id: 'color-mix', title: 'مزج الألوان', titleEn: 'Color Mixer', icon: '🧪', category: 'colors', color: '#EC4899', difficulty: 'easy' },
      { id: 'color-match', title: 'طابق الألوان', titleEn: 'Match Colors', icon: '🎯', category: 'colors', color: '#E11D48', difficulty: 'easy' }
    ]
  },
  {
    id: 'animals',
    name: 'عالم الحيوانات',
    nameEn: 'Animals World',
    icon: '🦁',
    color: 'from-emerald-500 to-green-600',
    description: 'التعرف على أصوات الحيوانات وأشكالها في الغابة',
    games: [
      { id: 'animal-sounds', title: 'أصوات الحيوانات', titleEn: 'Animal Sounds', icon: '🔊', category: 'animals', color: '#10B981', difficulty: 'easy' },
      { id: 'jungle-safari', title: 'سفاري الغابة', titleEn: 'Jungle Safari', icon: '🌴', category: 'animals', color: '#059669', difficulty: 'medium' }
    ]
  },
  {
    id: 'shapes',
    name: 'الأشكال الهندسيّة',
    nameEn: 'Shapes World',
    icon: '🔷',
    color: 'from-purple-500 to-indigo-600',
    description: 'التعرف على الدائرة والمربع والمثلث والمجسمات ثلاثية الأبعاد',
    games: [
      { id: 'shape-match', title: 'تطابق الأشكال 3D', titleEn: '3D Shape Match', icon: '🧊', category: 'shapes', color: '#8B5CF6', difficulty: 'easy' }
    ]
  },
  {
    id: 'memory',
    name: 'ألعاب الذاكرة',
    nameEn: 'Memory Games',
    icon: '🧠',
    color: 'from-violet-500 to-purple-700',
    description: 'تنشيط ذاكرة الطفل من خلال تقليب البطاقات وطابق الصور',
    games: [
      { id: 'card-flip', title: 'تقليب البطاقات', titleEn: 'Card Flip', icon: '🎴', category: 'memory', color: '#7C3AED', difficulty: 'medium' }
    ]
  }
];
