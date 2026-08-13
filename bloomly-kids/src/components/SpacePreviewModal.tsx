import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Model3D from './Model3D';
// @ts-ignore
import solarSystemModel from './orbiting_solar_system.glb?url';
// @ts-ignore
import astronautModel from './walking_astronaut.glb?url';
// @ts-ignore
import flyingSaucerModel from './flying_saucer.glb?url';

interface Props {
  onBack: () => void;
}

interface PlanetData {
  nameAr: string;
  color: string;
  icon: string;
  description: string;
  surfaceFact: string;
}

const planetMap: Record<string, PlanetData> = {
  mercury: { 
    nameAr: 'عطارد', 
    color: '#9CA3AF', 
    icon: '🪐', 
    description: 'أقرب كوكب إلى الشمس وأصغر كواكب المجموعة الشمسية. سطحه مليء بالفوهات البركانية ويشبه القمر تماماً في طبيعته الصلبة الصخرية.', 
    surfaceFact: 'تتراوح درجة حرارة سطحه بشكل مذهل بين 430 درجة مئوية نهاراً و -180 درجة مئوية ليلاً لعدم وجود غلاف جوي يحبس الحرارة!' 
  },
  venus: { 
    nameAr: 'الزهرة', 
    color: '#FBBF24', 
    icon: '🪐', 
    description: 'أشد كواكب المجموعة الشمسية حرارة بسبب غلافه الجوي الكثيف جداً الذي يحبس الحرارة بنسبة هائلة كالصوبة الزجاجية.', 
    surfaceFact: 'الضغط الجوي على سطح كوكب الزهرة يعادل 90 ضعف الضغط الجوي على الأرض، وغيومه تمطر حمض الكبريتيك الحارق!' 
  },
  earth: { 
    nameAr: 'الأرض', 
    color: '#3B82F6', 
    icon: '🌍', 
    description: 'كوكبنا الأزرق الجميل والموطن الوحيد للحياة المعروف في الكون حتى الآن، بفضل وجود الماء السائل والأكسجين المعتدل.', 
    surfaceFact: 'الغلاف الجوي للأرض يحتوي على درع مغناطيسي غير مرئي يحمينا من الرياح الشمسية والإشعاعات الفضائية القاتلة!' 
  },
  mars: { 
    nameAr: 'المريخ', 
    color: '#EF4444', 
    icon: '🔴', 
    description: 'الكوكب الأحمر الشهير. يحتوي على أكبر البراكين والأودية العميقة، ويسعى العلماء جاهدين لإرسال أول رحلة بشرية لسطحه قريباً.', 
    surfaceFact: 'لون المريخ الأحمر ناتج عن انتشار صدأ الحديد (أكسيد الحديد) على سطحه، وهو موطن لأعلى بركان بالكون يبلغ ثلاثة أضعاف قمة إيفرست!' 
  },
  jupiter: { 
    nameAr: 'المشتري', 
    color: '#F97316', 
    icon: '🪐', 
    description: 'عملاق الغاز وأضخم كواكب المجموعة الشمسية قاطبة. يدور حول نفسه بسرعة فائقة ويتميز بعواصفه الجوية الهائلة المتشابكة.', 
    surfaceFact: 'يحتوي المشتري على البقعة الحمراء العظيمة وهي إعصار عملاق مستعر منذ أكثر من 300 عام، وتتسع مساحتها لكوكبي أرض كاملين!' 
  },
  saturn: { 
    nameAr: 'زحل', 
    color: '#F59E0B', 
    icon: '🪐', 
    description: 'الكوكب الحلقي البديع وثاني أكبر كوكب في نظامنا الشمسي. حلقاته المميزة تتكون أساساً من مليارات جسيمات الجليد والصخور والغبار اللامع.', 
    surfaceFact: 'كثافة كوكب زحل أقل من كثافة الماء، مما يعني أنه لو وضع في حوض مائي عملاق يتسع له فإنه سيطفو على السطح بكل سهولة!' 
  },
  uranus: { 
    nameAr: 'أورانوس', 
    color: '#06B6D4', 
    icon: '🪐', 
    description: 'العملاق الجليدي الأزرق البارد ذو الغلاف الغازي المتجمد. يدور حول الشمس بطريقة فريدة ككرة تتدحرج على جانبها المائل.', 
    surfaceFact: 'يميل محور دوران أورانوس بزاوية تقارب 98 درجة، مما يجعل قطبيه الشمالي والجنوبي يتبادلان الفصول لفترات تمتد لعقود!' 
  },
  neptune: { 
    nameAr: 'نبتون', 
    color: '#1D4ED8', 
    icon: '🪐', 
    description: 'أبعد كواكب المجموعة الشمسية وأكثرها برودة وعزلة. يتميز بلونه الأزرق الداكن الساحر ورياحه الفضائية التي تفوق سرعة الصوت.', 
    surfaceFact: 'تهب على نبتون أقوى رياح في النظام الشمسي على الإطلاق، حيث تصل سرعتها القصوى لحوالي 2,100 كيلومتر في الساعة!' 
  }
};

export default function SpacePreviewModal({ onBack }: Props) {
  const [astronautAnim, setAstronautAnim] = useState<'floating' | 'wave' | 'moon_walk'>('floating');
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'explore' | 'visit' | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Twinkling star particle configuration
  const [stars, setStars] = useState<Array<{ id: number; top: string; left: string; size: number }>>([]);

  useEffect(() => {
    // Generate random star coordinates
    const starArr = [];
    for (let i = 0; i < 60; i++) {
      starArr.push({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1
      });
    }
    setStars(starArr);
  }, []);

  // Periodic Walking Animation every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (astronautAnim === 'floating' && !activeMode) {
        setAstronautAnim('moon_walk');
        setTimeout(() => {
          setAstronautAnim('floating');
        }, 2000);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [astronautAnim, activeMode]);

  const triggerAstronautAction = () => {
    if (astronautAnim !== 'floating') return;
    playPopSound();
    setAstronautAnim('wave');
    setTimeout(() => {
      setAstronautAnim('floating');
    }, 3500);
  };

  const handleModelClick = (clickedName?: string) => {
    if (!clickedName) return;
    const nameLower = clickedName.toLowerCase();
    
    // Detect which planet was clicked
    let matchedPlanetKey: string | null = null;
    for (const key of Object.keys(planetMap)) {
      if (nameLower.includes(key)) {
        matchedPlanetKey = key;
        break;
      }
    }

    if (matchedPlanetKey) {
      playPopSound();
      setSelectedPlanet(matchedPlanetKey);
      setNotification(matchedPlanetKey);
    }
  };

  const playPopSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  const planetData = selectedPlanet ? planetMap[selectedPlanet] : null;

  return (
    <div className="fixed inset-0 w-full h-full bg-[#030306] z-50 flex flex-col items-center justify-center select-none overflow-hidden font-sans">
      
      {/* 1. IMMERSIVE SPACE STARS */}
      {stars.map(s => (
        <div 
          key={`star-${s.id}`}
          className="absolute bg-white rounded-full opacity-50 pointer-events-none"
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
          }}
        />
      ))}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] animate-pulse pointer-events-none" />

      {/* 2. SOLAR SYSTEM PREVIEW AREA */}
      <div className="relative w-full h-full max-w-5xl flex items-center justify-center">
        
        {/* Ambient Space Light Effects */}
        <div className="absolute w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-3xl" />
        
        {/* 3D Orbiting Solar System */}
        <Model3D 
          src={solarSystemModel} 
          animationName="natural_orbit" 
          className="w-full h-full z-10"
          scaleAdjustment={1.4}
          colorMapping={false}
          onClick={handleModelClick}
          focusTarget={activeMode === 'visit' ? selectedPlanet : null}
        />

        {/* 3D Hovering UFO spaceship */}
        <div className="absolute top-[8%] right-[8%] z-20 w-32 h-32 flex flex-col items-center">
          <Model3D 
            src={flyingSaucerModel} 
            animationName="hover" 
            className="w-full h-full"
            scaleAdjustment={1.3}
            autoRotate={true}
            rotationSpeed={0.005}
            colorMapping={false}
          />
        </div>

        {/* 3D Interactive Astronaut floating */}
        <div className="absolute bottom-[5%] left-[5%] z-20 w-36 h-36 flex flex-col items-center">
          <Model3D 
            src={astronautModel} 
            animationName={astronautAnim} 
            className="w-full h-full"
            scaleAdjustment={1.4}
            onClick={triggerAstronautAction}
            colorMapping={false}
          />
        </div>

        {/* 3. PREMIUM FLOATING SPACE HOME BUTTON */}
        <div className="absolute bottom-[5%] right-[5%] z-30 w-24 h-24 flex items-center justify-center">
          <button
            onClick={() => {
              playPopSound();
              onBack();
            }}
            className="w-full h-full hover:scale-105 active:translate-y-[4px] active:scale-95 transition-all cursor-pointer select-none"
          >
            <svg viewBox="0 0 200 228" fill="none" className="w-full h-full">
              <defs>
                <linearGradient id="btnGradSpaceBack" x1="48" y1="38" x2="152" y2="168" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFE04A"></stop>
                  <stop offset="44%" stopColor="#FFAA00"></stop>
                  <stop offset="100%" stopColor="#FF7800"></stop>
                </linearGradient>
                <radialGradient id="glossSpaceBack" cx="34%" cy="26%" r="50%" fx="25%" fy="17%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.90"></stop>
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.20"></stop>
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0"></stop>
                </radialGradient>
                <radialGradient id="rimSpaceBack" cx="50%" cy="50%" r="50%">
                  <stop offset="65%" stopColor="#ffffff" stopOpacity="0"></stop>
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.28"></stop>
                </radialGradient>
                <clipPath id="ccSpaceBack">
                  <circle cx="100" cy="104" r="58"></circle>
                </clipPath>
              </defs>
              <circle cx="100" cy="112" r="58" fill="#C04800" opacity="0.9"></circle>
              <circle cx="100" cy="104" r="58" fill="url(#btnGradSpaceBack)" stroke="white" strokeWidth="6"></circle>
              <circle cx="100" cy="104" r="58" fill="url(#rimSpaceBack)" clipPath="url(#ccSpaceBack)"></circle>
              <ellipse cx="78" cy="74" rx="36" ry="25" fill="url(#glossSpaceBack)" clipPath="url(#ccSpaceBack)"></ellipse>
              <path d="
                M 100,83
                Q 100,80 103,83
                L 120,100
                Q 123,103 123,106
                L 123,123
                Q 123,126 120,126
                L 80,126
                Q 77,126 77,123
                L 77,106
                Q 77,103 80,100
                L 97,83
                Q 100,80 100,83
                Z
              " fill="white"></path>
              <rect x="92" y="112" width="16" height="14" rx="4" fill="url(#btnGradSpaceBack)"></rect>
            </svg>
          </button>
        </div>

      </div>

      {/* 4. FUTURISTIC SPACE NOTIFICATION ALERTS */}
      <AnimatePresence>
        {notification && planetData && !activeMode && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-8 z-40 w-[90%] max-w-md bg-slate-950/80 backdrop-blur-md border border-blue-500/30 rounded-[28px] p-5 shadow-[0_0_30px_rgba(59,130,246,0.25)] flex flex-col items-center"
          >
            <div className="flex items-center gap-3 mb-3 flex-row-reverse text-right">
              <span className="text-2xl animate-pulse">📡</span>
              <span className="text-sm font-black text-blue-300">إشارة ملتقطة: اقتراب من كوكب {planetData.nameAr}</span>
            </div>
            
            <div className="flex gap-3 w-full justify-center mt-2">
              <button
                onClick={() => {
                  playPopSound();
                  setActiveMode('visit');
                  setNotification(null);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black rounded-xl text-xs hover:scale-105 transition-all cursor-pointer border-b-4 border-indigo-800"
              >
                🚀 زيارة السطح
              </button>
              <button
                onClick={() => {
                  playPopSound();
                  setActiveMode('explore');
                  setNotification(null);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black rounded-xl text-xs hover:scale-105 transition-all cursor-pointer border-b-4 border-teal-800"
              >
                🔬 استكشاف الكوكب
              </button>
              <button
                onClick={() => {
                  playPopSound();
                  setNotification(null);
                  setSelectedPlanet(null);
                }}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-700 transition-colors cursor-pointer"
              >
                إلغاء ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. INTERACTIVE EXPLORATION MODALS */}
      <AnimatePresence>
        {activeMode && planetData && (
          <div className="absolute inset-0 w-full h-full bg-black/85 backdrop-blur-sm z-40 flex items-center justify-center p-6">
            
            {/* MODE A: Planetary Information Card */}
            {activeMode === 'explore' && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-lg bg-slate-900/95 border-4 border-blue-500 rounded-[32px] p-6 shadow-2xl relative overflow-hidden"
              >
                {/* Header Info */}
                <div className="flex items-center gap-4 border-b border-blue-500/20 pb-4 mb-5 flex-row-reverse text-right">
                  <div className="text-4xl bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20">
                    {planetData.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">بيانات كوكب {planetData.nameAr}</h3>
                    <p className="text-[10px] font-bold text-blue-400">PLANETARY EXPLORATORY DATA</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm font-bold text-slate-200 leading-relaxed mb-6 text-right dir-rtl">
                  {planetData.description}
                </p>

                {/* Action buttons */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      playPopSound();
                      setActiveMode('visit');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black rounded-xl text-xs hover:scale-105 transition-all cursor-pointer border-b-4 border-indigo-800"
                  >
                    🚀 هبوط على السطح
                  </button>
                  <button
                    onClick={() => {
                      playPopSound();
                      setActiveMode(null);
                      setSelectedPlanet(null);
                    }}
                    className="px-6 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    إغلاق قاعدة البيانات ✕
                  </button>
                </div>
              </motion.div>
            )}

            {/* MODE B: Immersive Surface Landing simulator */}
            {activeMode === 'visit' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 w-full h-full bg-[#020204] flex flex-col items-center justify-between p-6 z-50"
              >
                {/* Immersive space background for visit */}
                {stars.slice(0, 30).map(s => (
                  <div 
                    key={`visit-star-${s.id}`}
                    className="absolute bg-white rounded-full opacity-40 pointer-events-none"
                    style={{
                      top: s.top,
                      left: s.left,
                      width: `${s.size * 0.8}px`,
                      height: `${s.size * 0.8}px`,
                    }}
                  />
                ))}

                {/* Top Nav Bar */}
                <div className="w-full flex items-center justify-between border-b border-white/10 pb-4 max-w-4xl flex-row-reverse text-right">
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <span className="text-3xl animate-bounce">{planetData.icon}</span>
                    <div>
                      <h4 className="text-white font-black text-lg">سطح كوكب {planetData.nameAr}</h4>
                      <p className="text-[10px] text-yellow-400 font-bold">📍 إحداثيات الهبوط الحقيقية للمركبة</p>
                    </div>
                  </div>
                  <div className="bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20 text-[10px] text-yellow-300 font-black">
                    🚀 هبوط آمن
                  </div>
                </div>

                {/* Close-up Real Planet Display and Walk Animation */}
                <div className="relative w-full h-3/5 flex items-center justify-center max-w-4xl">
                  
                  {/* Planet Glow Backdrop */}
                  <div 
                    className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full blur-[90px] opacity-25"
                    style={{ 
                      backgroundColor: planetData.color, 
                    }}
                  />
                  
                  {/* Zoomed planet (Model3D focused on current planet node) */}
                  <div className="absolute w-72 h-72 md:w-[450px] md:h-[450px] z-10 flex items-center justify-center pointer-events-none">
                    <Model3D 
                      src={solarSystemModel}
                      className="w-full h-full"
                      focusTarget={selectedPlanet}
                      scaleAdjustment={0.7}
                      colorMapping={false}
                      autoRotate={true}
                      rotationSpeed={0.003}
                    />
                  </div>

                  {/* Astronaut walking in front of the real planet */}
                  <div className="absolute w-44 h-44 md:w-56 md:h-56 z-20 bottom-[10%] left-[50%] -translate-x-1/2 select-none pointer-events-none">
                    <Model3D 
                      src={astronautModel} 
                      animationName="moon_walk" 
                      className="w-full h-full"
                      scaleAdjustment={1.3} 
                      colorMapping={false}
                    />
                  </div>

                </div>

                {/* Planet surface fun fact panel */}
                <div className="w-full max-w-lg bg-white/5 border border-white/10 p-5 rounded-[24px] backdrop-blur-md text-center flex flex-col items-center">
                  <span className="text-xs md:text-sm mb-1 text-yellow-300">💡 حقيقة علمية هامة عن السطح</span>
                  <p className="text-xs md:text-sm font-bold text-slate-200 leading-relaxed text-right dir-rtl">
                    {planetData.surfaceFact}
                  </p>
                </div>

                {/* Return to Space Ship controller */}
                <div className="pb-4">
                  <button
                    onClick={() => {
                      playPopSound();
                      setActiveMode(null);
                      setSelectedPlanet(null);
                    }}
                    className="px-8 py-3.5 bg-gradient-to-r from-red-500 to-rose-600 border-b-4 border-rose-800 text-white font-black rounded-2xl hover:scale-105 transition-all cursor-pointer text-sm"
                  >
                    🛸 العودة إلى المركبة الفضائية
                  </button>
                </div>

              </motion.div>
            )}

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
