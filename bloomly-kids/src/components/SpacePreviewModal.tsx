import React, { useState, useEffect, useMemo } from 'react';
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

const PLANET_DATA: Record<string, {
  nameAr: string;
  description: string;
  surfaceFact: string;
  color: string;
  icon: string;
}> = {
  Sun: {
    nameAr: "الشمس",
    description: "نجم ملتهب يمثل مركز مجموعتنا الشمسية، وحرارته الهائلة تمدنا بالدفء والطاقة ولولاها لعشنا في ظلام وبرد دائم!",
    surfaceFact: "حرارة حارقة جداً تصل إلى 15 مليون درجة مئوية! لا توجد مركبة فضائية قادرة على الهبوط عليها دون أن تذوب!",
    color: "#ff8c00",
    icon: "☀️"
  },
  Mercury: {
    nameAr: "عطارد",
    description: "أصغر كواكب المجموعة الشمسية وأقربها إلى الشمس، يدور بسرعة هائلة حولها ويتميز بسطحه الصخري المليء بالفوهات البركانية.",
    surfaceFact: "الجاذبية ضعيفة جداً، والطقس متطرف: شديد السخونة نهاراً وشديد البرودة ليلاً لعدم وجود غلاف جوي يحميه!",
    color: "#a9a9a9",
    icon: "🪐"
  },
  Venus: {
    nameAr: "الزهرة",
    description: "الكوكب الأكثر سخونة ولمعاناً في السماء، ويتميز بغلاف جوي سميك يحبس الحرارة مثل الصوبة الزجاجية الكبيرة.",
    surfaceFact: "الضغط الجوي هنا هائل وحرارته تذيب الرصاص! سطحه مليء بالبراكين الثائرة والجبال الصخرية الصفراء.",
    color: "#e6c280",
    icon: "🪐"
  },
  Earth: {
    nameAr: "الأرض",
    description: "كوكبنا الجميل الملقب بالكوكب الأزرق، وهو الكوكب الوحيد الذي تتوفر فيه الحياة والماء العذب والهواء النقي لنتنفسه.",
    surfaceFact: "درجة الحرارة هنا معتدلة ومثالية للحياة! الجاذبية مناسبة جداً لتتحرك وتلعب بحرّية دون أن تطير في الهواء.",
    color: "#1e90ff",
    icon: "🌍"
  },
  Mars: {
    nameAr: "المريخ",
    description: "الكوكب الأحمر المثير، ويسمى بذلك لأن صخوره تحتوي على الحديد الصدئ، وهو هدف العلماء الأول لبناء مستعمرات فضائية مستقبلاً.",
    surfaceFact: "الجاذبية هنا تعادل ثلث جاذبية الأرض، لذا يمكنك القفز لارتفاعات شاهقة بسهولة! وتوجد عواصف رملية حمراء ضخمة.",
    color: "#ff4500",
    icon: "🔴"
  },
  Jupiter: {
    nameAr: "المشتري",
    description: "عملاق الغاز وأكبر كواكب المجموعة الشمسية، يتسع ليتسع لكل الكواكب مجتمعة داخله! ويتميز ببقعته الحمراء العظيمة وهي عاصفة مستمرة.",
    surfaceFact: "كوكب غازي بالكامل! لا توجد أرض صلبة لتقف عليها، بل غازات متحركة وضغط جوي هائل يمنع أي هبوط.",
    color: "#d2b48c",
    icon: "🪐"
  },
  Saturn: {
    nameAr: "زحل",
    description: "جوهرة النظام الشمسي البديعة، يشتهر بحلقاته الساحرة الملونة المكونة من ملايين القطع الجليدية والصخور المتربة التي تدور حوله.",
    surfaceFact: "الرياح هنا سريعة جداً وتصل لـ 1800 كم في الساعة! وهو كوكب غازي بارد ذو جاذبية قوية.",
    color: "#f4a460",
    icon: "🪐"
  },
  Uranus: {
    nameAr: "أورانوس",
    description: "العملاق الجليدي ذو اللون الأزرق المخضر الهادئ، ويدور على جانبه بشكل مائل فريد جداً كأنه كرة تتدحرج حول الشمس.",
    surfaceFact: "شديد البرودة حيث تصل درجة الحرارة لـ -224 مئوية! سطحه عبارة عن محيطات متجمدة من الغازات المسالة.",
    color: "#afeeee",
    icon: "🪐"
  },
  Neptune: {
    nameAr: "نبتون",
    description: "الكوكب الأزرق البعيد والبارد جداً، أبعد كواكب مجموعتنا عن الشمس، ويتميز بلونه الأزرق الداكن كالمحيط الهادئ السحيق.",
    surfaceFact: "تهب هنا أقوى وأسرع رياح عاصفة في المجموعة الشمسية بسرعة 2100 كم/ساعة، وهو كوكب متجمد ومظلم.",
    color: "#4169e1",
    icon: "🪐"
  }
};

const getPlanetFromClickedName = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('sun') || n.includes('shams') || n.includes('center')) return 'Sun';
  if (n.includes('mercury') || n.includes('otar')) return 'Mercury';
  if (n.includes('venus') || n.includes('zoh') || n.includes('zuh')) return 'Venus';
  if (n.includes('earth') || n.includes('ard') || n.includes('blue')) return 'Earth';
  if (n.includes('mars') || n.includes('mar') || n.includes('mer')) return 'Mars';
  if (n.includes('jupiter') || n.includes('mosht')) return 'Jupiter';
  if (n.includes('saturn') || n.includes('zohal')) return 'Saturn';
  if (n.includes('uranus')) return 'Uranus';
  if (n.includes('neptune')) return 'Neptune';
  
  // Fallback to random known planet on generic hit
  const planets = ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  return planets[Math.floor(Math.random() * planets.length)];
};

export default function SpacePreviewModal({ onBack }: Props) {
  const [astronautAnim, setAstronautAnim] = useState<'floating' | 'wave' | 'moon_walk'>('floating');
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'explore' | 'visit' | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  // Generate random twinkling stars array once
  const stars = useMemo(() => {
    return Array.from({ length: 45 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2.2 + 1.2, // sizes between 1.2px and 3.4px
      delay: `${Math.random() * 4}s`,
      duration: `${3 + Math.random() * 3}s`
    }));
  }, []);

  // Handle dynamic standing/walking loop for astronaut
  useEffect(() => {
    if (astronautAnim !== 'floating') return;

    // Trigger walk animation every 6 seconds
    const timer = setInterval(() => {
      setAstronautAnim('moon_walk');
      
      // Stop walking and return to floating after 2.5 seconds
      setTimeout(() => {
        setAstronautAnim(curr => curr === 'moon_walk' ? 'floating' : curr);
      }, 2500);
    }, 6000);

    return () => clearInterval(timer);
  }, [astronautAnim]);

  // Hide notification banner automatically after 7 seconds if not clicked
  useEffect(() => {
    if (showBanner) {
      const bannerTimer = setTimeout(() => {
        setShowBanner(false);
      }, 7000);
      return () => clearTimeout(bannerTimer);
    }
  }, [showBanner]);

  const triggerAstronautAction = () => {
    // Wave greeting animation on click
    setAstronautAnim('wave');
    
    // Return to floating after 3.5 seconds
    setTimeout(() => {
      setAstronautAnim('floating');
    }, 3500);
  };

  // Play click sound
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

  // Click on Solar System callback - triggers notification banner
  const handleSolarSystemClick = (clickedName?: string) => {
    const name = clickedName || "";
    const planet = getPlanetFromClickedName(name);
    setSelectedPlanet(planet);
    setShowBanner(true); // Drop notification banner from top
    playPopSound();
  };

  const planetData = selectedPlanet ? PLANET_DATA[selectedPlanet] : null;

  return (
    <div 
      className="fixed inset-0 w-full h-full z-50 flex flex-col items-center justify-center select-none overflow-hidden font-sans"
      style={{ background: 'radial-gradient(circle, #080a12 0%, #010204 80%, #000000 100%)' }}
    >
      {/* Global twinkling keyframe injected */}
      <style>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50% { opacity: 0.85; transform: scale(1.25); }
        }
      `}</style>

      {/* 1. TWINKLING STARS IN SPACE */}
      {stars.map(star => (
        <div 
          key={star.id}
          className="absolute bg-white rounded-full pointer-events-none z-0"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: 0.6,
            boxShadow: star.size > 2.2 ? '0 0 8px #ffffff' : 'none',
            animation: `starTwinkle ${star.duration} infinite ease-in-out`,
            animationDelay: star.delay
          }}
        />
      ))}
      
      {/* Immersive radial glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_rgba(59,130,246,0.08),_transparent_45%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,_rgba(16,185,129,0.05),_transparent_45%)] pointer-events-none z-0" />

      {/* 2. FULL-SCREEN SOLAR SYSTEM AREA */}
      <div className="absolute inset-0 w-full h-full z-10">
        <Model3D 
          src={solarSystemModel} 
          animationName="natural_orbit" 
          className="w-full h-full"
          scaleAdjustment={1.0} // fits screen dimensions cleanly
          colorMapping={false} 
          enableOrbitControls={true} // Drag to view from top, bottom, and sides!
          timeScale={0.12} // rotate slowly
          onClick={handleSolarSystemClick} // triggers planet notification banner
        />
      </div>

      {/* 3. FLOATING OVERLAY: Flying Saucer UFO hovering in upper right */}
      <div className="absolute top-[6%] right-[6%] z-20 w-44 h-44 md:w-52 md:h-52 flex flex-col items-center">
        <Model3D 
          src={flyingSaucerModel} 
          animationName="hover" 
          className="w-full h-full"
          scaleAdjustment={0.95} 
          autoRotate={true}
          rotationSpeed={0.006}
          colorMapping={false}
        />
      </div>

      {/* 4. TALL CHARACTER WRAPPER: Interactive Astronaut floating in lower left */}
      <div className="absolute bottom-[6%] left-[6%] z-20 w-48 h-[280px] md:w-56 md:h-[350px] flex flex-col items-center select-none pointer-events-auto">
        <Model3D 
          src={astronautModel} 
          animationName={astronautAnim} 
          className="w-full h-full"
          scaleAdjustment={0.52} 
          onClick={triggerAstronautAction}
          colorMapping={false}
        />
      </div>

      {/* 5. HOME BUTTON */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={() => {
            playPopSound();
            onBack();
          }}
          className="w-24 h-24 hover:scale-110 active:translate-y-[4px] active:scale-95 transition-all cursor-pointer select-none"
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

      {/* 6. SPACESHIP NOTIFICATION WARNING BANNER (iOS/Android Push Notification Style) */}
      <AnimatePresence>
        {showBanner && planetData && (
          <motion.div
            initial={{ y: -100, opacity: 0, x: '-50%' }}
            animate={{ y: 20, opacity: 1, x: '-50%' }}
            exit={{ y: -100, opacity: 0, x: '-50%' }}
            onClick={() => {
              playPopSound();
              setShowBanner(false);
              setActiveMode('explore'); // Opens info database directly on clicking notification!
            }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-gradient-to-r from-slate-900/95 to-purple-950/95 border-[3px] border-amber-400 rounded-2xl p-4 shadow-[0_12px_30px_rgba(245,158,11,0.4)] flex items-center justify-between cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            <div className="flex items-center gap-3 flex-row-reverse text-right">
              <span className="text-3xl animate-bounce">{planetData.icon}</span>
              <div>
                <h4 className="text-white font-black text-sm">📡 إشارة استشعار: كوكب {planetData.nameAr}!</h4>
                <p className="text-[10px] text-amber-300 font-bold">اضغط هنا لفتح وحدة الاستكشاف والهبوط 🚀</p>
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                playPopSound();
                setShowBanner(false);
              }}
              className="text-slate-400 hover:text-white p-1 ml-2 font-bold cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. INTERACTIVE PLANET EXPLORER MODALS */}
      <AnimatePresence>
        {activeMode && planetData && (
          <div className="absolute inset-0 w-full h-full bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-6">
            
            {/* MODE 1: Explore Facts Card */}
            {activeMode === 'explore' && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="w-full max-w-lg bg-gradient-to-b from-slate-900/95 to-slate-950/98 border-[4px] border-[#3b82f6] rounded-[36px] p-6 shadow-[0_0_35px_rgba(59,130,246,0.35)] relative overflow-hidden"
              >
                {/* Header Row */}
                <div className="flex items-center gap-4 border-b border-blue-500/20 pb-4 mb-6 flex-row-reverse text-right">
                  <div className="text-4xl bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20">
                    {planetData.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">معلومات كوكب {planetData.nameAr}</h3>
                    <p className="text-[10px] font-bold text-blue-400 tracking-wider">PLANETARY SCIENCE DATABASE</p>
                  </div>
                </div>

                {/* Description Body */}
                <p className="text-sm font-bold text-slate-200 leading-relaxed mb-8 text-right dir-rtl">
                  {planetData.description}
                </p>

                {/* Action panel */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      playPopSound();
                      setActiveMode('visit'); // Switch directly to visit surface
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 border-b-4 border-orange-700 text-white font-black rounded-2xl text-xs hover:scale-105 active:translate-y-[2px] transition-all cursor-pointer"
                  >
                    🚀 هبوط على السطح
                  </button>
                  <button
                    onClick={() => {
                      playPopSound();
                      setActiveMode(null); // Go back to normal view
                      setSelectedPlanet(null);
                    }}
                    className="px-6 py-3 bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded-2xl text-xs hover:bg-slate-700/50 transition-colors cursor-pointer"
                  >
                    إغلاق قاعدة البيانات ✕
                  </button>
                </div>
              </motion.div>
            )}

            {/* MODE 2: Immersive Surface Visit Simulator with REAL 3D planet */}
            {activeMode === 'visit' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#020204] via-[#05060b] to-[#010103] flex flex-col items-center justify-between p-6 z-50"
              >
                {/* Immersive Space Star Particles */}
                {stars.slice(0, 20).map(s => (
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

                {/* Top Navigation Bar */}
                <div className="w-full flex items-center justify-between border-b border-white/5 pb-4 max-w-4xl flex-row-reverse text-right">
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <span className="text-3xl animate-bounce">{planetData.icon}</span>
                    <div>
                      <h4 className="text-white font-black text-lg">سطح كوكب {planetData.nameAr}</h4>
                      <p className="text-[10px] text-amber-300 font-bold">📍 إحداثيات الهبوط: مدار الكوكب الحقيقي</p>
                    </div>
                  </div>
                  <div className="bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 text-[10px] text-amber-300 font-black">
                    🚀 هبوط آمن
                  </div>
                </div>

                {/* Immersive REAL 3D Planet close-up with astronaut */}
                <div className="relative w-full h-3/5 flex items-center justify-center max-w-4xl">
                  
                  {/* Planet Glow Backdrop */}
                  <div 
                    className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full blur-[8px] animate-pulse"
                    style={{ 
                      backgroundColor: planetData.color, 
                      opacity: 0.15,
                      boxShadow: `0 0 100px ${planetData.color}`
                    }}
                  />
                  
                  {/* ACTUAL 3D PLANET (Zoomed close-up using the focusTarget prop!) */}
                  <div className="absolute w-64 h-64 md:w-80 md:h-80 z-10 flex items-center justify-center pointer-events-none">
                    <Model3D 
                      src={solarSystemModel}
                      className="w-full h-full"
                      focusTarget={selectedPlanet || undefined} // Focus camera LOOKAT on this planet node!
                      scaleAdjustment={0.7} // Zooms camera close to planet center
                      colorMapping={false}
                      autoRotate={true}
                      rotationSpeed={0.003}
                    />
                  </div>

                  {/* 3D Astronaut walking on surface in front of the real planet */}
                  <div className="absolute w-52 h-[280px] md:w-60 md:h-[350px] z-20 top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
                    <Model3D 
                      src={astronautModel} 
                      animationName="moon_walk" 
                      className="w-full h-full"
                      scaleAdjustment={0.5} 
                      colorMapping={false}
                    />
                  </div>

                </div>

                {/* Bottom Scientific Surface Fact Alert Panel */}
                <div className="w-full max-w-lg bg-white/5 border border-white/10 p-5 rounded-[24px] backdrop-blur-md shadow-lg text-center flex flex-col items-center">
                  <span className="text-xl mb-1 text-amber-300">💡 حقيقة هامة عن السطح</span>
                  <p className="text-xs md:text-sm font-bold text-slate-200 leading-relaxed text-right dir-rtl">
                    {planetData.surfaceFact}
                  </p>
                </div>

                {/* Navigation Control return button */}
                <div className="pb-4">
                  <button
                    onClick={() => {
                      playPopSound();
                      setActiveMode(null);
                      setSelectedPlanet(null);
                    }}
                    className="px-8 py-3.5 bg-gradient-to-r from-red-500 to-rose-600 border-b-4 border-rose-800 text-white font-black rounded-2xl hover:scale-105 active:translate-y-[2px] transition-all cursor-pointer text-sm"
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
