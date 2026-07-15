const fs = require('fs');

const path = 'src/components/LearningPathMap.tsx';
let text = fs.readFileSync(path, 'utf8');

if (!text.includes('id: "ninja"')) {
    const new_games = `,
  {
    id: "ninja",
    title: "النينجا القاطع 🥷",
    character: "🥷 النينجا هيرو",
    characterEmoji: "🥷",
    emoji: "⚔️",
    gameName: "النينجا القاطع السريع",
    quest: "اقطع الفواكه وتفادى القنابل بدقة عالية في الوقت المحدد لإنقاذ الفواكه السحرية!",
    superpower: "السرعة الخارقة والتركيز العالي! ⚡",
    badge: "سرعة ورد فعل",
    x: 50,
    y: 30
  },
  {
    id: "space",
    title: "حرب الفضاء 🚀",
    character: "👽 الفضائي زيكو",
    characterEmoji: "👽",
    emoji: "🚀",
    gameName: "حرب الفضاء الملحمية",
    quest: "دمر سفن الأعداء واجمع النجوم في الفضاء الخارجي لحماية الكوكب الأخضر!",
    superpower: "دقة التصويب وتفادي العقبات! 🎯",
    badge: "مغامرة فضائية",
    x: 30,
    y: 50
  },
  {
    id: "farm",
    title: "مزرعة بلومي 🚜",
    character: "👨‍🌾 المزارع نشيط",
    characterEmoji: "👨‍🌾",
    emoji: "🚜",
    gameName: "مزرعة بلومي السعيدة",
    quest: "ازرع، اسقِ، واحصد المحاصيل الرائعة واعتنِ بالحيوانات لتصبح أفضل مزارع!",
    superpower: "الصبر، الرعاية، والزراعة! 🌱",
    badge: "زراعة ورعاية",
    x: 70,
    y: 40
  }
];`;
    text = text.replace('  }\n];', '  }' + new_games);
    fs.writeFileSync(path, text, 'utf8');
    console.log("Games injected successfully!");
} else {
    console.log("Games already injected!");
}
