export interface CategoryData {
  id: string;
  title: string;
  englishTitle: string;
  icon: string;
  bgGradient: string;
  textColor: string;
  borderColor: string;
  games: string[];
}

export const categoriesData: CategoryData[] = [
  {
    id: "fun_games",
    title: "ألعاب ممتعة",
    englishTitle: "LET'S PLAY",
    icon: "🕹️",
    bgGradient: "from-[#ff9a9e]/90 to-[#fecfef]/90",
    textColor: "text-pink-700",
    borderColor: "border-pink-300",
    games: ["arrowRacer", "tapRacer", "safari", "catcher", "spaceCatcher", "maze", "ninja", "space", "train", "funWhackAMole", "funHiddenCup"]
  },
  {
    id: "arabic",
    title: "اللغة العربية",
    englishTitle: "ARABIC LANGUAGE",
    icon: "📖",
    bgGradient: "from-[#a1c4fd]/90 to-[#c2e9fb]/90",
    textColor: "text-blue-700",
    borderColor: "border-blue-300",
    games: ["spelling", "sorting", "quran", "arabicLetterTracing", "arabicShadowMatch", "kitchenMarketList"]
  },
  {
    id: "math",
    title: "عبقري الحساب",
    englishTitle: "MATH GENIUS",
    icon: "🧮",
    bgGradient: "from-[#ffecd2]/90 to-[#fcb69f]/90",
    textColor: "text-orange-700",
    borderColor: "border-orange-300",
    games: ["math", "connectDots", "memory", "mathNumberTrain", "mathSpaceTower"]
  },
  {
    id: "kitchen",
    title: "مطبخ بلومي",
    englishTitle: "BLOOMLY'S KITCHEN",
    icon: "👩‍🍳",
    bgGradient: "from-[#fccb90]/90 to-[#d57eeb]/90",
    textColor: "text-purple-700",
    borderColor: "border-purple-300",
    games: ["chef", "kitchenSandwichMaker", "kitchenBakingCake", "kitchenMarketList"]
  },
  {
    id: "stories",
    title: "هيا نقرأ",
    englishTitle: "LET'S READ",
    icon: "📚",
    bgGradient: "from-[#84fab0]/90 to-[#8fd3f4]/90",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-300",
    games: ["stories"]
  },
  {
    id: "english",
    title: "اللغة الإنجليزية",
    englishTitle: "ENGLISH LANGUAGE",
    icon: "🔤",
    bgGradient: "from-[#e0c3fc]/90 to-[#8ec5fc]/90",
    textColor: "text-indigo-700",
    borderColor: "border-indigo-300",
    games: ["spellingEn", "englishLetterTracing", "englishColorCloud"]
  },
  {
    id: "coloring",
    title: "التلوين والفن",
    englishTitle: "ART & COLORING",
    icon: "🎨",
    bgGradient: "from-[#ffd1ff]/90 to-[#fad0c4]/90",
    textColor: "text-rose-600",
    borderColor: "border-rose-300",
    games: ["coloring", "drawingSymmetry"]
  },
  {
    id: "habits",
    title: "عاداتي اليومية",
    englishTitle: "DAILY HABITS",
    icon: "🌟",
    bgGradient: "from-[#f6d365]/90 to-[#fda085]/90",
    textColor: "text-amber-700",
    borderColor: "border-amber-300",
    games: ["dailyHabits"]
  },
  {
    id: "farm",
    title: "مزرعتي السحرية",
    englishTitle: "MY MAGICAL FARM",
    icon: "🚜🌾",
    bgGradient: "from-[#c2e59c]/90 to-[#64b3f4]/90",
    textColor: "text-teal-700",
    borderColor: "border-teal-300",
    games: ["farm"]
  }
];
